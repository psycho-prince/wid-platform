
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractInternalClient } from './abstract-internal-client.service';

@Injectable()
export class AssetVaultClientService extends AbstractInternalClient {
  protected readonly serviceName = 'AssetVaultService';
  protected readonly baseUrlConfigKey = 'ASSET_VAULT_SERVICE_URL';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async markAssetsAsReleasable(userId: string, correlationId: string): Promise<any> {
    try {
      this.logger.log(`Marking assets as releasable for user ${userId}, Correlation ID: ${correlationId}`);
      const response = await this.axiosInstance.post(
        '/api/asset-vault/mark-releasable',
        { userId },
        { headers: { 'X-User-Id': userId, 'X-Correlation-Id': correlationId } },
      );
      this.logger.log(`Assets marked releasable for user ${userId}. Response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to mark assets as releasable for user ${userId}: ${error.message}`);
      throw error;
    }
  }
}
