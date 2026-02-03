
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // All routes will be prefixed with /api
  const port = process.env.PORT || 3000;

  // Proxy for Auth Service
  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: process.env.AUTH_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '' },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying Auth: ${req.method} ${req.url} -> ${process.env.AUTH_SERVICE_URL}${req.url}`);
      },
    }),
  );

  // Proxy for User Profile Service
  app.use(
    '/api/user-profile',
    createProxyMiddleware({
      target: process.env.USER_PROFILE_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/user-profile': '' },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying User Profile: ${req.method} ${req.url} -> ${process.env.USER_PROFILE_SERVICE_URL}${req.url}`);
      },
    }),
  );

  // Proxy for Asset Vault Service
  app.use(
    '/api/asset-vault',
    createProxyMiddleware({
      target: process.env.ASSET_VAULT_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/asset-vault': '' },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying Asset Vault: ${req.method} ${req.url} -> ${process.env.ASSET_VAULT_SERVICE_URL}${req.url}`);
      },
    }),
  );

  // Proxy for Inheritance Rules Service
  app.use(
    '/api/inheritance-rules',
    createProxyMiddleware({
      target: process.env.INHERITANCE_RULES_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/inheritance-rules': '' },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying Inheritance Rules: ${req.method} ${req.url} -> ${process.env.INHERITANCE_RULES_SERVICE_URL}${req.url}`);
      },
    }),
  );

  // Proxy for Death Verification Service
  app.use(
    '/api/death-verification',
    createProxyMiddleware({
      target: process.env.DEATH_VERIFICATION_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/death-verification': '' },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying Death Verification: ${req.method} ${req.url} -> ${process.env.DEATH_VERIFICATION_SERVICE_URL}${req.url}`);
      },
    }),
  );

  // Proxy for Notification Service
  app.use(
    '/api/notification',
    createProxyMiddleware({
      target: process.env.NOTIFICATION_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { '^/api/notification': '' },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying Notification: ${req.method} ${req.url} -> ${process.env.NOTIFICATION_SERVICE_URL}${req.url}`);
      },
    }),
  );

  await app.listen(port, '0.0.0.0');
  console.log(`API Gateway listening on http://0.0.0.0:${port}/api`);
}
bootstrap();
