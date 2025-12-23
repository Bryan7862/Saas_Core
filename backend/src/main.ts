import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true, // Needed for Stripe Webhook Signature verification
    });
    const configService = app.get(ConfigService);

    // Security & Optimization
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || '*',
        credentials: true,
    });
    app.use(helmet());
    app.use(compression());

    // Global Pipes & Filters
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false, // Set to true to stricter validation
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Boot
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
