import { Module } from '@nestjs/common';
import { TaskItemService } from './task-item.service';
import { TaskItemController } from './task-item.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TaskItemProviders } from './task-item.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [TaskItemController],
  providers: [TaskItemService, ...TaskItemProviders]
})
export class TaskItemModule {}
