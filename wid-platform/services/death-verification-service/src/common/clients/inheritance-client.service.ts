
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractInternalClient } from './abstract-internal-client.service';

@Injectable()
export class InheritanceClientService extends AbstractInternalClient {
  protected readonly serviceName = 'InheritanceService';
  protected readonly baseUrlConfigKey = 'INHERITANCE_RULES_SERVICE_URL';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async evaluateRules(userId: string, correlationId: string): Promise<any> {
    try {
      this.logger.log(`Evaluating inheritance rules for user ${userId}, Correlation ID: ${correlationId}`);
      const response = await this.axiosInstance.post(
        '/api/inheritance/evaluate',
        { userId },
        { headers: { 'X-User-Id': userId, 'X-Correlation-Id': correlationId } },
      );
      this.logger.log(`Inheritance rules evaluated for user ${userId}. Response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to evaluate inheritance rules for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}
