
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { AssetVaultService } from './asset-vault.service';
import { AssetVaultController } from './asset-vault.controller';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'; // Import ZodValidationPipe

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetVaultService, ZodValidationPipe], // Provide ZodValidationPipe
  controllers: [AssetVaultController],
  exports: [AssetVaultService],
})
export class AssetVaultModule {}
