export default function EnrollmentsDao(db) {
  function enrollUserInCourse(enrollmentId, userId, courseId) {
    const { enrollments } = db;
    enrollments.push({ _id: enrollmentId, user: userId, course: courseId });
  }
  function getEnrollments() {
    return db.enrollments;
  }
  function unenrollUserFromCourse(enrollmentId) {
    const { enrollments } = db;
    console.log("enrollments before unenrollment:", enrollments);
    db.enrollments = enrollments.filter(
      (enrollment) => enrollment._id !== enrollmentId,
    );
    console.log("enrollments after unenrollment:", db.enrollments);
  }
  return { enrollUserInCourse, getEnrollments, unenrollUserFromCourse };
}
