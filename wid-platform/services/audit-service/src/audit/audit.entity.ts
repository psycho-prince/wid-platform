
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { AuditLogEntry, InternalCreateAuditLog } from '@wid-platform/contracts';

@Entity('audit_logs')
export class AuditLog implements AuditLogEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  timestamp: string;

  @Column({ type: 'uuid', nullable: true })
  actorId: string | null;

  @Column({ type: 'varchar', length: 50 })
  actorType: InternalCreateAuditLog['actorType'];

  @Column({ type: 'varchar', length: 255 })
  action: string;

  @Column({ type: 'uuid', nullable: true })
  targetId: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  targetType: string | null;

  @Column({ type: 'uuid', nullable: true })
  correlationId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'varchar', length: 64 }) // SHA256 hash
  cryptographicHash: string;
}
