import mongoose from "mongoose";
const choiceSchema = new mongoose.Schema({
  _id: String,
  text: String,
});
const questionSchema = new mongoose.Schema({
  _id: String,
  title: String,
  type: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
    default: "MULTIPLE_CHOICE",
  },
  points: { type: Number, default: 1 },
  question: String,
  choices: [choiceSchema],
  correctAnswer: String,
  possibleAnswers: [String],
});
export default questionSchema;
