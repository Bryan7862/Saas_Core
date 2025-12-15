import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsString()
    resource: string;

    @IsString()
    action: string;

    @IsOptional()
    @IsString()
    description?: string;
}
