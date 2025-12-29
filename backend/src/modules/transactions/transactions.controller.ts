import { Controller, Get, Query, Headers, UseGuards, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../iam/guards/permissions.guard';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get()
    @RequirePermissions('billing:read')
    async findAll(
        @Headers('x-company-id') companyId: string,
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('status') status?: string,
        @Query('type') type?: string,
    ) {
        if (!companyId) throw new BadRequestException('Organization Context Required');

        const offset = (page - 1) * limit;
        return this.transactionsService.findAllByOrganization(companyId, {
            startDate,
            endDate,
            status,
            type,
            limit,
            offset
        });
    }

    @Get('summary')
    @RequirePermissions('billing:read')
    async getSummary(
        @Headers('x-company-id') companyId: string,
        @Query('month') month: string // YYYY-MM
    ) {
        if (!companyId) throw new BadRequestException('Organization Context Required');
        if (!month) throw new BadRequestException('Month is required (YYYY-MM)');

        return this.transactionsService.getMonthlySummary(companyId, month);
    }
}
