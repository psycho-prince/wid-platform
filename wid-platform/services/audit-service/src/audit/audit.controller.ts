
import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { AuditService } from './audit.service';
import { GetAuditLogRequestSchema, AuditLogEntry, ListAuditLogsResponseSchema } from '@wid-platform/contracts';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(GetAuditLogRequestSchema))
  async getAuditLogs(
    @Query() query: GetAuditLogRequestSchema,
  ): Promise<AuditLogEntry[]> {
    return this.auditService.getAuditLogs(query);
  }
}
