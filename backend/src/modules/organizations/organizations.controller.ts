import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming it exists here

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

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
    suspend(@Param('id') id: string, @Request() req) {
        return this.organizationsService.suspendOrganization(id, req.user.userId);
    }
}
