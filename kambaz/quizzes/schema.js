import mongoose from "mongoose";
import questionSchema from "./questionSchema.js";
const schema = new mongoose.Schema(
  {
    _id: String,
    courseId: String,
    title: { type: String, default: "Unnamed Quiz" },
    description: { type: String, default: "" },
    published: { type: Boolean, default: false },
    quizType: {
      type: String,
      enum: [
        "GRADED_QUIZ",
        "PRACTICE_QUIZ",
        "GRADED_SURVEY",
        "UNGRADED_SURVEY",
      ],
      default: "GRADED_QUIZ",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "immediately" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: Date,
    availableDate: Date,
    untilDate: Date,
    questions: [questionSchema],
  },
  { collection: "quizzes" },
);
export default schema;
