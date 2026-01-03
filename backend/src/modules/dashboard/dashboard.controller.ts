import { Controller, Get, Post, Body, Headers, UseGuards, BadRequestException, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    /**
     * Get all KPIs for the current user
     * Returns: { clientes: number, facturas: number, inventario: number }
     */
    @Get('kpis')
    async getKpis(@Req() req: any) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new BadRequestException('User ID not found in token');
        }
        return this.dashboardService.getKpisAsMap(userId);
    }

    /**
     * Create or update a KPI for the current user
     */
    @Post('kpis')
    async upsertKpi(@Req() req: any, @Body() dto: CreateKpiDto) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new BadRequestException('User ID not found in token');
        }
        return this.dashboardService.upsertKpi(userId, dto);
    }
}
