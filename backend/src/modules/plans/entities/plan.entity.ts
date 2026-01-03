import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('planes')
export class Plan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string; // FREE, BASIC, PRO, MAX

    @Column()
    name: string; // Gratuito, Emprendedor, Empresarial

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    pricePe: number; // Price in Peru Soles

    @Column({ nullable: true })
    culqiPlanId: string; // For future sync with Culqi

    @Column({ type: 'jsonb', default: {} })
    features: {
        maxUsers: number;
        maxStorage: string;
        canAccessAnalytics: boolean;
    };

    // Removed OneToMany Subscription to avoid circular module dependency.
    // Subscriptions module depends on Plans, Plans is independent.

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
