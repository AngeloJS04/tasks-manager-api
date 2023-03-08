import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { TaskEntity } from '../database/entities/task.entity';
import { createTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task.status.enum';


export class TasksService {
    private readonly listSearch = ['title', 'description'];
    constructor(@InjectRepository(TaskEntity) private readonly tasksRepository: Repository<TaskEntity>) { }


    async getTasksById(id: string, user: UserEntity): Promise<TaskEntity> {
        const found = await this.tasksRepository.findOne({
            where: { id, user }
        })
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }
    async createTask(createTaskDto: createTaskDto, user: UserEntity): Promise<TaskEntity> {
        const { title, description } = createTaskDto;
        const task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });
        await this.tasksRepository.save(task);
        return task;
    }
    async getAllTasks(filterDto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
        const { status, search } = filterDto;
        const tasks = await this.tasksRepository.find({ where: { user: { id: user.id } } });
        return tasks;
        // const query = this.tasksRepository.createQueryBuilder('task');
        // query.where({ user });
        // return await query.getMany();
        // {
        //     where: this.listSearch.reduce((a: Object | Array<unknown>, b) => {
        //         let _a: Array<unknown> = a as Array<unknown>
        //         if (!Array.isArray(_a)) _a = []
        //         _a.push({ [b]: ILike(`%${search}%`) })
        //         return _a
        //     }, {})
        // }
    }
    async deleteTask(id: string, user: UserEntity): Promise<void> {
        const result = await this.tasksRepository.delete({ id, user });
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);

        }
    }
    async updateTaskStatus(id: string, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
        const task = await this.getTasksById(id, user);
        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }

}


