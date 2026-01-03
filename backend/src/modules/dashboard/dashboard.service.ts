import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardKpi } from './entities/dashboard-kpi.entity';
import { CreateKpiDto } from './dto/create-kpi.dto';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(DashboardKpi)
        private readonly kpiRepository: Repository<DashboardKpi>,
    ) { }

    /**
     * Get all KPIs for a user for the current month/year
     */
    async getKpis(userId: string, month?: number, year?: number): Promise<DashboardKpi[]> {
        const now = new Date();
        const targetMonth = month ?? now.getMonth() + 1; // 1-12
        const targetYear = year ?? now.getFullYear();

        return this.kpiRepository.find({
            where: {
                userId,
                month: targetMonth,
                year: targetYear,
            },
        });
    }

    /**
     * Create or update a KPI for a user
     */
    async upsertKpi(userId: string, dto: CreateKpiDto): Promise<DashboardKpi> {
        const now = new Date();
        const month = dto.month ?? now.getMonth() + 1;
        const year = dto.year ?? now.getFullYear();

        // Check if KPI exists
        let kpi = await this.kpiRepository.findOne({
            where: {
                userId,
                kpiType: dto.kpiType,
                month,
                year,
            },
        });

        if (kpi) {
            // Update existing
            kpi.value = dto.value;
            return this.kpiRepository.save(kpi);
        } else {
            // Create new
            kpi = this.kpiRepository.create({
                userId,
                kpiType: dto.kpiType,
                value: dto.value,
                month,
                year,
            });
            return this.kpiRepository.save(kpi);
        }
    }

    /**
     * Get KPIs as a simple object map for frontend consumption
     */
    async getKpisAsMap(userId: string): Promise<Record<string, number>> {
        const kpis = await this.getKpis(userId);
        const result: Record<string, number> = {
            clientes: 0,
            facturas: 0,
            inventario: 0,
        };

        for (const kpi of kpis) {
            result[kpi.kpiType] = Number(kpi.value);
        }

        return result;
    }
}
