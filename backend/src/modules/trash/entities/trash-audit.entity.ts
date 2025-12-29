import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TrashEntityType {
    USER = 'USER',
    ORGANIZATION = 'ORGANIZATION'
}

export enum TrashAction {
    SUSPEND = 'SUSPEND',
    RESTORE = 'RESTORE',
    HARD_DELETE = 'HARD_DELETE'
}

@Entity('trash_audit')
export class TrashAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: TrashEntityType, name: 'entity_type' })
    entityType: TrashEntityType;

    @Column({ name: 'entity_id' })
    entityId: string;

    @Column({ type: 'enum', enum: TrashAction })
    action: TrashAction;

    @Column({ name: 'performed_by', nullable: true })
    performedByUserId: string;

    @Column({ nullable: true })
    reason: string;

    @CreateDateColumn({ name: 'performed_at' })
    performedAt: Date;
}
