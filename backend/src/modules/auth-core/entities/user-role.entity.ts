import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('usuarios_roles')
@Unique(['userId', 'companyId', 'roleId'])
export class UserRole {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'company_id' })
    companyId: string;

    @Column({ name: 'role_id' })
    roleId: string;

    @ManyToOne(() => User, (user) => user.userRoles)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Role, (role) => role.userRoles)
    @JoinColumn({ name: 'role_id' })
    role: Role;
}
