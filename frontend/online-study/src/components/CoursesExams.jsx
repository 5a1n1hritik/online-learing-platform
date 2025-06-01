import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Globe,
  XCircle,
  Timer,
  Medal,
  ListCheck,
  ListTree,
  LayoutDashboard,
  Scale,
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
import API from "@/api/axios";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { AnimatedResultFeedback } from "./AnimatedResultFeedback";
import { useToast } from "@/hooks/use-toast";

const CoursesExams = () => {
  const { courseId, examId } = useParams();
  const [examData, setExamData] = useState([]);
  const [examStarted, setExamStarted] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef(null);
  const questionsPerPage = 10;

  const { toast } = useToast();

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await API.get(`/exams/details/${examId}`);
        setExamData(response.data.exam);
        setTimeLeft(response.data.exam.timeLimit * 60);
      } catch (error) {
        console.error("Failed to fetch quiz metadata", error.message);
        toast({
          title: "Invalid Quiz Metadata",
          description:
            "The quiz metadata is invalid or the quiz does not exist.",
          variant: "destructive",
        });
      }
    };
    fetchExamDetails();
  }, [examId]);

  const handleStartExam = async () => {
    try {
      const response = await API.post(`/exams/${examId}/start`);

      const activityId = response.data.activity.id;

      localStorage.setItem("activityId", activityId);

      setExamStarted(true);
      toast({
        title: "Exam Started",
        description: "You can now start answering the questions.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to start exam", error.message);
      toast({
        title: "Error Starting Exam",
        description: "There was an error starting the exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  const submitExam = async ({ examId, answers, timeTaken, activityId }) => {
    try {
      const response = await API.post(`/exams/${examId}/submit`, {
        answers,
        timeTaken,
        activityId,
      });
      console.log("Exam submission response:", response.data);
      setResultData(response.data);
      toast({
        title: "Exam Submitted",
        description: "Your exam has been successfully submitted.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error in useEffect:", error.message);
      toast({
        title: "Error Submitting Exam",
        description:
          "There was an error submitting your exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  // 1. Start timer when exam starts
  useEffect(() => {
    if (examStarted && !examSubmitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [examStarted, examSubmitted]);

  // 2. Watch timeLeft and auto-submit when it hits 0
  useEffect(() => {
    if (timeLeft === 0 && examStarted && !examSubmitted) {
      if (timerRef.current) clearInterval(timerRef.current);

      toast({
        title: "Time's up!",
        description: "Your exam has been automatically submitted.",
        variant: "default",
      });

      handleSubmitExam();
    }
  }, [timeLeft, examStarted, examSubmitted]);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const questions = examData.paper?.questions || [];
  const formattedQuestions = questions.map((qItem) => {
    const q = qItem.question;
    return {
      id: q.id.toString(),
      question: q[`question_${selectedLanguage}`], // Dynamic
      options: q.options.map((opt) => ({
        id: opt.id.toString(),
        label: opt.label,
        text: opt[`text_${selectedLanguage}`], // Dynamic
      })),
    };
  });

  const totalPages = Math.ceil(formattedQuestions.length / questionsPerPage);

  // Handle answer selection for multiple choice and true/false
  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  // Handle exam submission
  const handleSubmitExam = async () => {
    if (examSubmitted) return;
    setExamSubmitted(true);
    setIsProcessing(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOptionId]) => ({
          questionId: parseInt(questionId),
          selectedOptionId: selectedOptionId
            ? parseInt(selectedOptionId)
            : null,
        })
      );

      const activityId = localStorage.getItem("activityId");

      const result = await submitExam({
        examId: examId,
        answers: formattedAnswers,
        timeTaken: examData.timeLimit * 60 - timeLeft,
        activityId: parseInt(activityId),
      });
      setShowResults(true);
      setIsProcessing(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (error) {
      console.error("Error submitting exam:", error.message);
      setIsProcessing(false);
      toast({
        title: "Error Submitting Exam",
        description:
          "There was an error submitting your exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  // TODO: Handle retake exam  setup in future
  const handleRetakeExam = () => {
    setExamStarted(true);
    setExamSubmitted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(examData.timeLimit * 60);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  };

  // Get answered questions count
  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  // Determine time warning classes
  const getTimeClass = () => {
    if (timeLeft < 300)
      return "countdown-timer text-red-500 animate-pulse blink";
    if (timeLeft < 600) return "countdown-timer text-yellow-500";
    return "countdown-timer text-green-500";
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
  };

  //   // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Processing screen
  if (isProcessing) {
    return (
      <div className="container max-w-4xl py-12">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Processing Your Exam...
            </CardTitle>
            <CardDescription className="text-center">
              Please wait while we calculate your results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Analyzing your answers...</p>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam start screen
  if (!examStarted) {
    return (
      <div className="container max-w-4xl py-12">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">{examData.title}</CardTitle>
            <CardDescription>{examData.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Timer className="h-6 w-6 text-sky-600" />
                <div>
                  <p className="font-medium">Time Limit</p>
                  <p className="text-sm text-muted-foreground">
                    {examData.timeLimit} minutes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Medal className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="font-medium">Passing Score</p>
                  <p className="text-sm text-muted-foreground">
                    {examData.passingScore}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <ListCheck className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="font-medium">Total Questions</p>
                  <p className="text-sm text-muted-foreground">
                    {examData?.paper?.questions?.length} questions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <ListTree className="h-6 w-6 text-pink-600" />
                <div>
                  <p className="font-medium">Question Type</p>
                  <p className="text-sm text-muted-foreground">MCQ only</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <LayoutDashboard className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-medium">Exam Types</p>
                  <p className="text-sm text-muted-foreground">
                    {examData?.type &&
                      examData.type
                        .toLowerCase()
                        .replace("_", " ")
                        .replace(/^./, (char) => char.toUpperCase())}{" "}
                    Test only
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Scale className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-medium">Negative Marking</p>
                  <p className="text-sm text-muted-foreground">
                    {/* {examData.negativeMarking
                      ? `- ${examData.negativeMarking} per wrong answer`
                      : "No negative marking"} */}
                    No
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <AlertTitle className="text-base font-semibold">
                Exam Instructions
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-1 text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>All questions are in MCQ format</li>
                  <li>
                    You can navigate between pages and review your answers
                  </li>
                  <li>
                    <span className="text-red-600 font-medium">
                      ⚠ The exam will auto-submit when the time runs out
                    </span>
                  </li>
                  <li>Make sure to answer all questions before submitting</li>
                  <li>
                    Once you start the exam, the timer will begin and you must
                    complete the exam within the allotted time
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
            <p className="text-sm italic text-muted-foreground text-center">
              The timer will start immediately after clicking “Start Exam”.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to={`/courses/${courseId}`}>Back to Course</Link>
            </Button>
            <Button onClick={handleStartExam}>Start Exam</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Exam results screen
  if (showResults) {
    const passed = resultData?.result.percentage >= resultData?.result.passMark;
    return (
      <div className="container max-w-4xl py-12">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Exam Results</CardTitle>
            <CardDescription>{examData.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatedResultFeedback
              passed={passed}
              score={resultData?.result.percentage}
            />

            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>
                  Detailed analysis of your performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          {" "}
                          Total Questions
                        </div>
                        <div className="text-xl font-semibold text-blue-500">
                          {resultData?.result.total}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          {" "}
                          Correct Answers
                        </div>
                        <div className="text-xl font-semibold text-green-500">
                          {resultData?.result.correct}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          {" "}
                          Incorrect Answers
                        </div>
                        <div className="text-xl font-semibold text-red-500">
                          {resultData?.result.incorrect}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          {" "}
                          Unattempted
                        </div>
                        <div className="text-xl font-semibold text-gray-500">
                          {resultData?.result.skipped}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500"> Take Time</div>
                        <div className="text-xl font-semibold text-gray-500">
                          {`${resultData?.result.timeTaken} seconds`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <CardTitle>Questions Review</CardTitle>
                  <CardDescription>
                    Review your answers and see the correct solutions
                  </CardDescription>
                </div>

                {/* Language Selection Buttons inside Card */}
                <div className="flex space-x-2">
                  <Button
                    variant={selectedLanguage === "en" ? "default" : "outline"}
                    onClick={() => setSelectedLanguage("en")}
                  >
                    English
                  </Button>
                  <Button
                    variant={selectedLanguage === "hi" ? "default" : "outline"}
                    onClick={() => setSelectedLanguage("hi")}
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
                  {resultData?.result.review.map((qa, index) => {
                    const wasAttempted = qa.attempted;
                    const isCorrect = qa.isCorrect;

                    return (
                      <AccordionItem
                        key={qa.questionId}
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
                              {selectedLanguage === "en"
                                ? qa.questionText_en
                                : qa.questionText_hi}
                            </p>

                            <div className="space-y-3">
                              {qa.options.map((option) => {
                                const isCorrectOption =
                                  option.optionId === qa.correctOptionId;
                                const isSelectedOption =
                                  option.optionId === qa.selectedOptionId;

                                return (
                                  <div
                                    key={option.optionId}
                                    className={`relative p-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                                      isCorrectOption
                                        ? "bg-green-100 border-green-500 dark:bg-green-900/10 dark:border-green-800"
                                        : isSelectedOption
                                        ? "bg-red-100 border-red-500 dark:bg-red-900/10 dark:border-red-800"
                                        : "bg-muted dark:bg-muted/30 border-border"
                                    }`}
                                  >
                                    {/* Option Text */}
                                    <span>
                                      {selectedLanguage === "en"
                                        ? option.text_en
                                        : option.text_hi}
                                      {isSelectedOption && (
                                        <span className="ml-2 italic text-muted-foreground text-xs">
                                          (You selected) ( आपका उत्तर )
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
                              <p className="text-sm font-bold text-muted-foreground italic mt-2">
                                You did not answer this question. ( उत्तर नहीं
                                दिया )
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
          <CardFooter className="flex justify-between">
            <Button asChild variant="outline">
              <Link to={`/courses/${courseId}`}>Back to Course</Link>
            </Button>
            <Button disabled onClick={handleRetakeExam}>
              Retake Exam
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{examData.title}</h1>
        {/* Language Toggle Buttons */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 h-8 px-3 text-xs"
              >
                <Globe className="h-4 w-4" />
                {{
                  en: "English",
                  hi: "हिंदी",
                  bn: "বাংলা",
                  mr: "मराठी",
                }[selectedLanguage] || "Language"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["en", "hi", "bn", "mr"].map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {
                    {
                      en: "English",
                      hi: "हिंदी",
                      bn: "বাংলা",
                      mr: "मराठी",
                    }[lang]
                  }
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className={`flex items-center gap-2 font-mono text-lg ${getTimeClass()}`}
          >
            <Clock className="mr-2 h-5 w-5 inline-block" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>
            Page {currentPage + 1} of {totalPages}
          </span>
          <span>
            {getAnsweredCount()} of {questions.length} answered
          </span>
        </div>
        <Progress
          value={(getAnsweredCount() / questions.length) * 100}
          className="h-2"
        />
      </div>

      {/* Exam Question Card */}
      <Card className="animate-fade-in mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            Questions {currentPage * questionsPerPage + 1} -{" "}
            {Math.min((currentPage + 1) * questionsPerPage, questions.length)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formattedQuestions
            .slice(
              currentPage * questionsPerPage,
              (currentPage + 1) * questionsPerPage
            )
            .map((question, index) => (
              <div key={question.id} className="p-4 mb-6 rounded-lg border">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-base">
                    Question {currentPage * questionsPerPage + index + 1}
                  </h3>
                  {answers[question.id] && (
                    <Badge variant="outline">Answered</Badge>
                  )}
                </div>
                <p className="mb-4 text-lg">{question.question}</p>

                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) =>
                    handleAnswerSelect(question.id, value)
                  }
                >
                  <div className="space-y-3">
                    {question.options?.map((opt) => (
                      <div
                        key={opt.id}
                        className={`quiz-option flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors ${
                          answers[question.id] === opt.id
                            ? "selected bg-muted"
                            : ""
                        }`}
                      >
                        <RadioGroupItem
                          value={opt.id}
                          id={`${question.id}-${opt.id}`}
                          className="mr-3"
                        />
                        <Label
                          htmlFor={`${question.id}-${opt.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          {opt.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(i)}
              className="w-10 h-10 p-0"
            >
              {i + 1}
            </Button>
          ))}
        </div>

        {currentPage < totalPages - 1 ? (
          <Button onClick={goToNextPage}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
            <DialogTrigger asChild>
              <Button>Submit Exam</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Exam</DialogTitle>
                <DialogDescription>
                  Are you sure you want to submit your exam? Once you submit the
                  exam, you cannot change your answers. Make sure to review all
                  questions before submitting.
                  <br />
                  You have answered {getAnsweredCount()} out of{" "}
                  {examData.questions.length} questions.
                  {getAnsweredCount() < examData.questions.length && (
                    <span className="block mt-2 text-yellow-600">
                      ⚠️ Warning: You have{" "}
                      {examData.questions.length - getAnsweredCount()}{" "}
                      unanswered questions.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setConfirmSubmit(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitExam}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Question Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((question, index) => {
              const isAnswered = !!answers[question.id];
              const page = Math.floor(index / questionsPerPage);
              const isCurrentPage = page === currentPage;

              let variant = "secondary";
              if (isCurrentPage) variant = "default";
              else if (isAnswered) variant = "outline";

              return (
                <Button
                  key={question.id}
                  variant={variant}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => goToPage(page)}
                >
                  {index + 1}
                </Button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span>Current Page</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-input rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary rounded"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link to={`/courses/${courseId}`}>Back to Course</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesExams;
