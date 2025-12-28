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

    create(userId: string, createTransactionDto: CreateTransactionDto) {
        const transaction = this.transactionRepository.create({
            ...createTransactionDto,
            user: { id: userId } as any, // Link to user by ID
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
        amount: number; // In standard units (e.g. 50.00)
        currency: string;
        email: string;
        description: string;
        referenceCode: string;
        provider: string;
        status: string;
    }) {
        const transaction = this.transactionRepository.create({
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            type: 'gasto', // Technically 'income' for the SaaS, but reuse existing enum? Or 'ingreso'? 
            // Wait, 'ingreso' vs 'gasto' context: Is this user's expense or SaaS income?
            // Existing context implies User Finance Tracker ('gasto' = user spent money).
            // So for Subscription Payment, it is a USER GASTO.
            amount: data.amount,
            description: data.description,
            category: 'Subscription',
            organizationId: data.organizationId,
            referenceCode: data.referenceCode,
            provider: data.provider,
            status: data.status,
            // userId? We might not have it easily if webhook only has orgId/email.
            // But we can leave it null or try to find user by email if critical.
            // For now, linking to Organization is key.
        });
        return this.transactionRepository.save(transaction);
    }
}
