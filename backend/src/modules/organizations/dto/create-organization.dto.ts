import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsUrl()
    @IsOptional()
    logoUrl?: string;
}
