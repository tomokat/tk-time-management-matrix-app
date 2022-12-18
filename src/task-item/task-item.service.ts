import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { TaskItem } from './interfaces/task-item.interface';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';

@Injectable()
export class TaskItemService {

  constructor(
    @Inject('TASK_ITEM_MODEL')
    private taskItemModel: Model<TaskItem>,
  ){};

  create(createTaskItemDto: CreateTaskItemDto) {
    const createdLabel = new this.taskItemModel(createTaskItemDto);
    return createdLabel.save();
  }

  findAll() {
    return this.taskItemModel.find().exec();
  }

  findAllByUser(user: string) {
    return this.taskItemModel.find().
      where('user').equals(user).
      exec();
  }

  findOne(id: string) {
    return this.taskItemModel.findById(id);
  }

  update(id: string, updateTaskItemDto: UpdateTaskItemDto) {
    return this.findOne(id).update(updateTaskItemDto).exec();
  }

  remove(id: string) {
    return this.findOne(id).remove().exec();
  }
}
