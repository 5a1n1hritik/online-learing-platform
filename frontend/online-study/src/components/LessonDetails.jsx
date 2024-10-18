import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Quiz from './Quiz';

const LessonDetails = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/lessons/${id}`)
      .then(response => setLesson(response.data))
      .catch(error => console.error('Failed to fetch lesson details', error));
  }, [id]);

  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>{lesson.content}</p>
      {lesson.pdfUrl && <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>}
      <Quiz lessonId={id} />
    </div>
  );
};

export default LessonDetails;
