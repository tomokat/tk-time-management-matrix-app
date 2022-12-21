import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorksheetService } from './worksheet.service';
import { CreateWorksheetDto } from './dto/create-worksheet.dto';
import { UpdateWorksheetDto } from './dto/update-worksheet.dto';

@Controller('time-management-matrix-api/worksheet')
export class WorksheetController {
  constructor(private readonly worksheetService: WorksheetService) {}

  @Post()
  create(@Body() createWorksheetDto: CreateWorksheetDto) {
    return this.worksheetService.create(createWorksheetDto);
  }

  @Get()
  findAll() {
    return this.worksheetService.findAll();
  }

  @Get('/user/guest')
  findAllForGuest() {
    return this.worksheetService.findAllByUser('');
  }

  @Get('/user/:user')
  findAllByUser(@Param('user') user: string) {
    return this.worksheetService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.worksheetService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorksheetDto: UpdateWorksheetDto) {
    return this.worksheetService.update(id, updateWorksheetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worksheetService.remove(id);
  }
}
