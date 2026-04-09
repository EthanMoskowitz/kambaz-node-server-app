import mongoose from "mongoose";
import moduleSchema from "../modules/schema.js";
import assignmentSchema from "../assignments/schema.js";
const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    modules: [moduleSchema],
    assignments: [assignmentSchema],
  },
  { collection: "courses" },
);
export default courseSchema;
