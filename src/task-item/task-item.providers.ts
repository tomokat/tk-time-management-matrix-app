import { Connection } from "mongoose";
import { TaskItemSchema } from "./schemas/task-item.schema";

export const TaskItemProviders = [
  {
    provide: 'TASK_ITEM_MODEL',
    useFactory: (connection: Connection) => connection.model('TaskItem', TaskItemSchema),
    inject: ['DATABSE_CONNECTION']
  }
];