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
  ChevronDown,
  Menu,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const LANGUAGES = {
  en: "English",
  hi: "हिंदी",
};

const CoursesExams = () => {
  const { examId } = useParams();
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
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
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
      const checkResponse = await API.get(`/exams/${examId}/check-attempt`);
      const { hasOngoingAttempt } = checkResponse.data;

      if (hasOngoingAttempt) {
        setShowResumeDialog(true);
      } else {
        await startExam(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check previous attempt.",
        variant: "destructive",
      });
    }
  };

  const startExam = async (resume) => {
    setResumeLoading(true);
    try {
      const response = await API.post(
        `/exams/${examId}/start?resume=${resume}`
      );

      const activityId = response.data.activity.id;
      localStorage.setItem("activityId", activityId);
      setExamStarted(true);

      toast({
        title: resume ? "Exam Resumed" : "New Exam Started",
        description: resume
          ? "Resumed your previous exam attempt."
          : "You can now start answering the questions.",
        variant: "success",
      });

      setShowResumeDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setResumeLoading(false);
    }
  };

  const submitExam = async ({ examId, answers, timeTaken, activityId }) => {
    try {
      const response = await API.post(`/exams/${examId}/submit`, {
        answers,
        timeTaken,
        activityId,
      });
      setResultData(response.data);
      toast({
        title: "Exam Submitted",
        description: "Your exam has been successfully submitted.",
        variant: "success",
      });
    } catch (error) {
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
      question: q[`question_${selectedLanguage}`],
      options: q.options.map((opt) => ({
        id: opt.id.toString(),
        label: opt.label,
        text: opt[`text_${selectedLanguage}`],
      })),
    };
  });

  const totalPages = Math.ceil(formattedQuestions.length / questionsPerPage);

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

  // Navigation functions
  // Utility to generate dynamic pagination with ellipsis
  const generatePagination = (currentPage, totalPages) => {
    const pages = [];

    if (totalPages <= 3) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);

      if (currentPage > 2) pages.push("dots-start");

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push("dots-end");

      pages.push(totalPages - 1);
    }

    return pages;
  };
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
      <>
        <div className="container max-w-4xl py-8 px-4 sm:px-6">
          <Card className="animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{examData.title}</CardTitle>
              <CardDescription>{examData.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
                      {examData.negativeMarking
                        ? `- ${examData.negativeMarking} per wrong answer`
                        : "No negative marking"}
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
                The timer will start immediately after clicking “Continue Exam”.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to={`/globalExams`}>Go to Exams</Link>
              </Button>
              <Button onClick={handleStartExam} className="w-full sm:w-auto">
                Continue Exam
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* 🔹 Resume Confirmation Dialog */}
        <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
          <DialogContent className="w-full max-w-[90vw] sm:max-w-md p-4 sm:p-6 rounded-lg">
            <DialogHeader className="text-center sm:text-left">
              <DialogTitle className="text-lg sm:text-xl font-semibold">
                Resume Previous Attempt?
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-2 space-y-2">
                You already have an unfinished attempt for this exam. Would you
                like to resume it or start a new one?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => startExam(false)}
                disabled={resumeLoading}
                className="w-full sm:w-auto"
              >
                Start new one
              </Button>
              <Button
                onClick={() => startExam(true)}
                disabled={resumeLoading}
                className="w-full sm:w-auto"
              >
                Continue old one
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
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
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Questions Review
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Review your answers and see the correct solutions
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-32 justify-between">
                      {selectedLanguage === "en" ? "English" : "हिन्दी"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("en")}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedLanguage("hi")}>
                      हिन्दी
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                                          {selectedLanguage === "en"
                                            ? "(You selected)"
                                            : "(आपका उत्तर)"}
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
                                {selectedLanguage === "en"
                                  ? "Looks like you missed this one — no answer was selected."
                                  : "लगता है आपने यह प्रश्न छोड़ दिया — कोई उत्तर नहीं चुना गया।"}
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
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to={`/globalExams`}>Back to Exams</Link>
            </Button>
            <Button
              disabled
              onClick={handleRetakeExam}
              className="w-full sm:w-auto"
            >
              Retake Exam
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{examData.title}</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 h-8 px-3 text-xs"
              >
                <Globe className="h-4 w-4" />
                {LANGUAGES[selectedLanguage] || "Language"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(LANGUAGES).map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {LANGUAGES[lang]}
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

      {/* Layout Split */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="flex-1">
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

            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden flex justify-center w-full mt-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className=" animate-fade-in w-full py-2 px-4 text-sm"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Menu className="h-5 w-5" />
                    Question Overview
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80vw] max-w-sm">
                  <SheetHeader>
                    <SheetTitle className="text-lg font-bold gradient-heading">
                      Question Overview
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground mt-2 border-b pb-4">
                      Review your answers and navigate through the questions
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid grid-cols-5 gap-4 mt-8">
                    {questions.map((question, index) => {
                      const isAnswered = !!answers[question.id];
                      const page = Math.floor(index / questionsPerPage);
                      const isCurrentPage = page === currentPage;

                      let bgColor = isAnswered
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-black";
                      let borderRing = isCurrentPage
                        ? "ring-2 ring-blue-600"
                        : "";

                      return (
                        <button
                          key={question.id}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded text-sm font-semibold ${bgColor} ${borderRing} hover:opacity-90 transition`}
                          aria-label={`Go to question ${index + 1}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-3 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500" />
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-300 border" />
                      <span>Unanswered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-blue-600" />
                      <span>Current Page</span>
                    </div>
                  </div>

                  <SheetFooter className="border-t pt-2 mt-8">
                    <div className=" mt-4">
                      <Button asChild className="w-full">
                        <Link to="/globalExams">Back to Exams</Link>
                      </Button>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* exam card */}
          <Card className="animate-fade-in mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                Questions {currentPage * questionsPerPage + 1} -{" "}
                {Math.min(
                  (currentPage + 1) * questionsPerPage,
                  questions.length
                )}
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
                      name={`question-${question.id}`}
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

          {/* Navigation */}
          <div className="flex flex-row justify-between items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="px-3 h-10"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Prev
            </Button>

            {/* Pagination Numbers */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {generatePagination(currentPage, totalPages).map((page, index) =>
                typeof page === "string" ? (
                  <span key={index} className="px-1 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`relative px-2 py-1 rounded-md text-sm font-medium transition-all ${
                      currentPage === page
                        ? "text-accent-foreground"
                        : "text-muted-foreground hover:text-accent-foreground"
                    }`}
                  >
                    {page + 1}
                    {currentPage === page && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                    )}
                  </button>
                )
              )}
            </div>

            <span className="text-sm font-medium sm:hidden">
              Page {currentPage + 1} of {totalPages}
            </span>

            {currentPage < totalPages - 1 ? (
              <Button
                variant="ghost"
                onClick={goToNextPage}
                className="px-3 h-10"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
                <DialogTrigger asChild>
                  <Button className="px-3 h-10">Submit Exam</Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-[90vw] sm:max-w-md p-4 sm:p-6 rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-center font-bold text-2xl sm:text-left">
                      Submit Exam
                    </DialogTitle>
                    <DialogDescription asChild>
                      <div className="space-y-3 text-sm text-muted-foreground mt-2">
                        <p>
                          Are you sure you want to submit your exam? Once
                          submitted, you can't change your answers.
                        </p>
                        <p>
                          You have answered {getAnsweredCount()} out of{" "}
                          {examData?.paper?.questions?.length ?? 0} questions.
                        </p>
                        {examData?.paper?.questions &&
                          getAnsweredCount() <
                            examData.paper.questions.length && (
                            <p className="text-yellow-600 font-medium">
                              ⚠️ Warning: You have{" "}
                              {examData.paper.questions.length -
                                getAnsweredCount()}{" "}
                              unanswered questions.
                            </p>
                          )}
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmSubmit(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitExam}
                      disabled={isProcessing}
                      className="w-full sm:w-auto"
                    >
                      {isProcessing ? "Submitting..." : "Submit"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Right Panel (Sidebar for mobile) */}
        <div className="hidden lg:block w-full lg:w-[300px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                  const isAnswered = !!answers[question.id];
                  const page = Math.floor(index / questionsPerPage);
                  const isCurrentPage = page === currentPage;

                  let bgColor = isAnswered
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-black";
                  let borderRing = isCurrentPage ? "ring-2 ring-blue-600" : "";

                  return (
                    <button
                      key={question.id}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded text-sm font-semibold ${bgColor} ${borderRing} hover:opacity-90 transition`}
                      aria-label={`Go to question ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-300 border" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-600" />
                  <span>Current Page</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursesExams;
