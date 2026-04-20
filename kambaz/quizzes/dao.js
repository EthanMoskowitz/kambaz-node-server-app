import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import attemptModel from "./attemptModel.js";

export default function QuizzesDao() {
  async function findQuizzesForCourse(courseId) {
    return await model.find({ courseId });
  }

  async function findPublishedQuizzesForCourse(courseId) {
    return await model.find({ courseId, published: true });
  }

  async function findQuizById(quizId) {
    return await model.findById(quizId);
  }

  async function createQuiz(courseId, quiz) {
    const newQuiz = {
      ...quiz,
      _id: uuidv4(),
      courseId,
      published: false,
      questions: [],
    };
    return await model.create(newQuiz);
  }

  async function updateQuiz(quizId, quizUpdates) {
    await model.updateOne({ _id: quizId }, { $set: quizUpdates });
    return model.findById(quizId);
  }

  async function deleteQuiz(quizId) {
    return await model.deleteOne({ _id: quizId });
  }

  async function publishQuiz(quizId) {
    return model.updateOne({ _id: quizId }, { $set: { published: true } });
  }

  async function unpublishQuiz(quizId) {
    return model.updateOne({ _id: quizId }, { $set: { published: false } });
  }

  // Questions
  async function addQuestion(quizId, question) {
    const newQuestion = { ...question, _id: uuidv4() };
    await model.updateOne(
      { _id: quizId },
      { $push: { questions: newQuestion } },
    );
    return newQuestion;
  }

  async function updateQuestion(quizId, questionId, questionUpdates) {
    const quiz = await model.findById(quizId);
    const question = quiz.questions.id(questionId);
    Object.assign(question, questionUpdates);
    await quiz.save();
    return question;
  }

  async function deleteQuestion(quizId, questionId) {
    return model.updateOne(
      { _id: quizId },
      { $pull: { questions: { _id: questionId } } },
    );
  }

  // Quiz Attempts
  async function findAttemptsForUserandQuiz(quizId, userId) {
    return await attemptModel.find({ quizId, userId });
  }

  async function countAttemptsForUserandQuiz(quizId, userId) {
    return await attemptModel.countDocuments({ quizId, userId });
  }

  async function createAttempt(attempt) {
    const count = await countAttemptsForUserAndQuiz(
      attempt.userId,
      attempt.quizId,
    );
    const newAttempt = { ...attempt, _id: uuidv4(), attemptNumber: count + 1 };
    return attemptModel.create(newAttempt);
  }

  return {
    findQuizzesForCourse,
    findPublishedQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    unpublishQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    findAttemptsForUserandQuiz,
    countAttemptsForUserandQuiz,
    createAttempt,
  };
}
