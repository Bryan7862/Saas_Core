import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsUUID()
    @IsOptional()
    orgId?: string;

    @IsEnum(NotificationType)
    @IsOptional()
    type?: NotificationType;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    triggeredBy?: string; // ID of the user who triggered this notification
}
