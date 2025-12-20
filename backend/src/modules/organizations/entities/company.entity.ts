import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum CompanyStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

@Entity('empresas')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'enum', enum: CompanyStatus, default: CompanyStatus.ACTIVE })
    status: CompanyStatus;

    @Column({ name: 'suspended_at', type: 'timestamp', nullable: true })
    suspendedAt: Date | null;

    @Column({ name: 'suspended_by', type: 'uuid', nullable: true })
    suspendedByUserId: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
