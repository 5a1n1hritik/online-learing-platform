import React, { useEffect, useState } from "react";
import API from "@/api/axios";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { AnimatedResultFeedback } from "./AnimatedResultFeedback";
import QuizResultChart from "./QuizResultChart";
import QuizLoadingSkeleton from "./QuizLoadingSkeleton";
import { Link } from "react-router-dom";

const ShowResult = ({
  quizId,
  courseId,
  setQuizStarted,
  setQuizSubmitted,
  setShowResults,
  setCurrentQuestion,
  setAnswers,
  setTimeLeft,
  quizData,
}) => {
  const { user, isLoading } = useUser();
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoading || !user?.id || !quizId) return;

    const fetchQuizResult = async () => {
      try {
        const response = await API.get(`/quizzes/${quizId}/result/${user?.id}`);

        const resultData = response.data;
        console.log("Quiz Result Data:", resultData);
        setResult(resultData);
        // Calculate score %
        const total = resultData.detailedAnswers.length;
        const correct = resultData.detailedAnswers.filter(
          (ua) => ua.isCorrect
        ).length;

        const scorePercent = ((correct / total) * 100).toFixed();
        setScore(scorePercent);
      } catch (error) {
        console.error("Failed to fetch quiz metadata", error.message);
        setError("Failed to fetch quiz result. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizResult();
  }, [quizId, user?.id, isLoading]);

  if (loading) return <QuizLoadingSkeleton />;

  if (error) return <p>{error}</p>;

  const passed = score >= result.score;
  const correctAnswers = result.detailedAnswers.filter(
    (ua) => ua.selectedOptionId === ua.correctOptionId
  ).length;
  const incorrectAnswers = result.detailedAnswers.filter(
    (ua) => ua.selectedOptionId !== ua.correctOptionId
  ).length;
  const unattemptedQuestions = result.detailedAnswers.filter(
    (ua) => ua.selectedOptionId === null
  ).length;

  return (
    <>
      <div className="container max-w-6xl py-12">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <CardDescription>{result.quiz.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Animated Result Feedback */}
            <AnimatedResultFeedback passed={passed} score={score} />

            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>
                  Detailed analysis of your performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">
                      {result.detailedAnswers.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Questions
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-500">
                      {
                        result.detailedAnswers.filter(
                          (ua) => ua.selectedOptionId === ua.correctOptionId
                        ).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Correct Answers
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-500">
                      {
                        result.detailedAnswers.filter(
                          (ua) => ua.selectedOptionId !== ua.correctOptionId
                        ).length
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Incorrect Answers
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-500">
                      {/* {unattemptedQuestions} */}TODO:not set
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unattempted
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-500">
                      {result.timeTaken} seconds
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Take Time
                    </div>
                  </div>
                </div>
                {/* Visual Chart */}
                <QuizResultChart
                  totalQuestions={result.detailedAnswers.length}
                  correctAnswers={correctAnswers}
                  incorrectAnswers={incorrectAnswers}
                  unattemptedQuestions={unattemptedQuestions}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <CardTitle>Question Review</CardTitle>
                <CardDescription>
                  Review your answers and see the correct solutions
                </CardDescription>
                <div className=" space-x-2">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </Button>
                  <Button
                    variant={language === "hi" ? "default" : "outline"}
                    onClick={() => setLanguage("hi")}
                  >
                    हिन्दी
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Accordion
                  type="single"
                  collapsible={true}
                  className="w-full space-y-2"
                >
                  {result.detailedAnswers.map((ua, index) => {
                    const isCorrect =
                      ua.selectedOptionId === ua.correctOptionId;
                    const wasAttempted = ua.selectedOptionId !== null;

                    return (
                      <AccordionItem
                        key={ua.questionId}
                        value={`question-${index}`}
                      >
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Question {index + 1}
                              </span>
                              {wasAttempted ? (
                                isCorrect ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Correct
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Incorrect
                                  </Badge>
                                )
                              ) : (
                                <Badge variant="secondary">
                                  <HelpCircle className="h-3 w-3 mr-1" />
                                  Unattempted
                                </Badge>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <p className="font-medium text-base md:text-lg">
                              {language === "en"
                                ? ua.questionText_en
                                : ua.questionText_hi}
                            </p>

                            <div className="space-y-3">
                              {ua.allOptions.map((option) => {
                                const isCorrectOption =
                                  option.id === ua.correctOptionId;
                                const isSelectedOption =
                                  option.id === ua.selectedOptionId;

                                return (
                                  <div
                                    key={option.id}
                                    className={`relative p-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                                      isCorrectOption
                                        ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                                        : isSelectedOption
                                        ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                                        : "bg-muted dark:bg-muted/30 border-border"
                                    }`}
                                  >
                                    {/* Option Text */}
                                    <span>
                                      {language === "en"
                                        ? option.text_en
                                        : option.text_hi}
                                      {isSelectedOption && (
                                        <span className="ml-2 italic text-muted-foreground text-xs">
                                          (You selected)
                                        </span>
                                      )}
                                    </span>

                                    {/* Icons */}
                                    <div className="flex-shrink-0 pt-1 ml-auto">
                                      {isCorrectOption && (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      )}
                                      {isSelectedOption && !isCorrectOption && (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* If Unattempted */}
                            {!wasAttempted && (
                              <p className="text-sm text-muted-foreground italic mt-2">
                                You did not answer this question.
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to={`/courses/${courseId}`}>Back to Course</Link>
            </Button>
            <Button
              onClick={() => {
                setQuizStarted(false);
                setQuizSubmitted(false);
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
                setTimeLeft(quizData.timeLimit || 300);
              }}
            >
              Retake Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ShowResult;
