import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { AuditClientService } from './audit-client/audit-client.service';
import { InternalCreateAuditLog } from '@wid-platform/contracts';
import { HttpExceptionFilter } from './common/filters/http-exception.filter'; // Import HttpExceptionFilter

dotenv.config();

// Helper to generate HMAC signature (simplified for MVP without body hashing due to proxy middleware complexities)
function generateHmacSignature(
  secret: string,
  method: string,
  path: string,
  timestamp: string,
  bodyHash: string = '', // Now explicitly passing body hash
  userId?: string,
  userEmail?: string
): string {
  const canonicalString = [
    method.toUpperCase(),
    path,
    timestamp,
    bodyHash,
    userId || '',
    userEmail || ''
  ].join('\n');
  return crypto.createHmac('sha256', secret).update(canonicalString).digest('hex');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.useGlobalFilters(new HttpExceptionFilter()); // Register global exception filter

  const configService = app.get(ConfigService);
  const jwtSecret = configService.get<string>('JWT_SECRET');
  const internalServiceSecret = configService.get<string>('INTERNAL_SERVICE_SECRET');
  const auditClientService = app.get(AuditClientService);
  const logger = new Logger('API-Gateway');

  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3000;

  // Raw body parser middleware for HMAC signing
  app.use((req: any, res: any, next: Function) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        req.rawBody = data;
        if (req.headers['content-type'] === 'application/json' && data) {
          try {
            req.body = JSON.parse(data);
          } catch (e) {
            logger.error(`Failed to parse JSON body for ${req.originalUrl}: ${e.message}`);
            req.body = {}; // Fallback to empty object
          }
        }
        next();
      });
    } else {
      next();
    }
  });


  // --- JWT Verification Middleware ---
  app.use('*', (req: any, res: any, next: Function) => {
    // Define which routes require authentication.
    const protectedRoutes = [
      '/api/user-profile',
      '/api/asset-vault',
      '/api/inheritance-rules',
      '/api/death-verification',
      '/api/notification',
      '/api/audit',
    ];

    const requiresAuth = protectedRoutes.some(route => req.originalUrl.startsWith(route));
    const isLoginOrRegister = req.originalUrl.startsWith('/api/auth/login') || req.originalUrl.startsWith('/api/auth/register');

    if (requiresAuth && !isLoginOrRegister) {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn(`Unauthorized access attempt (no token): ${req.method} ${req.originalUrl}`);
        // Audit failed access
        auditClientService.sendAuditLog({
          actorType: 'SYSTEM', // Actor is unknown or system for failed auth
          action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          targetType: 'API_ENDPOINT',
          targetId: null,
          correlationId: req.headers['x-correlation-id'] as string,
          metadata: {
            method: req.method,
            url: req.originalUrl,
            reason: 'Missing or malformed Authorization header',
            ip: req.ip,
          },
        });
        return res.status(401).send('Unauthorized');
      }

      const token = authHeader.split(' ')[1];
      try {
        const decoded = verify(token, jwtSecret);
        req.headers['x-user-id'] = decoded.sub;
        req.headers['x-user-email'] = decoded.email;
        req.user = decoded; // Attach for logging/auditing in gateway
        next();
      } catch (err) {
        logger.warn(`Invalid token for ${req.originalUrl}: ${err.message}`);
        // Audit failed access
        auditClientService.sendAuditLog({
          actorType: 'SYSTEM', // Actor is unknown or system for failed auth
          action: 'INVALID_TOKEN_ACCESS_ATTEMPT',
          targetType: 'API_ENDPOINT',
          targetId: null,
          correlationId: req.headers['x-correlation-id'] as string,
          metadata: {
            method: req.method,
            url: req.originalUrl,
            reason: err.message,
            token: token,
            ip: req.ip,
          },
        });
        return res.status(401).send('Unauthorized: Invalid Token');
      }
    } else {
      next(); // Continue for unprotected routes or login/register
    }
  });

  // --- Proxying Logic ---
  const services = {
    auth: { path: '/api/auth', target: configService.get<string>('AUTH_SERVICE_URL') },
    userProfile: { path: '/api/user-profile', target: configService.get<string>('USER_PROFILE_SERVICE_URL') },
    assetVault: { path: '/api/asset-vault', target: configService.get<string>('ASSET_VAULT_SERVICE_URL') },
    inheritanceRules: { path: '/api/inheritance-rules', target: configService.get<string>('INHERITANCE_RULES_SERVICE_URL') },
    deathVerification: { path: '/api/death-verification', target: configService.get<string>('DEATH_VERIFICATION_SERVICE_URL') },
    notification: { path: '/api/notification', target: configService.get<string>('NOTIFICATION_SERVICE_URL') },
    audit: { path: '/api/audit', target: configService.get<string>('AUDIT_SERVICE_URL') },
  };

  for (const serviceName in services) {
    const service = services[serviceName];
    if (service.target) {
      app.use(
        service.path,
        createProxyMiddleware({
          target: service.target,
          changeOrigin: true,
          pathRewrite: { [`^${service.path}`]: '' },
          onProxyReq: (proxyReq, req: any, res) => {
            // Correlation ID
            const correlationId = req.headers['x-correlation-id'] || `corr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            proxyReq.setHeader('x-correlation-id', correlationId);

            // User Info (already set by JWT middleware for protected routes)
            const userId = req.headers['x-user-id'] as string;
            const userEmail = req.headers['x-user-email'] as string;

            // HMAC Signing for Internal Requests
            const timestamp = Date.now().toString();
            proxyReq.setHeader('X-Internal-Timestamp', timestamp);

            const bodyHash = req.rawBody ? crypto.createHash('sha256').update(req.rawBody).digest('hex') : '';

            const signature = generateHmacSignature(
              internalServiceSecret,
              req.method,
              proxyReq.path, // Use proxyReq.path as it's the rewritten path
              timestamp,
              bodyHash,
              userId,
              userEmail
            );
            proxyReq.setHeader('X-Internal-Signature', signature);

            // Set user headers for internal services if they were derived from JWT
            if (userId) proxyReq.setHeader('x-user-id', userId);
            if (userEmail) proxyReq.setHeader('x-user-email', userEmail);


            logger.debug(`Proxying ${serviceName}: ${req.method} ${req.originalUrl} -> ${service.target}${proxyReq.path}, Correlation-ID: ${correlationId}`);

            // Audit successful request to internal service
            auditClientService.sendAuditLog({
              actorType: userId ? 'USER' : 'SYSTEM',
              actorId: userId || null,
              action: `PROXY_REQUEST_${req.method}`,
              targetType: `SERVICE_${serviceName.toUpperCase()}`,
              targetId: null, // Specific target ID might be in path, can parse later
              correlationId: correlationId,
              metadata: {
                originalUrl: req.originalUrl,
                proxyTarget: `${service.target}${proxyReq.path}`,
                method: req.method,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
              },
            });
          },
          onProxyRes: (proxyRes, req: any, res) => {
            // Audit response (especially errors)
            if (proxyRes.statusCode >= 400) {
              auditClientService.sendAuditLog({
                actorType: req.user?.userId ? 'USER' : 'SYSTEM',
                actorId: req.user?.userId || null,
                action: `PROXY_RESPONSE_ERROR`,
                targetType: `SERVICE_${serviceName.toUpperCase()}`,
                targetId: null,
                correlationId: req.headers['x-correlation-id'] as string,
                metadata: {
                  originalUrl: req.originalUrl,
                  proxyTarget: `${service.target}${req.url}`,
                  method: req.method,
                  statusCode: proxyRes.statusCode,
                  statusMessage: proxyRes.statusMessage,
                },
              });
            }
          },
          onError: (err, req: any, res) => {
            logger.error(`Proxy error for ${serviceName} ${req.method} ${req.originalUrl}: ${err.message}`);
            // Audit proxy error
            auditClientService.sendAuditLog({
              actorType: req.user?.userId ? 'USER' : 'SYSTEM',
              actorId: req.user?.userId || null,
              action: `PROXY_ERROR`,
              targetType: `SERVICE_${serviceName.toUpperCase()}`,
              targetId: null,
              correlationId: req.headers['x-correlation-id'] as string,
              metadata: {
                originalUrl: req.originalUrl,
                method: req.method,
                errorMessage: err.message,
                ip: req.ip,
              },
            });
            res.status(500).send('Proxy Error');
          }
        }),
      );
      logger.log(`Proxy setup for ${service.path} -> ${service.target}`);
    } else {
      logger.warn(`Service ${serviceName} target URL not configured. Proxy will not be set up for it.`);
    }
  }


  await app.listen(port, '0.0.0.0');
  logger.log(`API Gateway listening on http://0.0.0.0:${port}/api`);
}
bootstrap();