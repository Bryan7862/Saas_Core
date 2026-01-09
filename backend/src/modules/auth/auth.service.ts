import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OrganizationsService } from '../organizations/organizations.service';
import { IamService } from '../iam/iam.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { SubscriptionStatus } from '../subscriptions/enums/subscription-status.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

// const MAX_USERS_PER_ORGANIZATION = 8; // Removed hardcoded limit

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly organizationsService: OrganizationsService,
        @Inject(forwardRef(() => IamService))
        private readonly iamService: IamService,
        private readonly subscriptionsService: SubscriptionsService,
        private readonly notificationsService: NotificationsService,
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
            status: UserStatus.ACTIVE,
        });
        const savedUser = await this.userRepository.save(user);

        // 4. Assign OWNER role (Delegated)
        let ownerRole = await this.iamService.findRoleByCode('OWNER');
        if (!ownerRole) {
            // Auto-create OWNER role if not exists (Bootstrap logic)
            ownerRole = await this.iamService.createRole({
                code: 'OWNER',
                name: 'Propietario',
                description: 'Propietario de la Empresa',
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

    async createUser(createUserDto: CreateUserDto, performedByUserId: string): Promise<User> {
        const { email, password, defaultCompanyId, firstName, lastName } = createUserDto;

        if (defaultCompanyId) {
            // 1. Get current Subscription
            const subscription = await this.subscriptionsService.getCurrentSubscription(defaultCompanyId);

            // 2. Check if subscription allows adding users
            if (subscription.status === SubscriptionStatus.CANCELED || subscription.status === SubscriptionStatus.SUSPENDED) {
                throw new BadRequestException('La suscripción de la organización no está activa. Por favor actualice su plan.');
            }

            // 3. Check Trial Expiration
            if (subscription.status === SubscriptionStatus.TRIAL && subscription.endsAt && new Date() > subscription.endsAt) {
                throw new BadRequestException('Su periodo de prueba ha finalizado. Por favor suscríbase a un plan para agregar más usuarios.');
            }

            // 4. Check Limits
            const currentUsersCount = await this.iamService.countCompanyUsers(defaultCompanyId);
            const { maxUsers } = this.subscriptionsService.getPlanLimits(subscription.planCode, subscription.status);

            if (currentUsersCount >= maxUsers) {
                throw new BadRequestException(`Has alcanzado el límite de usuarios de tu plan (${maxUsers}). Actualiza tu plan para agregar más.`);
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
            status: UserStatus.ACTIVE,
        });

        const savedUser = await this.userRepository.save(user);

        // Auto-assign 'MEMBER' role so user appears in the organization
        if (defaultCompanyId) {
            let memberRole = await this.iamService.findRoleByCode('MEMBER');
            if (!memberRole) {
                memberRole = await this.iamService.createRole({
                    code: 'MEMBER',
                    name: 'Miembro',
                    description: 'Miembro Estándar de la Organización',
                });
            }
            await this.iamService.assignRole({
                userId: savedUser.id,
                roleId: memberRole.id,
                companyId: defaultCompanyId,
            });
        }

        // Notify the Admin (User who added the member)
        if (performedByUserId) {
            await this.notificationsService.notifyUser(performedByUserId, {
                type: NotificationType.INFO,
                title: '👤 Nuevo Miembro',
                message: 'Un nuevo usuario se ha unido a tu equipo.',
                userId: performedByUserId,
                orgId: defaultCompanyId
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
            .where('userRole.companyId = :companyId', { companyId });
        // FILTER REMOVED: Show all users regardless of status
        // .andWhere('user.status = :status', { status: UserStatus.ACTIVE });

        const results = await query.getMany();
        console.log(`[getUsers] Found ${results.length} users`); // DEBUG
        return results;
    }

    async suspendUser(userId: string, performedByUserId: string, companyId?: string): Promise<User> {
        // 1. Self-Protection Rule
        if (userId === performedByUserId) {
            throw new BadRequestException('No puedes suspender tu propia cuenta.');
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // 2. Hierarchy & Context Rules (if company context is provided)
        if (companyId) {
            // Check if Target belongs to Company
            const targetRole = await this.iamService.findUserRoleInCompany(userId, companyId);
            if (!targetRole) {
                // If the user is globally in the system but not in this company, strictly speaking we shouldn't be able to "suspend" them via this endpoint 
                // if the intention is "Remove from Company". 
                // But since 'suspendUser' sets global status, this is a dangerous endpoint for a multi-tenant app if not restricted.
                // For now, assuming Global Suspension is the intent but gated by Hierarchy.

                // If we want Tenant Isolation, we should probably block this if the user isn't in the company.
                throw new BadRequestException('El usuario no pertenece a esta organización.');
            }

            // Check Actor Role
            const actorRole = await this.iamService.findUserRoleInCompany(performedByUserId, companyId);

            // Check Hierarchy: Only OWNER can touch OWNER
            if (targetRole.role.code === 'OWNER') { // Assuming 'role' relation loaded
                if (!actorRole || actorRole.role.code !== 'OWNER') {
                    throw new BadRequestException('Solo un PROPIETARIO puede suspender a otro PROPIETARIO.');
                }
            }
        }

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

    async hardDeleteUser(userId: string): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userRoles', 'userRoles.role']
        });

        if (!user) throw new NotFoundException('User not found');

        // Safety Check: Is this the last OWNER of any company?
        // This is complex. Use IamService to check ownerships.
        // For now, simpler check: If user is OWNER of their default company, check if there are other owners.

        if (user.defaultCompanyId) {
            const isOwner = user.userRoles.some(ur => ur.role.code === 'OWNER' && ur.companyId === user.defaultCompanyId);
            if (isOwner) {
                const ownersCount = await this.iamService.countCompanyOwners(user.defaultCompanyId);
                if (ownersCount <= 1) {
                    throw new BadRequestException('Cannot delete the last OWNER of an organization. Transfer ownership or delete the organization first.');
                }
            }
        }

        await this.userRepository.remove(user);
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

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        // Handle password change if requested
        if (updateProfileDto.currentPassword && updateProfileDto.newPassword) {
            const bcrypt = await import('bcrypt');
            const isPasswordValid = await bcrypt.compare(updateProfileDto.currentPassword, user.passwordHash);
            if (!isPasswordValid) {
                throw new BadRequestException('La contraseña actual es incorrecta');
            }
            user.passwordHash = await bcrypt.hash(updateProfileDto.newPassword, 10);
        }

        // Remove password fields from dto before assigning
        const { currentPassword, newPassword, ...profileData } = updateProfileDto;
        Object.assign(user, profileData);
        return this.userRepository.save(user);
    }

    async getUserWithRoles(userId: string) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission'],
        });
        if (!user) return null;

        return {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            phone: user.phone,
            address: user.address,
            department: user.department,
            province: user.province,
            district: user.district,
            website: user.website,
            socialLinks: user.socialLinks,
            defaultCompanyId: user.defaultCompanyId,
            roles: user.userRoles.map(ur => ur.role.code),
            permissions: user.userRoles.flatMap(ur => ur.role.rolePermissions ? ur.role.rolePermissions.map(rp => rp.permission.code) : [])
        };
    }
}
