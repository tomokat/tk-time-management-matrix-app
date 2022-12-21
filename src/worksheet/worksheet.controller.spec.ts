import { Test, TestingModule } from '@nestjs/testing';
import { WorksheetController } from './worksheet.controller';
import { WorksheetService } from './worksheet.service';

describe('WorksheetController', () => {
  let controller: WorksheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorksheetController],
      providers: [WorksheetService],
    }).compile();

    controller = module.get<WorksheetController>(WorksheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
