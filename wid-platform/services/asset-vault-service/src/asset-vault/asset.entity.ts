
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AssetResponse } from '@wid-platform/contracts';

@Entity('assets')
export class Asset implements AssetResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 50 })
  type: string; // e.g., 'crypto', 'document', 'social_media_account'

  @Column({ type: 'text' })
  encryptedDetails: string; // Placeholder for encrypted asset details

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ type: 'boolean', default: false })
  isReleasable: boolean; // Indicates if ready for inheritance

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
