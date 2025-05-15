import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock quiz data
const quizData = {
  id: "quiz-1",
  title: "HTML & CSS Fundamentals Quiz",
  description: "Test your knowledge of HTML and CSS basics",
  courseId: "1",
  courseName: "Web Development Fundamentals",
  timeLimit: 15, // in minutes
  passingScore: 70,
  questions: [
    {
      id: "q1",
      question: "What does HTML stand for?",
      options: [
        { id: "a", text: "Hyper Text Markup Language" },
        { id: "b", text: "High Tech Modern Language" },
        { id: "c", text: "Hyper Transfer Markup Language" },
        { id: "d", text: "Home Tool Markup Language" },
      ],
      correctAnswer: "a",
    },
    {
      id: "q2",
      question:
        "Which CSS property is used to change the text color of an element?",
      options: [
        { id: "a", text: "color" },
        { id: "b", text: "text-color" },
        { id: "c", text: "font-color" },
        { id: "d", text: "text-style" },
      ],
      correctAnswer: "a",
    },
    {
      id: "q3",
      question: "Which HTML tag is used to define an unordered list?",
      options: [
        { id: "a", text: "<ol>" },
        { id: "b", text: "<list>" },
        { id: "c", text: "<ul>" },
        { id: "d", text: "<li>" },
      ],
      correctAnswer: "c",
    },
    {
      id: "q4",
      question: "Which CSS property is used to add space between elements?",
      options: [
        { id: "a", text: "spacing" },
        { id: "b", text: "margin" },
        { id: "c", text: "padding" },
        { id: "d", text: "border" },
      ],
      correctAnswer: "b",
    },
    {
      id: "q5",
      question: "In CSS, what does the 'box-sizing' property do?",
      options: [
        {
          id: "a",
          text: "It defines how the width and height of an element are calculated",
        },
        { id: "b", text: "It creates a box around an element" },
        { id: "c", text: "It sets the size of the border box" },
        {
          id: "d",
          text: "It determines if an element should be displayed as a block or inline",
        },
      ],
      correctAnswer: "a",
    },
  ],
};

const CourseQuiz = () => {
  const navigate = useNavigate();
  const { id, quizId } = useParams();

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quizData.timeLimit * 60); // in seconds
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const [quizData2, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const response = await fetch(`/api/courses/${id}/quizzes/${quizId}`);
//         const data = await response.json();
//         setQuizData(data);
//         setTimeLeft(data.timeLimit * 60); // update timer
//       } catch (error) {
//         console.error("Failed to fetch quiz:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuiz();
//   }, [id, quizId]);

  // Start timer when quiz starts
  useEffect(() => {
    if (quizStarted && !quizSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, quizSubmitted]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    // Calculate score
    let correctAnswers = 0;
    quizData.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = Math.round(
      (correctAnswers / quizData.questions.length) * 100
    );
    setScore(calculatedScore);
    setQuizSubmitted(true);
    setShowResults(true);
  };

  // Handle navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Get current question
  const question = quizData.questions[currentQuestion];

  // Determine time warning classes
  const getTimeClass = () => {
    if (timeLeft < 60) return "countdown-timer danger";
    if (timeLeft < 180) return "countdown-timer warning";
    return "countdown-timer";
  };

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="container max-w-4xl py-12">
        <Link
          to={`/courses/${id}`}
          className="inline-flex items-center mb-4 text-sm font-medium text-primary"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Course
        </Link>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">{quizData.title}</CardTitle>
            <CardDescription>{quizData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>Time Limit: {quizData.timeLimit} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                <span>Passing Score: {quizData.passingScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span>Total Questions: {quizData.questions.length}</span>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Once you start the quiz, the timer will begin. You must complete
                all questions within the time limit. You can navigate between
                questions, but the quiz will automatically submit when time runs
                out.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setQuizStarted(true)} className="w-full">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quiz results screen
  if (showResults) {
    const passed = score >= quizData.passingScore;

    return (
      <div className="container max-w-4xl py-12">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <CardDescription>{quizData.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div
                className={`text-5xl font-bold mb-2 ${
                  passed ? "text-green-500" : "text-red-500"
                }`}
              >
                {score}%
              </div>
              <p className="text-muted-foreground">
                You answered{" "}
                {
                  quizData.questions.filter(
                    (q) => answers[q.id] === q.correctAnswer
                  ).length
                }{" "}
                out of {quizData.questions.length} questions correctly
              </p>
              <div className="mt-4">
                {passed ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-medium">You passed!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="h-6 w-6" />
                    <span className="font-medium">
                      You did not pass. Try again!
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Question Review</h3>
              {quizData.questions.map((q, index) => (
                <div key={q.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    {answers[q.id] === q.correctAnswer ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Correct
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="mt-2">{q.question}</p>
                  <div className="mt-2 space-y-1">
                    {q.options.map((option) => (
                      <div
                        key={option.id}
                        className={`p-2 rounded ${
                          option.id === q.correctAnswer
                            ? "bg-green-100 dark:bg-green-900/20 border border-green-500"
                            : option.id === answers[q.id] &&
                              option.id !== q.correctAnswer
                            ? "bg-red-100 dark:bg-red-900/20 border border-red-500"
                            : ""
                        }`}
                      >
                        {option.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/${id})`)}
            >
              Back to Course
            </Button>
            <Button
              onClick={() => {
                setQuizStarted(false);
                setQuizSubmitted(false);
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
                setTimeLeft(quizData.timeLimit * 60);
              }}
            >
              Retake Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{quizData.title}</h1>
        <div className={getTimeClass()}>
          <Clock className="mr-2 h-5 w-5 inline-block" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Question {currentQuestion + 1} of {quizData.questions.length}
          </span>
          <span>
            {Math.round(
              ((currentQuestion + 1) / quizData.questions.length) * 100
            )}
            % Complete
          </span>
        </div>
        <Progress
          value={((currentQuestion + 1) / quizData.questions.length) * 100}
          className="h-2"
        />
      </div>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswerSelect(question.id, value)}
          >
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={`quiz-option ${
                    answers[question.id] === option.id ? "selected" : ""
                  }`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="mr-3"
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
          </div>
          <div className="flex gap-2">
            {currentQuestion < quizData.questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>Next</Button>
            ) : (
              <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
                <DialogTrigger asChild>
                  <Button>Submit Quiz</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Quiz</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to submit your quiz? You have
                      answered {Object.keys(answers).length} out of{" "}
                      {quizData.questions.length} questions.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmSubmit(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitQuiz}>Submit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {quizData.questions.map((_, index) => (
          <Button
            key={index}
            variant={
              currentQuestion === index
                ? "default"
                : answers[quizData.questions[index].id]
                ? "outline"
                : "secondary"
            }
            size="sm"
            className="w-10 h-10 p-0 rounded-full"
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CourseQuiz;
