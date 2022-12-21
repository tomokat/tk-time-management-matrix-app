import { Document } from 'mongoose';

export interface TaskItem extends Document {
  readonly name: String;
  readonly worksheet: String;
  readonly zone: Number,
  readonly color: String,
  readonly user: string;
}