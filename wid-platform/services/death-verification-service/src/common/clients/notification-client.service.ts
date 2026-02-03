
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractInternalClient } from './abstract-internal-client.service';

@Injectable()
export class NotificationClientService extends AbstractInternalClient {
  protected readonly serviceName = 'NotificationService';
  protected readonly baseUrlConfigKey = 'NOTIFICATION_SERVICE_URL';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async sendNotification(
    userId: string,
    type: string,
    message: string,
    correlationId: string,
  ): Promise<any> {
    try {
      this.logger.log(`Sending notification to user ${userId} (${type}), Correlation ID: ${correlationId}`);
      const response = await this.axiosInstance.post(
        '/api/notification/send',
        { userId, type, message },
        { headers: { 'X-User-Id': userId, 'X-Correlation-Id': correlationId } },
      );
      this.logger.log(`Notification sent to user ${userId}. Response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send notification to user ${userId}: ${error.message}`);
      throw error;
    }
  }
}
