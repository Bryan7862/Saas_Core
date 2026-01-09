import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    token: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
        message: 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial (@$!%*?&)',
    })
    newPassword: string;
}
