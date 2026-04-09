import mongoose from "mongoose";
const schema = new mongoose.Schema({
  _id: String,
  title: String,
  description: String,
  points: Number,
  availableFrom: Date,
  dueDate: Date,
});
export default schema;
