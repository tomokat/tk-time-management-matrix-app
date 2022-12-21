import { Connection } from "mongoose";
import { WorksheetSchema } from "./schemas/worksheet.schema";

export const WorksheetProviders = [
  {
    provide: 'WORKSHEET_MODEL',
    useFactory: (connection: Connection) => connection.model('Worksheet', WorksheetSchema),
    inject: ['DATABSE_CONNECTION']
  }
];