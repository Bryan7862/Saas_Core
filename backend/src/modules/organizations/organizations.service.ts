import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, CompanyStatus } from './entities/company.entity';
import { UserRole } from '../iam/entities/user-role.entity';
import { IamService } from '../iam/iam.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

const MAX_ORGANIZATIONS_PER_USER = 3;

import { OrganizationSettings } from './entities/organization-settings.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
        @InjectRepository(OrganizationSettings)
        private settingsRepository: Repository<OrganizationSettings>,
        private iamService: IamService,
        private subscriptionsService: SubscriptionsService,
        private notificationsService: NotificationsService,
    ) { }

    async create(userId: string | null, createDto: CreateOrganizationDto): Promise<Company> {
        // Business Rule: Limit number of organizations per user
        if (userId) {
            const count = await this.userRoleRepository.createQueryBuilder('ur')
                .innerJoin('ur.company', 'c')
                .where('ur.userId = :userId', { userId })
                // Assuming we want to count only ACTIVE organizations
                .andWhere('c.status = :status', { status: 'ACTIVE' })
                .getCount();

            if (count >= MAX_ORGANIZATIONS_PER_USER) {
                throw new BadRequestException(`Has alcanzado el número máximo de organizaciones permitidas (${MAX_ORGANIZATIONS_PER_USER}).`);
            }
        }

        const { name, logoUrl } = createDto;

        // Slug Logic
        let slug = createDto.slug;
        if (!slug) {
            slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        // Enforce uniqueness
        const existingSlug = await this.companyRepository.findOne({ where: { slug } });
        if (existingSlug) {
            if (createDto.slug) {
                // If user provided specific slug and it's taken
                throw new BadRequestException('Slug already taken');
            } else {
                // Auto-generate fallback
                slug = `${slug}-${Date.now()}`;
            }
        }

        const company = this.companyRepository.create({
            name,
            slug,
            logoUrl,
        });
        const savedCompany = await this.companyRepository.save(company);

        // Assign OWNER Role if userId is provided
        if (userId) {
            const ownerRole = await this.iamService.findRoleByCode('OWNER');
            if (ownerRole) {
                await this.iamService.assignRole({
                    userId,
                    roleId: ownerRole.id,
                    companyId: savedCompany.id,
                });
            } else {
                console.error('OWNER role code not found. Organization created but user not assigned as Owner.');
            }
        }

        // Create Initial Subscription (FREE)
        await this.subscriptionsService.createInitialSubscription(savedCompany.id);

        return savedCompany;
    }

    async getUserOrganizations(userId: string): Promise<Company[]> {
        // Query UserRoles JOIN Organization
        const userRoles = await this.userRoleRepository.find({
            where: { userId },
            relations: ['company'],
        });

        // Unique companies
        const companiesMap = new Map<string, Company>();
        userRoles.forEach(ur => {
            if (ur.company) {
                companiesMap.set(ur.company.id, ur.company);
            }
        });

        return Array.from(companiesMap.values());
    }

    async findAll(): Promise<Company[]> {
        return this.companyRepository.find({
            where: { status: CompanyStatus.ACTIVE },
        });
    }

    async findOne(id: string): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id } });
        if (!company) throw new NotFoundException('Organization not found');
        return company;
    }

    async update(id: string, updateDto: UpdateOrganizationDto): Promise<Company> {
        const company = await this.findOne(id);

        if (updateDto.slug && updateDto.slug !== company.slug) {
            const existing = await this.companyRepository.findOne({ where: { slug: updateDto.slug } });
            if (existing) throw new BadRequestException('Slug already taken');
        }

        Object.assign(company, updateDto);
        return this.companyRepository.save(company);
    }

    async suspendOrganization(organizationId: string, performedByUserId: string): Promise<Company> {
        const company = await this.findOne(organizationId);

        if (company.status === CompanyStatus.SUSPENDED) {
            throw new BadRequestException('La organización ya se encuentra suspendida');
        }

        company.status = CompanyStatus.SUSPENDED;
        company.suspendedAt = new Date();
        company.suspendedByUserId = performedByUserId;

        const savedCompany = await this.companyRepository.save(company);

        // Notify User
        await this.notificationsService.notifyUser(performedByUserId, {
            type: NotificationType.WARNING,
            title: '⚠️ Organización Suspendida',
            message: `La organización ${company.name} ha sido suspendida correctamente.`,
            orgId: company.id,
            userId: performedByUserId,
            triggeredBy: performedByUserId // Triggered by the actor
        });

        return savedCompany;
    }

    async restoreOrganization(organizationId: string, performedByUserId: string): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id: organizationId } });
        if (!company) throw new NotFoundException('Organization not found');

        company.status = CompanyStatus.ACTIVE;
        company.suspendedAt = null;
        company.suspendedByUserId = null;

        const savedCompany = await this.companyRepository.save(company);

        // Notify User
        await this.notificationsService.notifyUser(performedByUserId, {
            type: NotificationType.SUCCESS,
            title: '✅ Organización Activada',
            message: `La organización ${company.name} está operativa nuevamente.`,
            orgId: company.id,
            userId: performedByUserId,
            triggeredBy: performedByUserId
        });

        return savedCompany;
    }

    async hardDeleteOrganization(organizationId: string): Promise<void> {
        const company = await this.companyRepository.findOne({ where: { id: organizationId } });
        if (!company) throw new NotFoundException('Organization not found');

        // Note: Due to Cascading rules on UserRole, OrganizationSettings, Subscriptions, transactions...
        // We need to be careful. Ideally use CASCADE in DB or manually delete relations.
        // For now, assuming standard TypeORM logic. 
        // We might want to clear userRoles first. 

        await this.userRoleRepository.delete({ companyId: organizationId });

        // Settings are 1-1 cascading usually, but let's be safe
        await this.settingsRepository.delete({ companyId: organizationId });

        await this.companyRepository.remove(company);
    }

    async getSuspendedOrganizations(): Promise<Company[]> {
        return this.companyRepository.find({
            where: { status: CompanyStatus.SUSPENDED },
        });
    }

    // --- Organization Settings Logic ---

    async getSettings(companyId: string): Promise<OrganizationSettings> {
        let settings = await this.settingsRepository.findOne({ where: { companyId } });
        if (!settings) {
            // Lazy Init: Check if company exists first
            const company = await this.companyRepository.findOne({ where: { id: companyId } });
            if (!company) throw new NotFoundException('Organization not found');

            settings = this.settingsRepository.create({
                companyId,
                timezone: 'UTC',
                currency: 'USD',
                notificationsEnabled: true,
                theme: 'system'
            });
            await this.settingsRepository.save(settings);
        }
        return settings;
    }

    async updateSettings(companyId: string, data: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
        const settings = await this.getSettings(companyId);
        Object.assign(settings, data);
        return this.settingsRepository.save(settings);
    }
}
