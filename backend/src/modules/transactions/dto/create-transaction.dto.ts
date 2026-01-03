import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsNotEmpty } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateTransactionDto {
    @IsString()
    date: string;

    @IsEnum(['ingreso', 'gasto'])
    type: 'ingreso' | 'gasto';

    @Type(() => Number)
    @IsOptional() // Allow it to pass, manual check if needed
    amount: number;

    @Transform(({ value }) => value || 'Sin descripción')
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    category?: string;
}

