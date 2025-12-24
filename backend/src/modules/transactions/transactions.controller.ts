import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    create(@Req() req, @Body() createTransactionDto: CreateTransactionDto) {
        console.log('Creating transaction for user:', req.user.userId, createTransactionDto);
        return this.transactionsService.create(req.user.userId, createTransactionDto)
            .catch(err => {
                console.error('Error creating transaction:', err);
                throw err;
            });
    }

    @Get()
    findAll(@Req() req) {
        return this.transactionsService.findAll(req.user.userId);
    }
}
