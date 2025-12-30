import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum NotificationType {
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({ nullable: true })
    orgId: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.INFO
    })
    type: NotificationType;

    @Column()
    title: string;

    @Column('text')
    message: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
