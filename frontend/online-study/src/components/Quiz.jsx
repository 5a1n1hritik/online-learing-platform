import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = ({ lessonId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/lesson/${lessonId}`)
      .then(response => setQuizzes(response.data))
      .catch(error => console.error('Failed to fetch quizzes', error));
  }, [lessonId]);

  const handleSubmit = (quizId) => {
    axios.post('http://localhost:5000/api/quizzes/submit', { quizId, userAnswer })
      .then(response => setResult(response.data.isCorrect ? 'Correct' : 'Incorrect'))
      .catch(error => console.error('Quiz submission failed', error));
  };

  return (
    <div>
      <h3>Quiz</h3>
      {quizzes.map((quiz, index) => (
        <div key={quiz.id}>
          <p>{quiz.question}</p>
          <ul>
            {quiz.options.map((option, i) => (
              <li key={i}>
                <input type="radio" name={`quiz-${index}`} value={option} onChange={() => setUserAnswer(option)} />
                {option}
              </li>
            ))}
          </ul>
          <button onClick={() => handleSubmit(quiz.id)}>Submit</button>
        </div>
      ))}
      {result && <p>{result}</p>}
    </div>
  );
};

export default Quiz;
