import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';

import { AuthModule } from '../auth/auth.module';
import { IamModule } from '../iam/iam.module';
import { UserRole } from '../iam/entities/user-role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction, UserRole]),
        forwardRef(() => AuthModule),
        IamModule
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService],
    exports: [TransactionsService],
})
export class TransactionsModule { }
