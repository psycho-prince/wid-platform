
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';
import { InternalCreateAuditLog, AuditLogEntry } from '@wid-platform/contracts';
import * as crypto from 'crypto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async createAuditLog(
    auditData: Omit<InternalCreateAuditLog, 'cryptographicHash' | 'timestamp'>,
  ): Promise<AuditLogEntry> {
    const timestamp = new Date().toISOString();
    const dataToHash = JSON.stringify({ ...auditData, timestamp });
    const cryptographicHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    const auditLog = this.auditLogRepository.create({
      ...auditData,
      timestamp,
      cryptographicHash,
    });

    try {
      // Ensure append-only by only allowing save
      await this.auditLogRepository.save(auditLog);
      return auditLog;
    } catch (error) {
      this.logger.error(`Failed to save audit log: ${error.message}`);
      throw new BadRequestException('Failed to create audit log entry.');
    }
  }

  async getAuditLogs(
    query: {
      actorId?: string;
      targetId?: string;
      action?: string;
      correlationId?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<AuditLogEntry[]> {
    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');

    if (query.actorId) {
      queryBuilder.andWhere('audit_log.actorId = :actorId', { actorId: query.actorId });
    }
    if (query.targetId) {
      queryBuilder.andWhere('audit_log.targetId = :targetId', { targetId: query.targetId });
    }
    if (query.action) {
      queryBuilder.andWhere('audit_log.action = :action', { action: query.action });
    }
    if (query.correlationId) {
      queryBuilder.andWhere('audit_log.correlationId = :correlationId', { correlationId: query.correlationId });
    }
    if (query.startDate) {
      queryBuilder.andWhere('audit_log.timestamp >= :startDate', { startDate: query.startDate });
    }
    if (query.endDate) {
      queryBuilder.andWhere('audit_log.timestamp <= :endDate', { endDate: query.endDate });
    }

    queryBuilder.orderBy('audit_log.timestamp', 'DESC');
    queryBuilder.take(query.limit || 50);
    queryBuilder.skip(query.offset || 0);

    return queryBuilder.getMany();
  }
}
