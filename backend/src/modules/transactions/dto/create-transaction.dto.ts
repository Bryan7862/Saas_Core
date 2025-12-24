import { IsString, IsNumber, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
    @IsDateString()
    date: string;

    @IsEnum(['ingreso', 'gasto'])
    type: 'ingreso' | 'gasto';

    // Accept string or number for amount (frontend sends string usually)
    @IsNumber()
    amount: number;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    category?: string;
}
