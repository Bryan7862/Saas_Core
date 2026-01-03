import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { PlanCode } from './enums/plan-code.enum';

@Injectable()
export class PlansService implements OnModuleInit {
    constructor(
        @InjectRepository(Plan)
        private planRepository: Repository<Plan>,
    ) { }

    async onModuleInit() {
        await this.seedPlans();
    }

    private async seedPlans() {
        // Only seed if no plans exist to avoid overwriting or duplicating (though code is unique)
        const count = await this.planRepository.count();
        if (count > 0) return;

        console.log('Seeding Subscription Plans...');
        const plans = [
            { code: PlanCode.FREE, name: 'Gratuito', pricePe: 0, description: 'Para probar el sistema', features: { maxUsers: 1, maxStorage: '1GB', canAccessAnalytics: false } },
            { code: PlanCode.BASIC, name: 'Emprendedor', pricePe: 29.90, description: 'Ideal para iniciar', features: { maxUsers: 5, maxStorage: '5GB', canAccessAnalytics: true } },
            { code: PlanCode.PRO, name: 'Empresarial', pricePe: 99.90, description: 'Para equipos en crecimiento', features: { maxUsers: 10, maxStorage: '20GB', canAccessAnalytics: true } },
            { code: PlanCode.MAX, name: 'Corporativo', pricePe: 299.90, description: 'Sin límites', features: { maxUsers: 50, maxStorage: '100GB', canAccessAnalytics: true } },
        ];

        for (const p of plans) {
            const existing = await this.planRepository.findOne({ where: { code: p.code } });
            if (!existing) {
                await this.planRepository.save(this.planRepository.create(p));
            }
        }
        console.log('Plans seeded successfully.');
    }

    async findAll(): Promise<Plan[]> {
        // Order by price to keep them sorted FREE -> MAX
        return this.planRepository.find({ order: { pricePe: 'ASC' } });
    }

    async getPlanByCode(code: string): Promise<Plan | null> {
        return this.planRepository.findOne({ where: { code } });
    }

    // Logic relocated from SubscriptionsService
    // Note: We need SubscriptionStatus here? 
    // Actually, limit logic depends on Status (TRIAL/EXPIRED).
    // The previous logic was: if TRIAL return {maxUsers:1}.
    // Ideally PlansService just returns the LIMITS of the PLAN.
    // The "Effective Limit" logic (considering status) belongs in the User/Org check OR a higher level service.
    // However, to keep refactor simple, I'll expose raw plan limits, and SubscriptionsService (or whatever checks limits) applies the status modifiers.

    getPlanLimitsRaw(planCode: string): { maxUsers: number } {
        switch (planCode) {
            case PlanCode.FREE: return { maxUsers: 1 };
            case PlanCode.BASIC: return { maxUsers: 5 };
            case PlanCode.PRO: return { maxUsers: 10 };
            case PlanCode.MAX: return { maxUsers: 50 };
            default: return { maxUsers: 1 };
        }
    }
}
