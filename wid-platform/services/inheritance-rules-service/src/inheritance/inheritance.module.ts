
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InheritanceRule } from './inheritance-rule.entity';
import { InheritanceService } from './inheritance.service';
import { InheritanceController } from './inheritance.controller';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'; // Import ZodValidationPipe

@Module({
  imports: [TypeOrmModule.forFeature([InheritanceRule])],
  providers: [InheritanceService, ZodValidationPipe], // Provide ZodValidationPipe
  controllers: [InheritanceController],
  exports: [InheritanceService],
})
export class InheritanceModule {}
