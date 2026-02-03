import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeathVerification, DeathVerificationStatus } from './death-verification.entity'; // Import DeathVerificationStatus
import { ConfigService } from '@nestjs/config';
import axios from 'axios'; // For internal service calls
import { InternalCreateAuditLog } from '@wid-platform/contracts';

// Placeholder client definitions - will be replaced by actual clients later
interface AuditClientService {
  sendAuditLog(auditData: Omit<InternalCreateAuditLog, 'cryptographicHash'>): Promise<any>;
}
interface InheritanceClientService {
  evaluateRules(userId: string, correlationId: string): Promise<any>;
}
interface AssetVaultClientService {
  markAssetsAsReleasable(userId: string, correlationId: string): Promise<any>;
}
interface NotificationClientService {
  sendNotification(userId: string, type: string, message: string, correlationId: string): Promise<any>;
}

@Injectable()
export class DeathVerificationService {
  private readonly logger = new Logger(DeathVerificationService.name);

  constructor(
    @InjectRepository(DeathVerification)
    private deathVerificationRepository: Repository<DeathVerification>,
    private configService: ConfigService,
    // Inject placeholder clients - will be concrete implementations later
    private auditClient: AuditClientService,
    private inheritanceClient: InheritanceClientService,
    private assetVaultClient: AssetVaultClientService,
    private notificationClient: NotificationClientService,
  ) {}

  async createVerificationRequest(userId: string, verificationData: Record<string, any>, correlationId: string): Promise<DeathVerification> {
    const existing = await this.deathVerificationRepository.findOne({ where: { userId, status: DeathVerificationStatus.UNVERIFIED } });
    if (existing) {
      throw new BadRequestException('Outstanding unverified request already exists for this user.');
    }

    const verification = this.deathVerificationRepository.create({
      userId,
      verificationData,
      status: DeathVerificationStatus.PENDING_REVIEW,
    });
    const savedVerification = await this.deathVerificationRepository.save(verification);

    this.auditClient.sendAuditLog({
      actorType: 'USER', // Assuming user initiates this
      actorId: userId,
      action: 'DEATH_VERIFICATION_REQUESTED',
      targetType: 'DEATH_VERIFICATION',
      targetId: savedVerification.id,
      correlationId: correlationId,
      metadata: { status: savedVerification.status },
    });
    this.logger.log(`Death verification request created for user ${userId}. ID: ${savedVerification.id}. Correlation ID: ${correlationId}`);
    return savedVerification;
  }

  async updateVerificationStatus(
    verificationId: string,
    status: DeathVerificationStatus,
    reviewerId: string,
    reviewerNotes: Record<string, any>,
    correlationId: string,
  ): Promise<DeathVerification> {
    const verification = await this.deathVerificationRepository.findOne({ where: { id: verificationId } });
    if (!verification) {
      throw new NotFoundException(`Death verification request with ID ${verificationId} not found.`);
    }

    const oldStatus = verification.status;
    verification.status = status;
    verification.reviewerId = reviewerId;
    verification.reviewerNotes = reviewerNotes;
    if (status === DeathVerificationStatus.VERIFIED) {
      verification.verifiedAt = new Date();
    } else if (status === DeathVerificationStatus.REJECTED) {
      verification.rejectedAt = new Date();
    }

    const updatedVerification = await this.deathVerificationRepository.save(verification);

    this.auditClient.sendAuditLog({
      actorType: 'SYSTEM', // Assuming admin/system triggered this
      actorId: reviewerId,
      action: `DEATH_VERIFICATION_STATUS_UPDATED_${status.toUpperCase()}`,
      targetType: 'DEATH_VERIFICATION',
      targetId: updatedVerification.id,
      correlationId: correlationId,
      metadata: { oldStatus, newStatus: status, userId: verification.userId },
    });
    this.logger.log(`Death verification ID ${verificationId} status changed from ${oldStatus} to ${status}. Correlation ID: ${correlationId}`);

    if (status === DeathVerificationStatus.VERIFIED) {
      await this.handleVerifiedStatus(updatedVerification.userId, correlationId);
    }

    return updatedVerification;
  }

  async getVerificationById(id: string): Promise<DeathVerification> {
    const verification = await this.deathVerificationRepository.findOne({ where: { id } });
    if (!verification) {
      throw new NotFoundException(`Death verification request with ID ${id} not found.`);
    }
    return verification;
  }

  async getAllVerifications(): Promise<DeathVerification[]> {
    return this.deathVerificationRepository.find();
  }

  private async handleVerifiedStatus(userId: string, correlationId: string) {
    this.logger.log(`Handling VERIFIED status for user ${userId}. Triggering inheritance execution, asset release, and notifications. Correlation ID: ${correlationId}`);

    // Evaluate inheritance rules
    await this.inheritanceClient.evaluateRules(userId, correlationId);
    this.auditClient.sendAuditLog({
      actorType: 'SYSTEM',
      action: 'INHERITANCE_RULES_EVALUATED',
      targetType: 'USER',
      targetId: userId,
      correlationId: correlationId,
      metadata: { trigger: 'DEATH_VERIFIED' },
    });

    // Mark assets as releasable
    await this.assetVaultClient.markAssetsAsReleasable(userId, correlationId);
    this.auditClient.sendAuditLog({
      actorType: 'SYSTEM',
      action: 'ASSETS_MARKED_RELEASABLE',
      targetType: 'USER',
      targetId: userId,
      correlationId: correlationId,
      metadata: { trigger: 'DEATH_VERIFIED' },
    });

    // Trigger notifications
    await this.notificationClient.sendNotification(
      userId,
      'death_verified',
      'Your death has been verified. Inheritance process initiated.',
      correlationId,
    );
    this.auditClient.sendAuditLog({
      actorType: 'SYSTEM',
      action: 'NOTIFICATION_SENT',
      targetType: 'USER',
      targetId: userId,
      correlationId: correlationId,
      metadata: { notificationType: 'death_verified' },
    });
  }
}