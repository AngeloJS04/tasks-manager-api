import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from '../../tasks/task.status.enum';
import { UserEntity } from './user.entity';

@Entity({ name: "tasks", schema: "public" })
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(type => UserEntity, user => user.tasks, { eager: false })
    @Exclude({ toPlainOnly: true })
    user: UserEntity
}