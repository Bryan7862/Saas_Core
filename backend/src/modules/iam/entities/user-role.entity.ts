import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Role } from './role.entity';
import { Company } from '../../organizations/entities/company.entity';

@Entity('usuarios_roles')
@Unique(['userId', 'companyId', 'roleId'])
export class UserRole {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ name: 'user_id' })
    userId: string;

    @Index()
    @Column({ name: 'company_id' })
    companyId: string;

    @Column({ name: 'role_id' })
    roleId: string;

    @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;
}
