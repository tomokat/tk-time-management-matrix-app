import * as mongoose from 'mongoose';

export const TaskItemSchema = new mongoose.Schema({
  name: String,
  worksheet: {type: String, default: ''},
  zone: Number,
  color: String,
  user: String,
}, {timestamps: true});