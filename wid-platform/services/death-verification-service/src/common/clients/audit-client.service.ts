
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractInternalClient } from './abstract-internal-client.service';
import { InternalCreateAuditLog, AuditLogEntry } from '@wid-platform/contracts';

@Injectable()
export class AuditClientService extends AbstractInternalClient {
  protected readonly serviceName = 'AuditService';
  protected readonly baseUrlConfigKey = 'AUDIT_SERVICE_URL';

  constructor(configService: ConfigService) {
    super(configService);
  }

  async sendAuditLog(auditData: Omit<InternalCreateAuditLog, 'cryptographicHash'>): Promise<AuditLogEntry | null> {
    const timestamp = new Date().toISOString();
    const dataToHashForCryptographicHash = JSON.stringify({ ...auditData, timestamp });
    const cryptographicHash = this.generateHash(dataToHashForCryptographicHash);

    const fullAuditData: InternalCreateAuditLog = {
      ...auditData,
      timestamp,
      cryptographicHash,
    };

    try {
      const response = await this.axiosInstance.post<AuditLogEntry>('/api/audit', fullAuditData, {
        headers: {
            'X-User-Id': auditData.actorId || '',
            'X-User-Email': auditData.actorType === 'USER' && auditData.metadata?.email ? auditData.metadata.email : '',
            'X-Correlation-Id': auditData.correlationId || '',
        }
      });
      this.logger.log(`Audit log sent successfully: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send audit log: ${error.message}`);
      return null;
    }
  }

  private generateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
