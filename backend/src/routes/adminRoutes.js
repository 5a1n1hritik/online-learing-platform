import express from "express";

const router = express.Router();

// managing users
// router.get("/all-users", verifyAdmin, getAllUsers);
// router.get("/users/:userId", verifyAdmin, getUserDetails);
// router.put("/update-users/:userId", verifyAdmin, updateUser);
// router.delete("/delete-users/:userId", verifyAdmin, deleteUser);

// managing courses
// router.post("/create", verifyAdmin, createCourse);
// router.get("/all-courses", verifyAdmin, getAllCourses);
// router.get("/course/:courseId", verifyAdmin, getCourseDetails);
// router.put("/update-course/:courseId", verifyAdmin, updateCourse);
// router.delete("/delete-course/:courseId", verifyAdmin, deleteCourse);
// Add: router.patch("/status/:id", toggleCourseStatus)

// managing categories
// Add: createCategory
// Add: updateCategory
// Add: deleteCategory

// managing quizzes
// Add: createQuiz
// Add: getAllQuizzes
// Add: getQuizDetails
// Add: updateQuiz
// Add: deleteQuiz
// Add: addQuestionToQuiz

// managing exams
// Add: createExamPaper
// Add: getAllExamPapers
// Add: addQuestionToPaper
// Add: createExam
// Add: getAllExams
// Add: getExamDetails
// Add: updateExam
// Add: deleteExam
// Add: addQuestionToExam

// managing analytics

export default router;
