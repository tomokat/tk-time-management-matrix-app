import * as mongoose from 'mongoose';

export const WorksheetSchema = new mongoose.Schema({
  caption: String,
  legends: [],
  user: String,
}, {timestamps: true});