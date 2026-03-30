import EnrollmentsDao from "./dao.js";
import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  const getEnrollments = (req, res) => {
    const enrollments = dao.getEnrollments();
    res.json(enrollments);
  };
  const enrollUserInCourse = (req, res) => {
    const { userId, courseId } = req.body;
    const enrollmentId = uuidv4();
    dao.enrollUserInCourse(enrollmentId, userId, courseId);
    res.send({ _id: enrollmentId, user: userId, course: courseId });
  };
  const unenrollUserFromCourse = (req, res) => {
    const { enrollmentId } = req.body;
    dao.unenrollUserFromCourse(enrollmentId);
    res.sendStatus(200);
  };
  app.get("/api/enrollments", getEnrollments);
  app.post("/api/enrollments", enrollUserInCourse);
  app.delete("/api/enrollments", unenrollUserFromCourse);
}
