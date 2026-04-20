import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();

  // Quizzes
  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session?.currentUser;
    const quizzes =
      currentUser?.role === "STUDENT"
        ? await dao.findPublishedQuizzesForCourse(courseId)
        : await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  };

  const createQuiz = async (req, res) => {
    const { courseId } = req.params;
    const quiz = await dao.createQuiz(courseId, req.body);
    res.json(quiz);
  };

  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.updateQuiz(quizId, req.body);
    res.json(quiz);
  };

  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };

  const publishQuiz = async (req, res) => {
    const { quizId } = req.params;
    await dao.publishQuiz(quizId);
    res.json({ published: true });
  };

  const unpublishQuiz = async (req, res) => {
    const { quizId } = req.params;
    await dao.unpublishQuiz(quizId);
    res.json({ published: false });
  };

  // Questions
  const addQuestion = async (req, res) => {
    const { quizId } = req.params;
    const question = await dao.addQuestion(quizId, req.body);
    res.json(question);
  };

  const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const question = await dao.updateQuestion(quizId, questionId, req.body);
    res.json(question);
  };

  const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const status = await dao.deleteQuestion(quizId, questionId);
    res.json(status);
  };

  // Attempts
  const getMyAttempts = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session?.currentUser;
    if (!currentUser) return res.status(401).json({ message: "Not signed in" });
    const attempts = await dao.findAttemptsForUserAndQuiz(
      currentUser._id,
      quizId,
    );
    res.json(attempts);
  };

  const submitAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session?.currentUser;
    if (!currentUser) return res.status(401).json({ message: "Not signed in" });
    const quiz = await dao.findQuizById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const attemptCount = await dao.countAttemptsForUserAndQuiz(
      currentUser._id,
      quizId,
    );
    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      return res.status(403).json({ message: "No attempts remaining" });
    }
    if (!quiz.multipleAttempts && attemptCount >= 1) {
      return res.status(403).json({ message: "No attempts remaining" });
    }

    const { answers, courseId } = req.body;
    const score = gradeAttempt(quiz, answers);
    const attempt = await dao.createAttempt({
      quizId,
      userId: currentUser._id,
      courseId,
      answers,
      score,
    });
    res.json(attempt);
  };

  function gradeAttempt(quiz, answers) {
    let total = 0;
    for (const question of quiz.questions) {
      const submitted = answers.find((a) => a.questionId === question._id);
      if (!submitted) continue;
      if (
        question.type === "MULTIPLE_CHOICE" ||
        question.type === "TRUE_FALSE"
      ) {
        if (submitted.answer === question.correctAnswer) {
          total += question.points;
        }
      } else if (question.type === "FILL_IN_BLANK") {
        const correct = question.possibleAnswers.some(
          (pa) => pa.toLowerCase() === submitted.answer.toLowerCase(),
        );
        if (correct) total += question.points;
      }
    }
    return total;
  }

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);
  app.put("/api/quizzes/:quizId/unpublish", unpublishQuiz);
  app.post("/api/quizzes/:quizId/questions", addQuestion);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
  app.get("/api/quizzes/:quizId/attempts/me", getMyAttempts);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
}
