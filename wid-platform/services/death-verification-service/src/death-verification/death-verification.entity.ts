
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DeathVerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING_REVIEW = 'pending_review',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Entity('death_verifications')
export class DeathVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string; // The user whose death is being verified

  @Column({ type: 'enum', enum: DeathVerificationStatus, default: DeathVerificationStatus.UNVERIFIED })
  status: DeathVerificationStatus;

  @Column({ type: 'jsonb', nullable: true })
  verificationData: Record<string, any>; // e.g., death certificate details, source of verification

  @Column({ type: 'uuid', nullable: true })
  reviewerId: string; // Admin who reviewed it

  @Column({ type: 'jsonb', nullable: true })
  reviewerNotes: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  rejectedAt: Date;
}
