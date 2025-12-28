import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from './decorators/require-permissions.decorator';
import { IamService } from './iam.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('admin/iam')
export class IamController {
    constructor(private readonly iamService: IamService) { }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('roles:create')
    @Post('roles')
    createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.iamService.createRole(createRoleDto);
    }

    @Get('roles')
    getRoles() {
        return this.iamService.getRoles();
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('roles:delete')
    @Delete('roles/:id')
    deleteRole(@Param('id') id: string) {
        return this.iamService.deleteRole(id);
    }

    @Post('permissions')
    createPermission(@Body() createPermissionDto: CreatePermissionDto) {
        return this.iamService.createPermission(createPermissionDto);
    }

    @Get('permissions')
    getPermissions() {
        return this.iamService.getPermissions();
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('roles:update')
    @Post('users/assign-role')
    assignRole(@Body() assignRoleDto: AssignRoleDto, @Req() req: any) {
        return this.iamService.assignRole(assignRoleDto, req.user.userId);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('roles:update')
    @Post('roles/:roleId/permissions/:permissionId')
    addPermissionToRole(
        @Param('roleId') roleId: string,
        @Param('permissionId') permissionId: string,
    ) {
        return this.iamService.addPermissionToRole(roleId, permissionId);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('roles:update')
    @Post('roles/:roleId/permissions/sync')
    syncRolePermissions(
        @Param('roleId') roleId: string,
        @Body() body: { permissionIds: string[] },
    ) {
        return this.iamService.syncRolePermissions(roleId, body.permissionIds);
    }
}
