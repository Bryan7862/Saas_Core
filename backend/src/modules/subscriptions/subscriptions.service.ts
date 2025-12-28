import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { PlanCode } from './enums/plan-code.enum';
import { SubscriptionStatus } from './enums/subscription-status.enum';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
    ) { }

    // 1. Create Initial Subscription (30-day TRIAL)
    async createInitialSubscription(organizationId: string): Promise<Subscription> {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 30); // 30 Days Trial

        const subscription = this.subscriptionRepository.create({
            organizationId,
            planCode: PlanCode.FREE, // We keep 'FREE' code internally for Trial or create a specific TRIAL code if preferred. Keeping FREE as base for now but status TRIAL.
            status: SubscriptionStatus.TRIAL,
            startedAt: new Date(),
            endsAt: trialEndDate,
        });
        return this.subscriptionRepository.save(subscription);
    }

    getPlanLimits(planCode: PlanCode, status: SubscriptionStatus): { maxUsers: number } {
        if (status === SubscriptionStatus.TRIAL) return { maxUsers: 1 };
        if (status === SubscriptionStatus.PAST_DUE) return { maxUsers: 1 }; // Downgrade access on failure
        if (status === SubscriptionStatus.EXPIRED) return { maxUsers: 0 }; // Full block

        switch (planCode) {
            case PlanCode.BASIC: return { maxUsers: 5 };
            case PlanCode.PRO: return { maxUsers: 8 };
            case PlanCode.MAX: return { maxUsers: 15 };
            default: return { maxUsers: 1 };
        }
    }

    // ... (existing code)

    // 4. Handle Failed Payment (Webhook Hook)
    async handleFailedPayment(organizationId: string): Promise<Subscription> {
        const sub = await this.getCurrentSubscription(organizationId);

        // If it was ACTIVE, mark as PAST_DUE
        if (sub.status === SubscriptionStatus.ACTIVE) {
            sub.status = SubscriptionStatus.PAST_DUE;
            // We do NOT modify endsAt, assuming grace period or immediate restriction relative to date.
            // Or we could log the failure date.
            return this.subscriptionRepository.save(sub);
        }
        return sub;
    }

    // 2. Get Current Subscription
    async getCurrentSubscription(organizationId: string): Promise<Subscription> {
        const sub = await this.subscriptionRepository.findOne({
            where: { organizationId },
        });
        if (!sub) {
            // Self-repair: If Organization exists but Subscription missing (legacy data)
            // Ideally we'd check if Org exists first to be safe, but for now assuming valid orgId context
            console.warn(`No subscription found for org ${organizationId}. creating default.`);
            return this.createInitialSubscription(organizationId);
        }
        return sub;
    }

    // 3. Change Plan (Upgrade/Downgrade Logic)
    async changePlan(organizationId: string, newPlanCode: PlanCode): Promise<Subscription> {
        const subscription = await this.subscriptionRepository.findOne({ where: { organizationId } });
        if (!subscription) throw new NotFoundException('Subscription not found');

        if (!Object.values(PlanCode).includes(newPlanCode)) {
            throw new BadRequestException('Invalid Plan Code');
        }

        if (subscription.planCode === newPlanCode) {
            throw new BadRequestException('Organization is already on this plan');
        }

        // Logic:
        // If moving to FREE -> Activate immediately (no payment)
        // If moving to PAID -> Set PENDING_PAYMENT

        if (newPlanCode === PlanCode.FREE) {
            subscription.planCode = newPlanCode;
            subscription.status = SubscriptionStatus.ACTIVE;
            subscription.endsAt = null;
        } else {
            subscription.planCode = newPlanCode;
            subscription.status = SubscriptionStatus.PENDING_PAYMENT;
            // Don't set startedAt/endsAt yet until payment confirmed
        }

        return this.subscriptionRepository.save(subscription);
    }

    // --- Payments Integration Hooks ---

    async activateSubscription(
        organizationId: string,
        planCode: PlanCode,
        providerCustomerId: string,
        providerSubscriptionId: string,
        endsAt: Date | null
    ): Promise<Subscription> {
        const sub = await this.getCurrentSubscription(organizationId);

        sub.planCode = planCode;
        sub.status = SubscriptionStatus.ACTIVE;
        sub.providerCustomerId = providerCustomerId;
        sub.providerSubscriptionId = providerSubscriptionId;
        sub.startedAt = new Date();
        sub.endsAt = endsAt;

        return this.subscriptionRepository.save(sub);
    }

    async suspendSubscription(providerSubscriptionId: string): Promise<Subscription> {
        // Find by providerSubscriptionId as webhook might not have orgId readily available in top level
        const sub = await this.subscriptionRepository.findOne({ where: { providerSubscriptionId } });
        if (!sub) {
            console.warn(`[Suspend] Subscription not found for Provider ID: ${providerSubscriptionId}`);
            // Return null or throw depending on strictness. For now logging.
            throw new NotFoundException('Subscription not found via Provider ID');
        }

        sub.status = SubscriptionStatus.SUSPENDED;
        return this.subscriptionRepository.save(sub);
    }

    async cancelSubscription(providerSubscriptionId: string): Promise<Subscription> {
        const sub = await this.subscriptionRepository.findOne({ where: { providerSubscriptionId } });
        if (!sub) {
            console.warn(`[Cancel] Subscription not found for Provider ID: ${providerSubscriptionId}`);
            throw new NotFoundException('Subscription not found via Provider ID');
        }

        sub.status = SubscriptionStatus.CANCELED;
        // Optionally keep endsAt to allow access until period end, if Stripe calls this at period end.
        // For immediate cancellation:
        sub.endsAt = new Date();
        return this.subscriptionRepository.save(sub);
    }
}
