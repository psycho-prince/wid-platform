
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InheritanceRuleResponse } from '@wid-platform/contracts';

@Entity('inheritance_rules')
export class InheritanceRule implements InheritanceRuleResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ownerId: string;

  @Column({ type: 'uuid' })
  heirId: string;

  @Column({ type: 'uuid', nullable: true })
  assetId: string | null;

  @Column({ type: 'varchar', length: 255 })
  condition: string;

  @Column({ type: 'int', nullable: true })
  delayDays: number | null;

  @Column({ type: 'enum', enum: ['active', 'pending_execution', 'executed', 'cancelled'], default: 'active' })
  status: 'active' | 'pending_execution' | 'executed' | 'cancelled';

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
