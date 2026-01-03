import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    create(userId: string, createTransactionDto: CreateTransactionDto, organizationId?: string) {
        const transaction = this.transactionRepository.create({
            ...createTransactionDto,
            user: { id: userId } as any, // Link to user by ID
            organizationId: organizationId, // Link to organization
        });
        return this.transactionRepository.save(transaction);
    }


    findAll(userId: string) {
        return this.transactionRepository.find({
            where: { userId },
            order: { date: 'ASC' },
        });
    }

    // --- Webhook Helpers ---

    async findByReference(referenceCode: string): Promise<Transaction | null> {
        return this.transactionRepository.findOne({ where: { referenceCode } });
    }

    async createPaymentLog(data: {
        organizationId: string;
        amount: number;
        currency: string;
        email: string;
        description: string;
        referenceCode: string;
        provider: string;
        status: string;
        metadata?: any;
    }) {
        const transaction = this.transactionRepository.create({
            date: new Date().toISOString().split('T')[0],
            type: 'PAYMENT', // Explicitly marking as SaaS Payment
            amount: data.amount,
            description: data.description,
            category: 'Subscription',
            organizationId: data.organizationId,
            referenceCode: data.referenceCode,
            provider: data.provider,
            status: data.status,
            currency: data.currency,
            metadata: data.metadata || {}
        });
        return this.transactionRepository.save(transaction);
    }

    // --- Reporting & Analytics ---

    async findAllByOrganization(
        organizationId: string,
        filters: { startDate?: string; endDate?: string; status?: string; type?: string; limit?: number; offset?: number }
    ) {
        const query = this.transactionRepository.createQueryBuilder('tx')
            .where('tx.organizationId = :organizationId', { organizationId })
            .orderBy('tx.createdAt', 'DESC');

        if (filters.startDate) query.andWhere('tx.date >= :startDate', { startDate: filters.startDate });
        if (filters.endDate) query.andWhere('tx.date <= :endDate', { endDate: filters.endDate });
        if (filters.status) query.andWhere('tx.status = :status', { status: filters.status });
        if (filters.type) query.andWhere('tx.type = :type', { type: filters.type });

        if (filters.limit) query.take(filters.limit);
        if (filters.offset) query.skip(filters.offset);

        const [data, total] = await query.getManyAndCount();
        return { data, total };
    }

    async getMonthlySummary(organizationId: string, month: string) { // month format 'YYYY-MM'
        const startOfMonth = `${month}-01`;
        const endOfMonth = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0).toISOString().split('T')[0];

        const stats = await this.transactionRepository.createQueryBuilder('tx')
            .select('tx.status')
            .addSelect('SUM(tx.amount)', 'total')
            .addSelect('COUNT(tx.id)', 'count')
            .where('tx.organizationId = :organizationId', { organizationId })
            .andWhere('tx.date BETWEEN :start AND :end', { start: startOfMonth, end: endOfMonth })
            .andWhere('tx.type = :type', { type: 'PAYMENT' }) // Only count payments
            .groupBy('tx.status')
            .getRawMany();

        return stats.reduce((acc, curr) => {
            acc[curr.tx_status] = { count: parseInt(curr.count), total: parseFloat(curr.total) };
            return acc;
        }, {});
    }

    async createSystemAdjustment(organizationId: string, data: { amount: number, description: string, type: 'ADJUSTMENT' | 'REFUND' }) {
        const transaction = this.transactionRepository.create({
            date: new Date().toISOString().split('T')[0],
            type: data.type,
            amount: data.amount,
            description: data.description,
            category: 'System Adjustment',
            organizationId: organizationId,
            provider: 'system',
            status: 'COMPLETED',
            currency: 'USD', // Default or fetch from org settings
        });
        return this.transactionRepository.save(transaction);
    }
}
