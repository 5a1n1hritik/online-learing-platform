import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Save,
  FileText,
  ChevronRight,
  ChevronLeft,
  Globe,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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

const CoursesExams = () => {
  const { courseId, examId } = useParams();
  const [examData, setExamData] = useState([]);
  const [examStarted, setExamStarted] = useState(false);
  //   const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef(null);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await API.get(`/exams/details/${examId}`);
        console.log("Exam details fetched successfully", response.data.exam);
        setExamData(response.data.exam);
        setTimeLeft(response.data.exam.timeLimit * 60); // Convert minutes to seconds
      } catch (error) {
        console.error("Failed to fetch quiz metadata", error.message);
      }
    };
    fetchExamDetails();
  }, [examId]);

  // Start timer when exam starts
  useEffect(() => {
    if (examStarted && !examSubmitted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [examStarted, examSubmitted]);

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

  const allAnswered = Object.keys(answers).length === formattedQuestions.length;

  const totalPages = Math.ceil(formattedQuestions.length / questionsPerPage);
  const currentQuestion = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  // Handle answer selection for multiple choice and true/false
  const handleAnswerSelect = (questionId, answerId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  // Calculate score for automatically graded questions
  const calculateScore = () => {
    let correctAnswers = 0;
    let totalQuestions = formattedQuestions.length;

    formattedQuestions.forEach((q) => {
      const selected = answers[q.id];
      const correct = q.options.find((opt) => opt.isCorrect); // requires isCorrect from backend
      if (selected === correct?.id) {
        correctAnswers++;
      }
    });

    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  // Handle exam submission
  const handleSubmitExam = async () => {
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setExamSubmitted(true);
    setShowResults(true);
    setIsProcessing(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Get answered questions count
  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  // Determine time warning classes
  const getTimeClass = () => {
    if (timeLeft < 300)
      return "countdown-timer danger text-red-500 animate-pulse blink";
    if (timeLeft < 600) return "countdown-timer warning text-yellow-500";
    return "countdown-timer text-green-500";
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
  };

  const handleNextQuestion = () => {
    if (currentQuestions < formattedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  const handlePrevQuestion = () => {
    if (currentQuestions > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
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

  function handleConfirmSubmit() {
    // Submit logic here
    console.log("Submitted answers:", answers);
    setConfirmSubmit(false);
  }

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
                <Clock className="h-6 w-6 text-blue-500" />
                {/* <span>Time Limit: {examData.timeLimit} minutes</span> */}
                <div>
                  <p className="font-medium">Time Limit</p>
                  <p className="text-sm text-muted-foreground">
                    {examData.timeLimit} minutes
                  </p>
                </div>
              </div>
              {/* <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                <span>Passing Score: {examData.passingScore}%</span>
              </div> */}
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium">Passing Score</p>
                  <p className="text-sm text-muted-foreground">
                    {examData.passingScore}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <HelpCircle className="h-6 w-6 text-purple-500" />
                <div>
                  <p className="font-medium">Total Questions</p>
                  <p className="text-sm text-muted-foreground">
                    {examData?.paper?.questions?.length} questions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <Save className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="font-medium">Question Type</p>
                  <p className="text-sm text-muted-foreground">
                    True/False only
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                <FileText className="h-6 w-6 text-orange-500" />
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
              {/* <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span>
                  Total Questions: {examData?.paper?.questions?.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span>
                  Exam Types:{" "}
                  {examData?.type &&
                    examData.type
                      .toLowerCase()
                      .replace("_", " ")
                      .replace(/^./, (char) => char.toUpperCase())}{" "}
                  Test
                </span>
              </div> */}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Exam Instructions</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>• All questions are True/False format</p>
                <p>• You can navigate between pages and review your answers</p>
                <p>• The exam will auto-submit when time runs out</p>
                <p>• Make sure to answer all questions before submitting</p>
                <p>
                  • Once you start the exam, the timer will begin. You must
                  complete
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to={`/courses/${courseId}`}>Back to Course</Link>
            </Button>
            <Button onClick={() => setExamStarted(true)}>Start Exam</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Exam results screen
  // if (showResults) {
  //   const passed = score >= examData.passingScore;
  //   return (
  //     <div className="container max-w-4xl py-12">
  //       <Card className="animate-fade-in">
  //         <CardHeader>
  //           <CardTitle className="text-2xl">Exam Results</CardTitle>
  //           <CardDescription>{examData.title}</CardDescription>
  //         </CardHeader>
  //         <CardContent className="space-y-6">
  //           <div className="flex flex-col items-center justify-center py-6">
  //             <div
  //               className={`text-5xl font-bold mb-2 ${
  //                 passed ? "text-green-500" : "text-red-500"
  //               }`}
  //             >
  //               {score}%
  //             </div>
  //             <p className="text-muted-foreground">
  //               Your score on automatically graded questions
  //             </p>
  //             <div className="mt-4">
  //               {passed ? (
  //                 <div className="flex items-center gap-2 text-green-500">
  //                   <CheckCircle className="h-6 w-6" />
  //                   <span className="font-medium">You passed!</span>
  //                 </div>
  //               ) : (
  //                 <div className="flex items-center gap-2 text-red-500">
  //                   <AlertCircle className="h-6 w-6" />
  //                   <span className="font-medium">
  //                     You did not pass. Try again!
  //                   </span>
  //                 </div>
  //               )}
  //             </div>
  //           </div>

  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Score Breakdown</CardTitle>
  //               <CardDescription>
  //                 Detailed analysis of your performance
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  //                 <div className="text-center p-4 border rounded-lg">
  //                   <div className="text-2xl font-bold text-blue-500">
  //                     {questions.length}
  //                   </div>
  //                   <div className="text-sm text-muted-foreground">
  //                     Total Questions
  //                   </div>
  //                 </div>
  //                 <div className="text-center p-4 border rounded-lg">
  //                   <div className="text-2xl font-bold text-green-500">
  //                     {
  //                       questions.filter(
  //                         (ua) => ua.selectedOptionId === ua.correctOptionId
  //                       ).length
  //                     }
  //                   </div>
  //                   <div className="text-sm text-muted-foreground">
  //                     Correct Answers
  //                   </div>
  //                 </div>
  //                 <div className="text-center p-4 border rounded-lg">
  //                   <div className="text-2xl font-bold text-red-500">
  //                     {
  //                       questions.filter(
  //                         (ua) => ua.selectedOptionId !== ua.correctOptionId
  //                       ).length
  //                     }
  //                   </div>
  //                   <div className="text-sm text-muted-foreground">
  //                     Incorrect Answers
  //                   </div>
  //                 </div>
  //                 <div className="text-center p-4 border rounded-lg">
  //                   <div className="text-2xl font-bold text-gray-500">
  //                     {/* {unattemptedQuestions} */}TODO:not set
  //                   </div>
  //                   <div className="text-sm text-muted-foreground">
  //                     Unattempted
  //                   </div>
  //                 </div>
  //                 <div className="text-center p-4 border rounded-lg">
  //                   <div className="text-2xl font-bold text-gray-500">
  //                     {examData.timeTaken} seconds
  //                   </div>
  //                   <div className="text-sm text-muted-foreground">
  //                     Take Time
  //                   </div>
  //                 </div>
  //               </div>
  //             </CardContent>
  //           </Card>

  //           <Separator />

  //           <div className="space-y-4">
  //             <h3 className="text-lg font-medium">Question Review</h3>
  //             <Card>
  //               <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
  //                 <CardTitle>Question Review</CardTitle>
  //                 <CardDescription>
  //                   Review your answers and see the correct solutions
  //                 </CardDescription>
  //                 {/* <div className=" space-x-2">
  //                 <Button
  //                   variant={language === "en" ? "default" : "outline"}
  //                   onClick={() => setLanguage("en")}
  //                 >
  //                   English
  //                 </Button>
  //                 <Button
  //                   variant={language === "hi" ? "default" : "outline"}
  //                   onClick={() => setLanguage("hi")}
  //                 >
  //                   हिन्दी
  //                 </Button>
  //               </div> */}
  //               </CardHeader>

  //               <CardContent>
  //                 <Accordion
  //                   type="single"
  //                   collapsible={true}
  //                   className="w-full space-y-2"
  //                 >
  //                   {questions.map((ua, index) => {
  //                     const isCorrect =
  //                       ua.selectedOptionId === ua.correctOptionId;
  //                     const wasAttempted = ua.selectedOptionId !== null;

  //                     return (
  //                       <AccordionItem
  //                         key={ua.questionId}
  //                         value={`question-${index}`}
  //                       >
  //                         <AccordionTrigger className="text-left">
  //                           <div className="flex items-center gap-3 w-full">
  //                             <div className="flex items-center gap-2">
  //                               <span className="font-medium">
  //                                 Question {index + 1}
  //                               </span>
  //                               {wasAttempted ? (
  //                                 isCorrect ? (
  //                                   <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
  //                                     <CheckCircle className="h-3 w-3 mr-1" />
  //                                     Correct
  //                                   </Badge>
  //                                 ) : (
  //                                   <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
  //                                     <AlertCircle className="h-3 w-3 mr-1" />
  //                                     Incorrect
  //                                   </Badge>
  //                                 )
  //                               ) : (
  //                                 <Badge variant="secondary">
  //                                   <HelpCircle className="h-3 w-3 mr-1" />
  //                                   Unattempted
  //                                 </Badge>
  //                               )}
  //                             </div>
  //                           </div>
  //                         </AccordionTrigger>

  //                         <AccordionContent>
  //                           <div className="space-y-4 pt-2">
  //                             <p className="font-medium text-base md:text-lg">
  //                               {language === "en"
  //                                 ? ua.questionText_en
  //                                 : ua.questionText_hi}
  //                             </p>

  //                             <div className="space-y-3">
  //                               {ua.allOptions.map((option) => {
  //                                 const isCorrectOption =
  //                                   option.id === ua.correctOptionId;
  //                                 const isSelectedOption =
  //                                   option.id === ua.selectedOptionId;

  //                                 return (
  //                                   <div
  //                                     key={option.id}
  //                                     className={`relative p-3 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
  //                                       isCorrectOption
  //                                         ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
  //                                         : isSelectedOption
  //                                         ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
  //                                         : "bg-muted dark:bg-muted/30 border-border"
  //                                     }`}
  //                                   >
  //                                     {/* Option Text */}
  //                                     <span>
  //                                       {language === "en"
  //                                         ? option.text_en
  //                                         : option.text_hi}
  //                                       {isSelectedOption && (
  //                                         <span className="ml-2 italic text-muted-foreground text-xs">
  //                                           (You selected)
  //                                         </span>
  //                                       )}
  //                                     </span>

  //                                     {/* Icons */}
  //                                     <div className="flex-shrink-0 pt-1 ml-auto">
  //                                       {isCorrectOption && (
  //                                         <CheckCircle className="h-4 w-4 text-green-500" />
  //                                       )}
  //                                       {isSelectedOption &&
  //                                         !isCorrectOption && (
  //                                           <XCircle className="h-4 w-4 text-red-500" />
  //                                         )}
  //                                     </div>
  //                                   </div>
  //                                 );
  //                               })}
  //                             </div>

  //                             {/* If Unattempted */}
  //                             {!wasAttempted && (
  //                               <p className="text-sm text-muted-foreground italic mt-2">
  //                                 You did not answer this question.
  //                               </p>
  //                             )}
  //                           </div>
  //                         </AccordionContent>
  //                       </AccordionItem>
  //                     );
  //                   })}
  //                 </Accordion>
  //               </CardContent>
  //             </Card>
  //           </div>
  //         </CardContent>
  //         <CardFooter className="flex justify-between">
  //           <Button
  //             variant="outline"
  //             onClick={() => router.push(`/courses/${params.id}`)}
  //           >
  //             Back to Course
  //           </Button>
  //           <Button
  //             onClick={() => {
  //               setExamStarted(false);
  //               setExamSubmitted(false);
  //               setShowResults(false);
  //               setCurrentQuestion(0);
  //               setAnswers({});
  //               setTimeLeft(examData.timeLimit * 60);
  //             }}
  //           >
  //             Retake Exam
  //           </Button>
  //         </CardFooter>
  //       </Card>
  //     </div>
  //   );
  // }

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
                {selectedLanguage === "en"
                  ? "English"
                  : selectedLanguage === "hi"
                  ? "हिंदी"
                  : "Language"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("hi")}>
                हिंदी
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("bn")}>
                বাংলা
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("mr")}>
                मराठी
              </DropdownMenuItem>
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
      {/* Progress */}
      {/* <div className="mb-6">
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
      </div> */}
      {/* Progress */}
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
                  Are you sure you want to submit your exam? You have answered{" "}
                  {getAnsweredCount()} out of {examData.questions.length}{" "}
                  questions.
                  {getAnsweredCount() < examData.questions.length && (
                    <span className="block mt-2 text-yellow-600">
                      Warning: You have{" "}
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

export default CoursesExams;
