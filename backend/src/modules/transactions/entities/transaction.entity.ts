import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'enum', enum: ['ingreso', 'gasto'] })
    type: 'ingreso' | 'gasto';

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column()
    description: string;

    @Column({ nullable: true })
    category: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Read-only column for easy access to userId
    @Column({ name: 'user_id', nullable: true, insert: false, update: false })
    userId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
