import { IsString, IsOptional, IsObject, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsString()
    province?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @IsObject()
    socialLinks?: Record<string, string>;

    // Password change fields
    @IsOptional()
    @IsString()
    currentPassword?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    newPassword?: string;
}

