import API from "@/api/axios";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  HelpCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShowResult from "./ShowResult";

const CourseQuiz = () => {
  const { courseId, quizId } = useParams();
  const [quizData, setQuizData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [language, setLanguage] = useState("hi");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const allAnswered =
    questions.length > 0 && Object.keys(answers).length === questions.length;

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await API.get(`/quizzes/course/${courseId}`);
        setQuizData(response.data.quiz[0]);
        setTimeLeft(response.data.quiz[0].timeLimit * 60);
      } catch (error) {
        console.error("Failed to fetch quiz metadata", error.message);
      }
    };
    fetchQuizzes();
  }, [courseId]);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await API.get(
          `/quizzes/${quizId}/questions?language=${language}`
        );
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [quizId, language]);

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

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setLoading(true);

      // Prepare answers array for API
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOption]) => ({
          questionId: parseInt(questionId),
          selectedOption: parseInt(selectedOption),
        })
      );

      // Calculate time taken in seconds (assuming timeLimit is in minutes)
      const timeLimitSeconds = quizData.timeLimit * 60;
      const timeTaken = timeLimitSeconds - timeLeft;

      const response = await API.post(`/quizzes/${quizId}/submit`, {
        timeTaken,
        answers: formattedAnswers,
      });

      console.log("Quiz submission response:", response.data);

      if (response.data.success) {
        setScore(
          Math.round((response.data.score / response.data.totalQuestions) * 100)
        );
        setQuizSubmitted(true);
        // setShowResults(true);
      } else {
        alert("Failed to submit quiz: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting the quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowResults = async () => {
    if (!allAnswered) {
      alert("Please answer all questions before viewing results.");
      return;
    }
    setShowResults(true);
  };

  const handleConfirmSubmit = () => {
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setConfirmSubmit(false);
    handleSubmitQuiz();
    handleShowResults();
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Determine time warning classes
  const getTimeClass = () => {
    if (timeLeft < 60) return "countdown-timer danger";
    if (timeLeft < 180) return "countdown-timer warning";
    return "countdown-timer";
  };

  // Handle navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (!quizStarted) {
    return (
      <div className="container max-w-4xl py-12">
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
                <span>Total Questions: {questions.length}</span>
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
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to={`/courses/${courseId}`}>Back to Course</Link>
            </Button>
            <Button onClick={() => setQuizStarted(true)}>Start Quiz</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Quiz results screen
  if (showResults) {
    return (
      <ShowResult
        quizId={quizId}
        courseId={courseId}
        setQuizStarted={setQuizStarted}
        setQuizSubmitted={setQuizSubmitted}
        setShowResults={setShowResults}
        setCurrentQuestion={setCurrentQuestion}
        setAnswers={setAnswers}
        setTimeLeft={setTimeLeft}
        quizData={quizData}
      />
    );
  }

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
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            Complete
          </span>
        </div>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="h-2"
        />
      </div>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl">
            {questions[currentQuestion]?.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[questions[currentQuestion]?.id] || ""}
            onValueChange={(value) =>
              handleAnswerSelect(questions[currentQuestion]?.id, value)
            }
          >
            <div className="space-y-3">
              {questions[currentQuestion]?.options?.map((opt) => (
                <div
                  key={opt.id}
                  className={`quiz-option ${
                    answers[questions[currentQuestion]?.id] === opt.id
                      ? "selected"
                      : ""
                  }`}
                >
                  <RadioGroupItem value={opt.id} id={opt.id} className="mr-3" />
                  <Label htmlFor={opt.id} className="flex-1 cursor-pointer">
                    {opt.text}
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
            {currentQuestion < questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>Next</Button>
            ) : (
              <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
                <DialogTrigger asChild>
                  <Button
                    disabled={!allAnswered}
                    title={
                      !allAnswered
                        ? "Please answer all questions before submitting"
                        : undefined
                    }
                  >
                    Submit Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Quiz</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to submit your quiz? You have
                      answered {Object.keys(answers).length} out of{" "}
                      {questions.length} questions. Submit now?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmSubmit(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmSubmit}>Submit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {questions.map((_, index) => (
          <Button
            key={index}
            variant={
              currentQuestion === index
                ? "default"
                : answers[questions[index].id]
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

      <div>
        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Once you submit the quiz, you cannot change your answers. Make sure
            to review all questions before submitting.
          </AlertDescription>
        </Alert>

        <div className="mt-4">
          <Button asChild className="w-full">
            <Link to={`/courses/${courseId}`}>Back to Course</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseQuiz;
