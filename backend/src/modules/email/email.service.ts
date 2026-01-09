import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);

    /**
     * Sends a password reset email.
     * TODO: Integrate with a real email provider (Resend, SendGrid, AWS SES)
     * For now, this logs the reset link to console.
     */
    async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
        // TODO: Replace with actual email sending logic
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        this.logger.log(`
========================================
PASSWORD RESET EMAIL (DEV MODE)
========================================
To: ${email}
Subject: Recuperar contraseña

Hola,

Recibimos una solicitud para restablecer tu contraseña.
Haz clic en el siguiente enlace para crear una nueva:

${resetUrl}

Este enlace expira en 1 hora.

Si no solicitaste esto, ignora este mensaje.

Saludos,
Tu equipo de soporte
========================================
        `);

        // When ready for production, use something like:
        // await this.resend.emails.send({
        //     from: 'noreply@tuapp.com',
        //     to: email,
        //     subject: 'Recuperar contraseña',
        //     html: `<a href="${resetUrl}">Click aquí para restablecer tu contraseña</a>`
        // });
    }

    /**
     * Sends a welcome email after registration.
     */
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        this.logger.log(`
========================================
WELCOME EMAIL (DEV MODE)
========================================
To: ${email}
Subject: ¡Bienvenido a nuestra plataforma!

Hola ${name},

¡Gracias por registrarte! Tu cuenta está lista.

Saludos,
Tu equipo
========================================
        `);
    }

    /**
     * Sends a stock alert email.
     */
    async sendStockAlertEmail(email: string, productName: string, currentStock: number, minStock: number): Promise<void> {
        this.logger.log(`
========================================
STOCK ALERT EMAIL (DEV MODE)
========================================
To: ${email}
Subject: ⚠️ Alerta de stock bajo - ${productName}

El producto "${productName}" tiene stock bajo:
- Stock actual: ${currentStock}
- Stock mínimo: ${minStock}

Por favor, reabastece pronto.
========================================
        `);
    }

    /**
     * Sends an email verification link.
     */
    async sendVerificationEmail(email: string, name: string, verificationToken: string): Promise<void> {
        const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

        this.logger.log(`
========================================
VERIFICATION EMAIL (DEV MODE)
========================================
To: ${email}
Subject: Verifica tu cuenta

Hola ${name},

¡Gracias por registrarte! Por favor verifica tu email:

${verifyUrl}

Este enlace expira en 24 horas.

Saludos,
Tu equipo
========================================
        `);
    }
}
