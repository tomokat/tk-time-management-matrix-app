import * as mongoose from 'mongoose';

export const WorksheetSchema = new mongoose.Schema({
  caption: String,
  legends: [],
  isOpen: {type: Boolean, default: true},
  user: String,
}, {timestamps: true});