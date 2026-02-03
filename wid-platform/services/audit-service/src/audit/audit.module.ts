
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit.entity';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'; // Import ZodValidationPipe

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService, ZodValidationPipe], // Provide ZodValidationPipe
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
