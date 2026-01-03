import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('dashboard_kpis')
@Unique(['user', 'kpiType', 'month', 'year'])
export class DashboardKpi {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'kpi_type', length: 50 })
    kpiType: string; // 'clientes' | 'facturas' | 'inventario'

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    value: number;

    @Column({ type: 'int' })
    month: number; // 1-12

    @Column({ type: 'int' })
    year: number; // 2024, 2025, etc.

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
