import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./page/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Courses from "./page/Courses";
import CourseDetails from "./page/CourseDetails";
import CourseQuiz from "./components/CourseQuiz";
import CoursesExams from "./components/CoursesExams";
import { Toaster } from "./components/ui/toaster";
import GlobalExams from "./page/GlobalExams";
import ExamScreen from "./components/ExamScreen";

function App() {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith("/admin");

  return (
    <div>
      {!isAdminDashboard && <Navbar />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/" element={<Home />} />
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
