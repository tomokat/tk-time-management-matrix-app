import { Module } from '@nestjs/common';
import { WorksheetService } from './worksheet.service';
import { WorksheetController } from './worksheet.controller';
import { DatabaseModule } from 'src/database/database.module';
import { WorksheetProviders } from './worksheet.providers';
 
@Module({
  imports: [DatabaseModule],
  controllers: [WorksheetController],
  providers: [WorksheetService, ...WorksheetProviders]
})
export class WorksheetModule {}
