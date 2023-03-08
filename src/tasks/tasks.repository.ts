// make a repository for tasks
//
import { Injectable } from '@nestjs/common';
import { TaskEntity } from 'src/database/entities/task.entity';
import {  Repository } from 'typeorm';

@Injectable()
export class TasksRepository extends Repository<TaskEntity> {



}