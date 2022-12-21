import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Worksheet } from './interfaces/worksheet.interface';
import { CreateWorksheetDto } from './dto/create-worksheet.dto';
import { UpdateWorksheetDto } from './dto/update-worksheet.dto';

@Injectable()
export class WorksheetService {
  constructor(
    @Inject('WORKSHEET_MODEL')
    private worksheetModel: Model<Worksheet>,
  ){};

  create(createWorksheetDto: CreateWorksheetDto) {
    const createdWorksheet = new this.worksheetModel(createWorksheetDto);
    return createdWorksheet.save();
  }

  findAll() {
    return `This action returns all worksheet`;
  }

  findAllByUser(user: string) {
    return this.worksheetModel.find().
      where('user').equals(user).
      exec();
  }

  findOne(id: string) {
    return `This action returns a #${id} worksheet`;
  }

  update(id: string, updateWorksheetDto: UpdateWorksheetDto) {
    return `This action updates a #${id} worksheet`;
  }

  remove(id: string) {
    return `This action removes a #${id} worksheet`;
  }
}
