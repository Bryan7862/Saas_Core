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
}
