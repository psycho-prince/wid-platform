import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';

@Injectable()
export abstract class AbstractInternalClient {
  protected readonly axiosInstance: AxiosInstance;
  protected readonly internalServiceSecret: string;
  protected abstract readonly serviceName: string; // e.g., 'AUTH_SERVICE_URL'
  protected abstract readonly baseUrlConfigKey: string; // e.g., 'AUTH_SERVICE_URL'

  protected readonly logger: Logger;

  constructor(protected configService: ConfigService) {
    this.logger = new Logger(this.constructor.name);
    this.internalServiceSecret = this.configService.get<string>('INTERNAL_SERVICE_SECRET');
    const baseUrl = this.configService.get<string>(this.baseUrlConfigKey);

    if (!baseUrl) {
      this.logger.error(`${this.baseUrlConfigKey} is not configured for ${this.serviceName}. Internal calls will fail.`);
      throw new Error(`${this.baseUrlConfigKey} is not configured.`);
    }

    this.axiosInstance = axios.create({ baseURL });

    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const timestamp = Date.now().toString();
      const userId = config.headers['x-user-id'] as string;
      const userEmail = config.headers['x-user-email'] as string;
      const correlationId = config.headers['x-correlation-id'] as string;

      const bodyData = config.data ? JSON.stringify(config.data) : '';
      const bodyHash = crypto.createHash('sha256').update(bodyData).digest('hex');

      const signature = this.generateHmacSignature(
        this.internalServiceSecret,
        config.method,
        config.url,
        timestamp,
        bodyHash,
        userId,
        userEmail
      );

      config.headers['X-Internal-Signature'] = signature;
      config.headers['X-Internal-Timestamp'] = timestamp;
      if (correlationId) config.headers['X-Correlation-Id'] = correlationId;
      if (userId) config.headers['X-User-Id'] = userId;
      if (userEmail) config.headers['X-User-Email'] = userEmail;

      this.logger.debug(`Outgoing internal request to ${this.serviceName}: ${config.method} ${config.url}, Correlation-ID: ${correlationId}`);
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logger.error(`Internal call to ${this.serviceName} failed: ${error.message}`);
        if (axios.isAxiosError(error) && error.response) {
          this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
        }
        return Promise.reject(error);
      }
    );
  }

  private generateHmacSignature(
    secret: string,
    method: string,
    path: string,
    timestamp: string,
    bodyHash: string = '',
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
}
