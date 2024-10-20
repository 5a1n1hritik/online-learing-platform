import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginFrom';
import RegistrationForm from './components/RegistrationFrom';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import CourseDetails from './components/CourseDetails';
import EnrolledCourses from './components/EnrolledCourses';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/user/dashboard" element={<Dashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/" element={<CourseList />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/dashboard/enrolledcourses" element={<EnrolledCourses />} />
    </Routes>
  );
}

export default App;
