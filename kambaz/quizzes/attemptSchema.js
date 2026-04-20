import mongoose from "mongoose";
const answerSchema = new mongoose.Schema(
  {
    questionId: String,
    answer: String,
  },
  { _id: false },
);
const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    quizId: String,
    userId: String,
    courseId: String,
    attemptNumber: Number,
    submittedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    answers: [answerSchema],
  },
  { collection: "quiz_attempts" },
);
export default attemptSchema;
