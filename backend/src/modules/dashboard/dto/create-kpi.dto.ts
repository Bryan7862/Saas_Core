import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKpiDto {
    @IsString()
    kpiType: string; // 'clientes' | 'facturas' | 'inventario'

    @Type(() => Number)
    @IsNumber()
    value: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(12)
    month?: number;

    @IsOptional()
    @IsNumber()
    year?: number;
}
