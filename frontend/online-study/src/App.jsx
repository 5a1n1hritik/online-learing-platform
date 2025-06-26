import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./page/Register";
import Login from "./page/Login";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";
import Home from "./page/Home";
import Footer from "./page/Footer";
import Navbar from "./page/Navbar";
import Courses from "./page/Courses";
import CourseDetails from "./page/CourseDetails";
import CourseQuiz from "./components/CourseQuiz";
import CoursesExams from "./components/CoursesExams";
import { Toaster } from "./components/ui/toaster";
import GlobalExams from "./page/GlobalExams";
import ExamScreen from "./components/ExamScreen";
import VerifyEmail from "./page/VerifyEmail";
// import EmailVerified from "./page/EmailVerifyed";
// import CheckEmail from "./page/CheckEmail";

function App() {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith("/admin");

  return (
    <div>
      {!isAdminDashboard && <Navbar />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/check-email" element={<CheckEmail />} /> */}
        <Route path="/verify-otp" element={<VerifyEmail />} />
        {/* <Route path="/email-verified" element={<EmailVerified />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/courses/:courseId/quiz/:quizId" element={<CourseQuiz />} />
        <Route path="/courses/:courseId/exam/:examId" element={<CoursesExams />} />
        <Route path="/globalexams" element={<GlobalExams />} />
        <Route path="/globalexams/:examId/start" element={<ExamScreen />} />
      </Routes>

      <Toaster />
      {!isAdminDashboard && <Footer />}
    </div>
  );
}

export default App;
