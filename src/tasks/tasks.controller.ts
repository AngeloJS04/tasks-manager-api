import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Delete, Patch, Query, UseGuards } from '@nestjs/common/decorators';
import { GetUser } from 'src/auth/get-user-decorator';
import { UserEntity } from 'src/database/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { TaskEntity } from '../database/entities/task.entity';
import { createTaskDto } from './dto/create-tasks.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: UserEntity): Promise<TaskEntity[]> {
        return this.tasksService.getAllTasks(filterDto, user);
    }
    @Post()
    createTask(@Body() createTaskDto: createTaskDto, @GetUser() user: UserEntity): Promise<TaskEntity> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Get(':id')
    getTaskById(@Param('id') id: string, @GetUser() user: UserEntity): Promise<TaskEntity> {
        return this.tasksService.getTasksById(id, user);
    }
    @Delete(':id')
    deleteTask(@Param('id') id: string, user: UserEntity): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }
    @Patch(':id/status')
    updateTaskStatus(@Param('id') id: string, @Body() UpdateTaskDto: UpdateTaskDto, user: UserEntity): Promise<TaskEntity> {
        const { status } = UpdateTaskDto;
        return this.tasksService.updateTaskStatus(id, status, user);
    }
}
