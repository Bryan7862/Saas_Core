import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company, CompanyStatus } from './entities/company.entity';
import { UserRole } from '../iam/entities/user-role.entity';
import { IamService } from '../iam/iam.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

const MAX_ORGANIZATIONS_PER_USER = 3;

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
        private iamService: IamService,
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

        company.status = CompanyStatus.SUSPENDED;
        company.suspendedAt = new Date();
        company.suspendedByUserId = performedByUserId;

        return this.companyRepository.save(company);
    }

    async restoreOrganization(organizationId: string): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id: organizationId } });
        if (!company) throw new NotFoundException('Organization not found');

        company.status = CompanyStatus.ACTIVE;
        company.suspendedAt = null;
        company.suspendedByUserId = null;

        return this.companyRepository.save(company);
    }

    async getSuspendedOrganizations(): Promise<Company[]> {
        return this.companyRepository.find({
            where: { status: CompanyStatus.SUSPENDED },
        });
    }
}
