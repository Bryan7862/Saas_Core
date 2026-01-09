import { Controller, Get, Post, Patch, Body, Param, Headers, Req, UseGuards, Delete, Inject, forwardRef } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../iam/guards/permissions.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TrashService } from '../trash/trash.service';
import { TrashAction, TrashEntityType } from '../trash/entities/trash-audit.entity';

@Controller('admin/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(forwardRef(() => TrashService))
        private readonly trashService: TrashService,
    ) { }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions('users:create')
    @Post('users')
    createUser(@Body() createUserDto: CreateUserDto, @Req() req) {
        return this.authService.createUser(createUserDto, req.user.userId);
    }

    // Rate limit login: 5 intentos por minuto para prevenir fuerza bruta
    @Throttle({ default: { limit: 5, ttl: 60000 } })
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
    async suspendUser(@Param('id') id: string, @Req() req, @Headers('x-company-id') companyId: string) {
        // Enforces:
        // 1. Permission check (Guard)
        // 2. Self-protection (Service)
        // 3. Hierarchy check (Service)
        const result = await this.authService.suspendUser(id, req.user.userId, companyId);
        await this.trashService.logAction(
            TrashEntityType.USER,
            id,
            TrashAction.SUSPEND,
            req.user.userId,
            'Manual Suspension via API'
        );
        return result;
    }

    // ============ PASSWORD RESET ============

    @Post('forgot-password')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email);
    }

    @Post('reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    }

    // ============ EMAIL VERIFICATION ============

    @Post('verify-email')
    verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto.token);
    }

    @Post('resend-verification')
    resendVerification(@Body('email') email: string) {
        return this.authService.resendVerificationEmail(email);
    }
}
