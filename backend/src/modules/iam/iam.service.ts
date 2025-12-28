import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class IamService implements OnModuleInit {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
        @InjectRepository(RolePermission)
        private rolePermissionRepository: Repository<RolePermission>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    private readonly STANDARD_PERMISSIONS = [
        // Users Module
        { resource: 'users', action: 'create', description: 'Crear nuevos usuarios' },
        { resource: 'users', action: 'read', description: 'Ver lista de usuarios' },
        { resource: 'users', action: 'update', description: 'Editar usuarios' },
        { resource: 'users', action: 'delete', description: 'Eliminar/Suspender usuarios' },

        // Roles Module
        { resource: 'roles', action: 'create', description: 'Crear nuevos roles' },
        { resource: 'roles', action: 'read', description: 'Ver roles disponibles' },
        { resource: 'roles', action: 'update', description: 'Editar roles y permisos' },
        { resource: 'roles', action: 'delete', description: 'Eliminar roles' },

        // Billing/Subscriptions
        { resource: 'billing', action: 'read', description: 'Ver facturación y planes' },
        { resource: 'billing', action: 'update', description: 'Modificar suscripción' },

        // Reports
        { resource: 'reports', action: 'read', description: 'Ver reportes del sistema' },
    ];

    async onModuleInit() {
        await this.seedPermissions();
    }

    private async seedPermissions() {
        console.log('🌱 Seeding Permissions...');

        // 1. Create Permissions if not exist
        for (const p of this.STANDARD_PERMISSIONS) {
            const code = `${p.resource}:${p.action}`;
            let permission = await this.permissionRepository.findOne({ where: { code } });

            if (!permission) {
                console.log(`Creating permission: ${code}`);
                permission = this.permissionRepository.create({
                    code,
                    resource: p.resource,
                    action: p.action,
                    description: p.description
                });
                await this.permissionRepository.save(permission);
            }
        }

        // 2. Assign ALL permissions to OWNER role
        const ownerRole = await this.roleRepository.findOne({ where: { code: 'OWNER' } });
        if (ownerRole) {
            const allPermissions = await this.permissionRepository.find();
            for (const perm of allPermissions) {
                await this.addPermissionToRole(ownerRole.id, perm.id);
            }
        }

        console.log('✅ Permissions Seeded');
    }

    async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
        const { code, name, description } = createRoleDto;
        const existingRole = await this.roleRepository.findOne({ where: { code } });
        if (existingRole) {
            throw new BadRequestException('Role with this code already exists');
        }

        const role = this.roleRepository.create({ code, name, description });
        return this.roleRepository.save(role);
    }

    async getRoles(): Promise<Role[]> {
        return this.roleRepository.find({
            relations: ['rolePermissions', 'rolePermissions.permission'],
        });
    }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        const { code, resource, action, description } = createPermissionDto;
        const existingPermission = await this.permissionRepository.findOne({ where: { code } });
        if (existingPermission) {
            throw new BadRequestException('Permission with this code already exists');
        }

        const permission = this.permissionRepository.create({ code, resource, action, description });
        return this.permissionRepository.save(permission);
    }

    async getPermissions(): Promise<Permission[]> {
        return this.permissionRepository.find();
    }

    async assignRole(assignRoleDto: AssignRoleDto, actorId?: string): Promise<UserRole> {
        const { userId, roleId, companyId } = assignRoleDto;

        // 0. SELF-MODIFICATION CHECK
        if (actorId && userId === actorId) {
            throw new BadRequestException('No puedes modificar tu propio rol. Pide a otro administrador que lo haga.');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const newRole = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!newRole) throw new NotFoundException('Role not found');

        // HIERARCHY CHECK (If actor is executing)
        if (actorId) {
            const actorRole = await this.findUserRoleInCompany(actorId, companyId);

            // 1. If trying to assign OWNER role, Actor MUST be OWNER
            if (newRole.code === 'OWNER') {
                if (!actorRole || actorRole.role.code !== 'OWNER') {
                    throw new BadRequestException('Solo un Propietario (Owner) puede nombrar nuevos Owners.');
                }
            }
        }

        // 1. Find ALL existing assignments for this company (to handle potential legacy duplicates)
        const existingAssignments = await this.userRoleRepository.find({
            where: { userId, companyId },
            relations: ['role']
        });

        // 2. OWNER PROTECTION & Optimization
        // Check if we are already in the desired state (strictly one role, and it's the requested one)
        if (existingAssignments.length === 1 && existingAssignments[0].roleId === roleId) {
            return existingAssignments[0];
        }

        // Check if ANY of the current roles is OWNER and we are removing it (by replacing with non-OWNER)
        const isCurrentlyOwner = existingAssignments.some(ur => ur.role.code === 'OWNER');

        if (isCurrentlyOwner && newRole.code !== 'OWNER') {
            // HIERARCHY CHECK: Only Owner can demote Owner
            if (actorId) {
                const actorRole = await this.findUserRoleInCompany(actorId, companyId);
                if (!actorRole || actorRole.role.code !== 'OWNER') {
                    throw new BadRequestException('Solo un Propietario puede cambiar el rol de otro Propietario.');
                }
            }

            const ownerRole = await this.roleRepository.findOne({ where: { code: 'OWNER' } });
            if (ownerRole) {
                const ownerCount = await this.userRoleRepository.count({
                    where: {
                        roleId: ownerRole.id,
                        companyId: companyId
                    }
                });

                // If currently owner, they contribute 1 to the count.
                // If count is 1, they are the ONLY owner.
                if (ownerCount <= 1) {
                    throw new BadRequestException('No puedes cambiar el rol del último PROPIETARIO (Owner). Asigna otro Owner primero.');
                }
            }
        }

        // 3. DELETE ALL existing roles for this user in this company
        // This cleans up any legacy multi-role data
        if (existingAssignments.length > 0) {
            await this.userRoleRepository.remove(existingAssignments);
        }

        // 4. CREATE New Assignment
        const userRole = this.userRoleRepository.create({
            userId,
            roleId,
            companyId,
        });

        return this.userRoleRepository.save(userRole);
    }

    async addPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission> {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) throw new NotFoundException('Role not found');

        const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
        if (!permission) throw new NotFoundException('Permission not found');

        const existing = await this.rolePermissionRepository.findOne({
            where: { roleId, permissionId },
        });

        if (existing) return existing;

        const rolePermission = this.rolePermissionRepository.create({
            roleId,
            permissionId,
        });

        return this.rolePermissionRepository.save(rolePermission);
    }

    async syncRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) throw new NotFoundException('Role not found');

        // Delete existing
        await this.rolePermissionRepository.delete({ roleId });

        // Add new
        const newRelations = permissionIds.map(pid => this.rolePermissionRepository.create({
            roleId,
            permissionId: pid
        }));

        await this.rolePermissionRepository.save(newRelations);
    }

    // Helper for Auth Module (e.g. Register assigns OWNER Role)
    async findRoleByCode(code: string): Promise<Role | null> {
        return this.roleRepository.findOne({ where: { code } });
    }

    async countCompanyUsers(companyId: string): Promise<number> {
        return this.userRoleRepository.count({ where: { companyId } });
    }

    async findUserRoleInCompany(userId: string, companyId: string): Promise<UserRole | null> {
        return this.userRoleRepository.findOne({
            where: { userId, companyId },
            relations: ['role'],
        });
    }

    async deleteRole(roleId: string): Promise<void> {
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) throw new NotFoundException('Role not found');

        // 1. Protect System Roles
        if (['OWNER', 'ADMIN', 'MEMBER'].includes(role.code)) {
            throw new BadRequestException('No puedes eliminar roles del sistema (OWNER, ADMIN, MEMBER).');
        }

        // 2. Check Usage
        const usageCount = await this.userRoleRepository.count({ where: { roleId } });
        if (usageCount > 0) {
            throw new BadRequestException(`No puedes eliminar este rol porque está asignado a ${usageCount} usuarios. Reasigna esos usuarios primero.`);
        }

        await this.roleRepository.remove(role);
    }
}
