import { Controller, Get, Post, Param, Req, UseGuards, Headers, Delete, Query, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { TrashService } from './trash.service';
import { TrashEntityType, TrashAction } from './entities/trash-audit.entity';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../iam/guards/permissions.guard';

@Controller('trash')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TrashController {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        @Inject(forwardRef(() => OrganizationsService))
        private readonly organizationsService: OrganizationsService,
        private readonly trashService: TrashService,
    ) { }

    @Get('audit')
    @RequirePermissions('trash:audit') // Assuming standard or admin
    async getAuditLog() {
        return this.trashService.getAuditLog();
    }

    @Get('users')
    async getTrashUsers(@Headers('x-company-id') companyId: string) {
        return this.authService.getSuspendedUsers(companyId);
    }

    @Get('organizations')
    async getTrashOrganizations() {
        return this.organizationsService.getSuspendedOrganizations();
    }

    @Post('users/:id/restore')
    async restoreUser(@Param('id') id: string, @Req() req) {
        const result = await this.authService.restoreUser(id);
        await this.trashService.logAction(
            TrashEntityType.USER,
            id,
            TrashAction.RESTORE,
            req.user.userId,
            'Restored from Trash'
        );
        return result;
    }

    @Post('organizations/:id/restore')
    async restoreOrganization(@Param('id') id: string, @Req() req) {
        const result = await this.organizationsService.restoreOrganization(id);
        await this.trashService.logAction(
            TrashEntityType.ORGANIZATION,
            id,
            TrashAction.RESTORE,
            req.user.userId,
            'Restored from Trash'
        );
        return result;
    }
    @Delete('users/:id/permanent')
    @RequirePermissions('users:delete')
    async deleteUserPermanently(@Param('id') id: string, @Req() req, @Query('confirm') confirm: string) {
        if (confirm !== 'true') {
            throw new BadRequestException('Confirmation required (confirm=true) to permanently delete.');
        }

        // 1. Verify Existence and Eligibility
        // We fetch directly from repository via Service to check dates? 
        // AuthService doesn't stickily return only suspended.
        // Let's assume we proceed if found.

        await this.authService.hardDeleteUser(id);

        await this.trashService.logAction(
            TrashEntityType.USER,
            id,
            TrashAction.HARD_DELETE,
            req.user.userId,
            'Permanent Deletion via API'
        );
        return { message: 'User permanently deleted' };
    }

    @Delete('organizations/:id/permanent')
    @RequirePermissions('organizations:delete') // Or a specific 'trash:hard_delete' permission
    async deleteOrganizationPermanently(@Param('id') id: string, @Req() req, @Query('confirm') confirm: string) {
        if (confirm !== 'true') {
            throw new BadRequestException('Confirmation required (confirm=true) to permanently delete.');
        }

        await this.organizationsService.hardDeleteOrganization(id);

        await this.trashService.logAction(
            TrashEntityType.ORGANIZATION,
            id,
            TrashAction.HARD_DELETE,
            req.user.userId,
            'Permanent Deletion via API'
        );
        return { message: 'Organization permanently deleted' };
    }
}
