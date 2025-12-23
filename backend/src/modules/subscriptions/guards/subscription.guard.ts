import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions.service';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@Injectable()
export class SubscriptionGuard implements CanActivate {
    constructor(private subscriptionsService: SubscriptionsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        // Assume companyId is injected by ContextMiddleware or AuthGuard
        // Check both headers (for explicit context) and user (for default context)
        const companyId = request.headers['x-company-id'] || request.user?.defaultCompanyId;

        if (!companyId) {
            // If no context, we can't check subscription. 
            // Depending on policy: Allow (public) or Block.
            // For now, if route uses this Guard, it implies Context is required.
            throw new ForbiddenException('Organization Context missing for Subscription Check');
        }

        const subscription = await this.subscriptionsService.getCurrentSubscription(companyId);

        if (!subscription) {
            throw new ForbiddenException('No Subscription found for this Organization');
        }

        const ALLOWED_STATUSES = [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL];

        if (!ALLOWED_STATUSES.includes(subscription.status)) {
            throw new ForbiddenException(`Subscription is ${subscription.status}. Please update your plan.`);
        }

        return true;
    }
}
