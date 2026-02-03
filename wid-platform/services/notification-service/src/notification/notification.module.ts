
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Potentially not needed if no entities
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'; // Import ZodValidationPipe

@Module({
  imports: [], // No TypeOrmModule.forFeature needed if no entities
  providers: [NotificationService, ZodValidationPipe], // Provide ZodValidationPipe
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
