import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'enum', enum: ['ingreso', 'gasto', 'PAYMENT', 'REFUND', 'ADJUSTMENT'] })
    type: 'ingreso' | 'gasto' | 'PAYMENT' | 'REFUND' | 'ADJUSTMENT';

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ length: 3, default: 'PEN' })
    currency: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    category: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Read-only column for easy access to userId
    @Column({ name: 'user_id', nullable: true, insert: false, update: false })
    userId: string;

    // --- SaaS Payment Fields ---

    @Index()
    @Column({ name: 'organization_id', nullable: true })
    organizationId: string;

    @Column({ name: 'reference_code', nullable: true })
    referenceCode: string; // Culqi Charge ID (e.g. chr_live_...)

    @Column({ default: 'manual' })
    provider: string; // 'culqi', 'manual', etc.

    @Column({ default: 'COMPLETED' })
    status: string; // COMPLETED, PENDING, FAILED

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
