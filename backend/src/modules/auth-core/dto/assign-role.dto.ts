import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignRoleDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsUUID()
    companyId: string;

    @IsNotEmpty()
    @IsUUID()
    roleId: string;
}
