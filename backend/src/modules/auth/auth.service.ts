import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { IamService } from '../iam/iam.service';

const MAX_USERS_PER_ORGANIZATION = 8;

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly organizationsService: OrganizationsService,
        private readonly iamService: IamService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<User> {
        const { email, password, firstName, lastName, companyName } = registerDto;

        // 1. Check if user exists
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // 2. Create Company (Delegated)
        const savedCompany = await this.organizationsService.create(null, { name: companyName });

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

        // 4. Assign OWNER role (Delegated)
        let ownerRole = await this.iamService.findRoleByCode('OWNER');
        if (!ownerRole) {
            // Auto-create OWNER role if not exists (Bootstrap logic)
            ownerRole = await this.iamService.createRole({
                code: 'OWNER',
                name: 'Owner',
                description: 'Company Owner',
            });
        }

        // Assign role using IAM Service
        await this.iamService.assignRole({
            userId: savedUser.id,
            roleId: ownerRole.id,
            companyId: savedCompany.id,
        });

        return savedUser;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, defaultCompanyId, firstName, lastName } = createUserDto;

        if (defaultCompanyId) {
            const currentUsersCount = await this.iamService.countCompanyUsers(defaultCompanyId);
            if (currentUsersCount >= MAX_USERS_PER_ORGANIZATION) {
                throw new BadRequestException(`Has alcanzado el número máximo de usuarios permitidos para esta organización (${MAX_USERS_PER_ORGANIZATION}).`);
            }
        }

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

        const savedUser = await this.userRepository.save(user);

        // Auto-assign 'MEMBER' role so user appears in the organization
        if (defaultCompanyId) {
            let memberRole = await this.iamService.findRoleByCode('MEMBER');
            if (!memberRole) {
                memberRole = await this.iamService.createRole({
                    code: 'MEMBER',
                    name: 'Member',
                    description: 'Standard Organization Member',
                });
            }
            await this.iamService.assignRole({
                userId: savedUser.id,
                roleId: memberRole.id,
                companyId: defaultCompanyId,
            });
        }

        return savedUser;
    }

    async getAllSystemUsers(): Promise<User[]> {
        // Global access for SUPER_ADMIN only
        return this.userRepository.find({
            relations: ['userRoles', 'userRoles.role'],
        });
    }

    async getUsers(requestingUserId: string, companyId?: string): Promise<User[]> {
        console.log(`[getUsers] Requesting: ${requestingUserId}, Company: ${companyId}`); // DEBUG

        if (!companyId) {
            console.warn('[getUsers] No companyId provided'); // DEBUG
            return [];
        }

        // SECURITY CHECK: Verify requesting user belongs to the target company
        const membership = await this.userRepository.createQueryBuilder('user')
            .leftJoin('user.userRoles', 'userRole')
            .where('user.id = :userId', { userId: requestingUserId })
            .andWhere('userRole.companyId = :companyId', { companyId })
            // Ensure requester themselves are active
            .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
            .getOne();

        if (!membership) {
            console.error(`[getUsers] Access Denied for ${requestingUserId} in ${companyId}`); // DEBUG
            throw new BadRequestException('Access Denied: You are not a member of this organization context or your account is suspended');
        }

        const query = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userRoles', 'userRole')
            .leftJoinAndSelect('userRole.role', 'role')
            .where('userRole.companyId = :companyId', { companyId })
            // FILTER: Only show ACTIVE users
            .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

        const results = await query.getMany();
        console.log(`[getUsers] Found ${results.length} users`); // DEBUG
        return results;
    }

    async suspendUser(userId: string, performedByUserId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        user.status = UserStatus.SUSPENDED;
        user.suspendedAt = new Date();
        user.suspendedByUserId = performedByUserId;

        return this.userRepository.save(user);
    }

    async restoreUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        user.status = UserStatus.ACTIVE;
        user.suspendedAt = null;
        user.suspendedByUserId = null;

        return this.userRepository.save(user);
    }

    async getSuspendedUsers(companyId: string): Promise<User[]> {
        return this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userRoles', 'userRole')
            .leftJoinAndSelect('userRole.role', 'role')
            .where('userRole.companyId = :companyId', { companyId })
            .andWhere('user.status = :status', { status: UserStatus.SUSPENDED })
            .getMany();
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new BadRequestException('Invalid credentials');
        }
        return { userId: user.id, email: user.email };
    }

    async login(user: any) {
        const payload = { sub: user.userId, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async getUserWithRoles(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userRoles', 'userRoles.role'],
        });
        if (!user) return null;

        return {
            userId: user.id,
            email: user.email,
            roles: user.userRoles.map(ur => ur.role.code), // Flatten to ['ADMIN', 'OWNER']
        };
    }
}
