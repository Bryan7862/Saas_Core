import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { IamModule } from './modules/iam/iam.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TrashModule } from './modules/trash/trash.module';

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
        AuthModule,
        IamModule,
        OrganizationsModule,
        TrashModule,
    ],
})
export class AppModule { }
