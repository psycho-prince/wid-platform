
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeathVerification } from './death-verification.entity';
import { DeathVerificationService } from './death-verification.service';
import { DeathVerificationController } from './death-verification.controller';
import { AuditClientService } from '../common/clients/audit-client.service';
import { InheritanceClientService } from '../common/clients/inheritance-client.service';
import { AssetVaultClientService } from '../common/clients/asset-vault-client.service';
import { NotificationClientService } from '../common/clients/notification-client.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeathVerification])],
  providers: [
    DeathVerificationService,
    AuditClientService,
    InheritanceClientService,
    AssetVaultClientService,
    NotificationClientService,
  ],
  controllers: [DeathVerificationController],
  exports: [DeathVerificationService],
})
export class DeathVerificationModule {}
