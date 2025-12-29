import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Inject, forwardRef } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming it exists here

import { TrashService } from '../trash/trash.service';
import { TrashAction, TrashEntityType } from '../trash/entities/trash-audit.entity';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
    constructor(
        private readonly organizationsService: OrganizationsService,
        @Inject(forwardRef(() => TrashService))
        private readonly trashService: TrashService,
    ) { }

    @Post()
    create(@Request() req, @Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationsService.create(req.user.userId, createOrganizationDto);
    }

    @Get('my-organizations')
    findAllForUser(@Request() req) {
        return this.organizationsService.getUserOrganizations(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.organizationsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
        return this.organizationsService.update(id, updateOrganizationDto);
    }

    @Delete(':id')
    async suspend(@Param('id') id: string, @Request() req) {
        const result = await this.organizationsService.suspendOrganization(id, req.user.userId);
        await this.trashService.logAction(
            TrashEntityType.ORGANIZATION,
            id,
            TrashAction.SUSPEND,
            req.user.userId,
            'Manual Suspension via API'
        );
        return result;
    }
}
