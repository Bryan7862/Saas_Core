import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateTransactionDto {
    @IsString()
    date: string;

    @IsEnum(['ingreso', 'gasto', 'REFUND'])
    type: 'ingreso' | 'gasto' | 'REFUND';

    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    @IsNotEmpty()
    amount: number;

    @Transform(({ value }) => value || 'Sin descripción')
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    category?: string;
}

