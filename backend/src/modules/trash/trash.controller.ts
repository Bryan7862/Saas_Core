import { Controller, Get, Post, Param, Req, UseGuards, Headers } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Controller('trash')
@UseGuards(JwtAuthGuard)
export class TrashController {
    constructor(
        private readonly authService: AuthService,
        private readonly organizationsService: OrganizationsService,
    ) { }

    @Get('users')
    async getTrashUsers(@Headers('x-company-id') companyId: string) {
        return this.authService.getSuspendedUsers(companyId);
    }

    @Get('organizations')
    async getTrashOrganizations() {
        return this.organizationsService.getSuspendedOrganizations();
    }

    @Post('users/:id/restore')
    async restoreUser(@Param('id') id: string) {
        return this.authService.restoreUser(id);
    }

    @Post('organizations/:id/restore')
    async restoreOrganization(@Param('id') id: string) {
        return this.organizationsService.restoreOrganization(id);
    }
}
