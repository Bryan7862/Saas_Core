import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    description?: string;
}
