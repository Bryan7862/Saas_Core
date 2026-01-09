import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @MinLength(2)
    firstName: string;

    @IsNotEmpty()
    @MinLength(2)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
        message: 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial (@$!%*?&)',
    })
    password: string;

    @IsNotEmpty()
    @MinLength(2)
    companyName: string;
}
