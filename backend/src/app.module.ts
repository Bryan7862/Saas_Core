import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCoreModule } from './modules/auth-core/auth-core.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: '127.0.0.1',
            port: 5432,
            username: 'postgres',
            password: 'Sieghart069',
            database: 'saas_db',
            autoLoadEntities: true,
            synchronize: true, // Be careful with this in production
        }),
        AuthCoreModule,
    ],
})
export class AppModule { }
