
import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HmacAuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HmacAuthMiddleware.name);

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const internalServiceSecret = this.configService.get<string>('INTERNAL_SERVICE_SECRET');

    // Allow direct access to health check endpoint without HMAC
    // Assuming health check is at /api/health
    if (req.originalUrl === '/api/health') {
        return next();
    }

    const signature = req.headers['x-internal-signature'] as string;
    const timestamp = req.headers['x-internal-timestamp'] as string;
    const userId = req.headers['x-user-id'] as string;
    const userEmail = req.headers['x-user-email'] as string;
    const correlationId = req.headers['x-correlation-id'] as string;


    if (!signature || !timestamp) {
      this.logger.warn(`HMAC verification failed for ${req.method} ${req.originalUrl}: Missing signature or timestamp. Correlation ID: ${correlationId}`);
      throw new UnauthorizedException('Missing internal signature or timestamp');
    }

    // Replay attack protection (e.g., allow requests within 5 minutes)
    const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
    if (Date.now() - parseInt(timestamp, 10) > FIVE_MINUTES_IN_MS) {
      this.logger.warn(`HMAC verification failed for ${req.method} ${req.originalUrl}: Timestamp too old. Correlation ID: ${correlationId}`);
      throw new UnauthorizedException('Request timestamp too old');
    }

    // Reconstruct canonical string - must match gateway's generation exactly
    const canonicalString = [
      req.method.toUpperCase(),
      req.baseUrl + req.path, // req.baseUrl will be '/api' after global prefix, req.path is path after baseUrl
      timestamp,
      userId || '',
      userEmail || ''
    ].join('\n');

    const expectedSignature = crypto.createHmac('sha256', internalServiceSecret)
      .update(canonicalString)
      .digest('hex');

    if (signature !== expectedSignature) {
      this.logger.warn(`HMAC verification failed for ${req.method} ${req.originalUrl}: Signature mismatch. Correlation ID: ${correlationId}`);
      throw new UnauthorizedException('Invalid internal signature');
    }

    // Attach user info to request for downstream handlers if present
    if (userId) (req as any).user = { userId, email: userEmail };
    // Attach correlation ID
    if (correlationId) (req as any).correlationId = correlationId;

    next();
  }
}
