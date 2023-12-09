
import mongoose from "mongoose";

interface  StatsModelType {
  users:number
  subscription:number,
  views:number
  createdAt:Date
}

const statSchema = new mongoose.Schema({
  users: {
    type: Number,
    default: 0,
  },

  subscription: {
    type: Number,
    default: 0,
  },

  views: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});






export const statsModel = mongoose.model<StatsModelType>("statsModel", statSchema);
 