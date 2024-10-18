import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const LessonList = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/lessons/course/${courseId}`)
      .then(response => setLessons(response.data))
      .catch(error => console.error('Failed to fetch lessons', error));
  }, [courseId]);

  return (
    <div>
      <h2>Lessons</h2>
      <ul>
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <Link to={`/lessons/${lesson.id}`}>{lesson.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonList;
