import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        private readonly notificationsGateway: NotificationsGateway,
    ) { }

    async notifyUser(userId: string, data: Partial<CreateNotificationDto>) {
        const notification = this.notificationRepository.create({
            userId,
            ...data,
        });

        const saved = await this.notificationRepository.save(notification);

        // Emit Real-Time Event
        // Pass triggeredBy if present in DTO, otherwise might default to performedBy or null? 
        // We just pass the entire saved object + the transient triggeredBy field if we want.
        // Actually, saved object is the Entity. It doesn't have triggeredBy.
        // Let's spread saved and add triggeredBy from DTO.
        this.notificationsGateway.sendToUser(userId, { ...saved, triggeredBy: data.triggeredBy });

        return saved;
    }

    async findAll(userId: string) {
        return this.notificationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 20, // Limit last 20
        });
    }

    async markAsRead(id: string, userId: string) {
        await this.notificationRepository.update(
            { id, userId },
            { isRead: true }
        );
        return { success: true };
    }

    async markAllAsRead(userId: string) {
        await this.notificationRepository.update(
            { userId, isRead: false },
            { isRead: true }
        );
        return { success: true };
    }
}
