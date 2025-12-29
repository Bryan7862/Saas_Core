import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrashAudit, TrashEntityType, TrashAction } from './entities/trash-audit.entity';

@Injectable()
export class TrashService {
    constructor(
        @InjectRepository(TrashAudit)
        private auditRepository: Repository<TrashAudit>,
    ) { }

    async logAction(
        entityType: TrashEntityType,
        entityId: string,
        action: TrashAction,
        performedByUserId: string,
        reason?: string
    ) {
        const audit = this.auditRepository.create({
            entityType,
            entityId,
            action,
            performedByUserId,
            reason
        });
        return this.auditRepository.save(audit);
    }

    async getAuditLog() {
        return this.auditRepository.find({
            order: { performedAt: 'DESC' },
            take: 100 // Limit for now
        });
    }

    isEligibleForHardDelete(entity: any): boolean {
        // Policy: 30 Days from suspension
        if (!entity.suspendedAt) return false;

        const retentionDays = 30;
        const now = new Date();
        const suspendedDate = new Date(entity.suspendedAt);
        const diffTime = Math.abs(now.getTime() - suspendedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays >= retentionDays;
    }

    // Note: Logging logic was separate. We can reuse logAction.
}
