import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskItemService } from './task-item.service';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';

@Controller('time-management-matrix-api/task-item')
export class TaskItemController {
  constructor(private readonly taskItemService: TaskItemService) {}

  @Post()
  create(@Body() createTaskItemDto: CreateTaskItemDto) {
    return this.taskItemService.create(createTaskItemDto);
  }

  @Get()
  findAll() {
    return this.taskItemService.findAll();
  }

  // @Get('/user/guest')
  // findAllForGuest() {
  //   return this.taskItemService.findAllByUser('');
  // }

  @Get('/base/guest')
  findAllByBaseForGuest() {
    return this.taskItemService.findAllWithBaseWorksheetForUser('', '');
  }

  @Get('/base/:user')
  findAllByBaseForUser(@Param('user') user : string) {
    return this.taskItemService.findAllWithBaseWorksheetForUser('', user);
  }

  @Get('/:worksheet/guest')
  findAllByWorksheetForGuest(
    @Param('worksheet') worksheet : string) {
    return this.taskItemService.findAllByWorksheetForUser(worksheet, '');
  }

  @Get('/:worksheet/:user')
  findAllByWorksheetForUser(
    @Param('worksheet') worksheet: string,
    @Param('user') user: string) {
    return this.taskItemService.findAllByWorksheetForUser(worksheet, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskItemDto: UpdateTaskItemDto) {
    return this.taskItemService.update(id, updateTaskItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskItemService.remove(id);
  }
}
