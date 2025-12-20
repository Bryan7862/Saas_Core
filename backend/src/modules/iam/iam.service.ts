import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
export class IamService {
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

    async assignRole(assignRoleDto: AssignRoleDto): Promise<UserRole> {
        const { userId, roleId, companyId } = assignRoleDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) throw new NotFoundException('Role not found');

        const existingAssignment = await this.userRoleRepository.findOne({
            where: { userId, roleId, companyId },
        });

        if (existingAssignment) {
            return existingAssignment;
        }

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

    // Helper for Auth Module (e.g. Register assigns OWNER Role)
    async findRoleByCode(code: string): Promise<Role | null> {
        return this.roleRepository.findOne({ where: { code } });
    }

    async countCompanyUsers(companyId: string): Promise<number> {
        return this.userRoleRepository.count({ where: { companyId } });
    }
}
