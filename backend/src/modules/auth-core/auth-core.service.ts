import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserRole } from './entities/user-role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RegisterDto } from './dto/register.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class AuthCoreService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
        @InjectRepository(RolePermission)
        private rolePermissionRepository: Repository<RolePermission>,
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) { }

    async register(registerDto: RegisterDto): Promise<User> {
        const { email, password, firstName, lastName, companyName } = registerDto;

        // 1. Check if user exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // 2. Create Company
        const company = this.companyRepository.create({
            name: companyName,
            // Simple slug generation
            slug: companyName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now(),
        });
        const savedCompany = await this.companyRepository.save(company);

        // 3. Create User
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            email,
            passwordHash,
            firstName,
            lastName,
            defaultCompany: savedCompany,
            defaultCompanyId: savedCompany.id,
        });
        const savedUser = await this.userRepository.save(user);

        // 4. Assign OWNER role
        // Ensure OWNER role exists (simple check for now)
        let ownerRole = await this.roleRepository.findOne({ where: { code: 'OWNER' } });
        if (!ownerRole) {
            ownerRole = this.roleRepository.create({
                code: 'OWNER',
                name: 'Propietario',
                description: 'Propietario de la Empresa',
            });
            ownerRole = await this.roleRepository.save(ownerRole);
        }

        const userRole = this.userRoleRepository.create({
            userId: savedUser.id,
            roleId: ownerRole.id,
            companyId: savedCompany.id,
        });
        await this.userRoleRepository.save(userRole);

        return savedUser;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, defaultCompanyId, firstName, lastName } = createUserDto;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            email,
            passwordHash,
            defaultCompanyId,
            firstName,
            lastName,
        });

        return this.userRepository.save(user);
    }

    async getUsers(): Promise<User[]> {
        return this.userRepository.find({
            relations: ['userRoles', 'userRoles.role'],
        });
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
        const { code, description } = createPermissionDto;
        const existingPermission = await this.permissionRepository.findOne({ where: { code } });
        if (existingPermission) {
            throw new BadRequestException('Permission with this code already exists');
        }

        const permission = this.permissionRepository.create({ code, description });
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
            return existingAssignment; // Or throw error if strict
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
}
