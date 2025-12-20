import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../iam/entities/user-role.entity';
import { Company } from '../../organizations/entities/company.entity';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
}

@Entity('usuarios')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ name: 'suspended_at', type: 'timestamp', nullable: true })
    suspendedAt: Date | null;

    @Column({ name: 'suspended_by', type: 'uuid', nullable: true })
    suspendedByUserId: string | null;

    @Column({ name: 'default_company_id', type: 'uuid', nullable: true })
    defaultCompanyId: string | null;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'default_company_id' })
    defaultCompany: Company;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => UserRole, (userRole) => userRole.user)
    userRoles: UserRole[];
}
