import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EnrolledCourses = () => {
  const [enrollments, setEnrollments] = useState([]);

// use this api ==>  http://localhost:5000/api/enrollments/user/:userId

  useEffect(() => {
    axios.get('http://localhost:5000/api/enrollments/user/1')  // Hardcoded userId for simplicity
      .then(response => setEnrollments(response.data))
      .catch(error => console.error('Failed to fetch enrolled courses', error));
  }, []);

  return (
    <div>
      <h2>Enrolled Courses</h2>
      <ul>
        {enrollments.map(enrollment => (
          <li key={enrollment.id}>{enrollment.Course.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default EnrolledCourses;
