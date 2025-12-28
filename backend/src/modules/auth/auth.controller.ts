import { Controller, Get, Post, Patch, Body, Param, Headers, Req, UseGuards, Delete } from '@nestjs/common';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../iam/guards/permissions.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('admin/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('users:create')
    @Post('users')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.createUser(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('users:read')
    @Get('users')
    getUsers(@Req() req, @Headers('x-company-id') companyId: string) {
        return this.authService.getUsers(req.user.userId, companyId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return this.authService.getUserWithRoles(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.authService.updateProfile(req.user.userId, updateProfileDto);
    }

    // New Endpoint for Global Admin
    // TODO: Add @Roles('SUPER_ADMIN') when RolesGuard is fully configured for it
    @UseGuards(JwtAuthGuard)
    @Get('system/users')
    getAllSystemUsers() {
        return this.authService.getAllSystemUsers();
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('users:delete')
    @Delete('users/:id')
    suspendUser(@Param('id') id: string, @Req() req, @Headers('x-company-id') companyId: string) {
        // Enforces:
        // 1. Permission check (Guard)
        // 2. Self-protection (Service)
        // 3. Hierarchy check (Service)
        return this.authService.suspendUser(id, req.user.userId, companyId);
    }
}
