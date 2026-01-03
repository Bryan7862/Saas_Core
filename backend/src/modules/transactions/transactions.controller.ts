import { Controller, Get, Post, Query, Headers, Body, UseGuards, BadRequestException, ParseIntPipe, Req, DefaultValuePipe } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../iam/guards/permissions.guard';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard) // Only require authentication, not organization permissions
    async create(
        @Req() req: any,
        @Body() dto: CreateTransactionDto,
        @Headers('x-company-id') companyId: string
    ) {
        const userId = req.user?.userId;
        if (!userId) {
            throw new BadRequestException('User ID not found in token');
        }
        // If companyId is not provided in header, try to use user's default company
        const orgId = companyId || req.user?.defaultCompanyId;

        return this.transactionsService.create(userId, dto, orgId);
    }




    @Get()
    @RequirePermissions('billing:read')
    async findAll(
        @Headers('x-company-id') companyId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
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

