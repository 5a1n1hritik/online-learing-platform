import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}/Details`)
      .then(response => setCourse(response.data))
      .catch(error => console.error('Failed to fetch course details', error));
  }, [id]);

  if (!course) return <div>Loading...</div>;

  const enrollInCourse = () => {
    axios.post(' http://localhost:5000/api/enrollments/enrollCourse', { userId: 1, courseId: course.id })  // Hardcoded userId for simplicity
      .then(() => alert('Enrolled successfully'))
      .catch(error => alert('Enrollment failed'));
  };
  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <button onClick={enrollInCourse}>Enroll</button>
    </div>
  );
};

export default CourseDetails;
