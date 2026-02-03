import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { InternalCreateAuditLog, AuditLogEntry } from '@wid-platform/contracts';

@Injectable()
export class AuditClientService {
  private readonly auditServiceUrl: string;
  private readonly internalServiceSecret: string;
  private readonly logger = new Logger(AuditClientService.name);

  constructor(private configService: ConfigService) {
    this.auditServiceUrl = this.configService.get<string>('AUDIT_SERVICE_URL');
    this.internalServiceSecret = this.configService.get<string>('INTERNAL_SERVICE_SECRET');
  }

  private generateHmacSignature(
    secret: string,
    method: string,
    path: string,
    timestamp: string,
    body: any = {},
    userId?: string,
    userEmail?: string
  ): string {
    const canonicalString = [
      method.toUpperCase(),
      path,
      timestamp,
      crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex'), // Include body hash for client
      userId || '',
      userEmail || ''
    ].join('\n');
    return crypto.createHmac('sha256', secret).update(canonicalString).digest('hex');
  }

  async sendAuditLog(auditData: Omit<InternalCreateAuditLog, 'cryptographicHash'>): Promise<AuditLogEntry | null> {
    if (!this.auditServiceUrl) {
      this.logger.warn('AUDIT_SERVICE_URL is not configured. Audit log will not be sent.');
      return null;
    }

    const path = '/api/audit'; // The endpoint on the audit service
    const method = 'POST';
    const timestamp = Date.now().toString();

    // Generate cryptographicHash for the audit entry before sending
    const dataToHashForCryptographicHash = JSON.stringify({ ...auditData, timestamp: new Date(parseInt(timestamp, 10)).toISOString() });
    const cryptographicHash = crypto.createHash('sha256').update(dataToHashForCryptographicHash).digest('hex');

    const fullAuditData: InternalCreateAuditLog = {
      ...auditData,
      timestamp: new Date(parseInt(timestamp, 10)).toISOString(), // Convert timestamp to ISO string for entity
      cryptographicHash,
    };

    const signature = this.generateHmacSignature(
      this.internalServiceSecret,
      method,
      path,
      timestamp,
      fullAuditData, // Use fullAuditData for body hash calculation
      auditData.actorId || undefined,
      auditData.actorType === 'USER' && auditData.metadata?.email ? auditData.metadata.email : undefined
    );

    try {
      const response = await axios.post<AuditLogEntry>(
        `${this.auditServiceUrl}${path}`,
        fullAuditData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-Signature': signature,
            'X-Internal-Timestamp': timestamp,
            'X-User-Id': auditData.actorId || '', // Forward actorId as userId
            'X-User-Email': auditData.actorType === 'USER' && auditData.metadata?.email ? auditData.metadata.email : '',
            'X-Correlation-Id': auditData.correlationId || '',
          },
        },
      );
      this.logger.log(`Audit log sent successfully: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to send audit log: ${error.message}`);
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error(`Audit service error response: ${JSON.stringify(error.response.data)}`);
      }
      return null;
    }
  }
}