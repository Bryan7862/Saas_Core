import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
