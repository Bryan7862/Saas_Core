import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule, {
        rawBody: true, // Needed for Stripe Webhook Signature verification
    });
    const configService = app.get(ConfigService);

    // Security & Optimization
    // ⚠️ PRODUCCIÓN: Cambiar '*' por dominios específicos, ej: ['https://tuapp.com']
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || '*',
        credentials: true,
    });
    app.use(helmet());
    app.use(compression());

    // Global Pipes & Filters (Con validación estricta)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true, // Rechaza campos no definidos en DTOs
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Boot
    const port = configService.get('PORT') || 3000;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
