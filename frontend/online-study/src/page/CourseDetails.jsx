import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "@/api/axios";
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Filter,
  Globe,
  Heart,
  HelpCircle,
  Menu,
  Play,
  Share2,
  Star,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/VideoPlayer.jsx";
import EnrollButton from "@/components/EnrollButton.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { modules } from "@/data/modules";

const CourseDetails = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(null);
  const [sortOption, setSortOption] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/courses/${courseId}`, {
        params: {
          rating: ratingFilter,
          sort: sortOption,
          page: currentPage,
          limit: 5,
        },
      });
      setCourse(response.data.data);
    } catch (error) {
      toast({
        title: "Invalid Course Metadata",
        description:
          "The Course metadata is invalid or the Course does not exist.",
        variant: "destructive",
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId, ratingFilter, sortOption, currentPage]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/quizzes/course/${courseId}`);
        setQuizzes(response.data.quizzes);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseId]);

  const handleRate = (star) => setUserRating(star);
  const handleSubmitReview = async () => {
    if (userRating < 1 || comment.trim().length < 10) {
      return toast({
        title: "Incomplete Review",
        description: "Please give a rating and write at least 10 characters.",
        variant: "destructive",
      });
    }
    setLoading(true);
    setIsSubmitting(true);
    try {
      await API.post(`/courses/${courseId}/review`, {
        rating: userRating,
        comment,
      });
      setUserRating(0);
      setComment("");
      await fetchCourseDetails();
      toast({
        title: "Review Submitted",
        description: "Your review has been posted successfully. Thank you!",
      });
    } catch (err) {
      console.error("Review Submit Error", err);
      toast({
        title: "Failed to Submit Review",
        description:
          err?.response?.data?.message ||
          "Something went wrong. Try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const voteReview = async (reviewId, type) => {
    try {
      await API.post(`/courses/reviews/${reviewId}/vote`, { type });
      setCourse((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId ? { ...r, [type]: r[type] + 1 } : r
        ),
      }));
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const formatPriceINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const totalLessons =
    modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0;
  const completedLessons =
    modules?.reduce(
      (acc, module) =>
        acc + module.lessons.filter((lesson) => lesson.completed).length,
      0
    ) || 0;
  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">Failed to load course: {error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-2xl text-white">No course details available</div>
    );
  }
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <Link
              to="/courses"
              className="flex items-center text-sm font-medium text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-lg font-bold gradient-heading">
                      Course Content
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground mt-2 border-b pb-4">
                      You're making great progress! Browse your course modules,
                      track your lessons, and keep learning at your pace.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    {course.lessons?.length > 0 ? (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full space-y-2"
                      >
                        {modules.map((module) => (
                          <AccordionItem
                            key={module.id}
                            value={`module-${module.id}`}
                          >
                            <AccordionTrigger className="text-sm font-medium">
                              {module.title}
                            </AccordionTrigger>
                            <AccordionContent className="pl-2 pt-1">
                              <Progress
                                value={module.progress}
                                className="h-2 mb-2"
                              />
                              <div className="text-xs text-muted-foreground mb-2">
                                {module.duration}
                              </div>
                              <ul className="space-y-1 border-l-2 border-muted pl-3">
                                {module.lessons.map((lesson) => (
                                  <li
                                    key={lesson.id}
                                    className="text-sm flex items-center py-1"
                                  >
                                    {lesson.completed ? (
                                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full border border-muted mr-2" />
                                    )}
                                    <span
                                      className={
                                        lesson.completed ? "text-primary" : ""
                                      }
                                    >
                                      {lesson.title}
                                    </span>
                                    {lesson.isPreview && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-2 text-xs"
                                      >
                                        Preview
                                      </Badge>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-12 animate-fade-in">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold mb-2">
                          No course details found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          It looks like this course hasn’t added any modules
                          yet. Stay tuned — more content might be on the way!
                        </p>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="container relative px-4 py-8 lg:py-16">
            {/* Desktop Back Button */}
            <Link
              to="/courses"
              className="hidden lg:inline-flex items-center mb-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>

            <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Header */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {course.level}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {course?.language} English/Hindi
                    </Badge>
                    {course?.certificate && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        Certificate TODO: make true
                      </Badge>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {course.reviewStats.averageRating} (
                      {course.reviewStats.totalReviews} reviews)
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                    {course.title}
                  </h1>

                  <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration} weeks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(course?.studentsCount)}{" "}
                        students
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Updated{" "}
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Instructor Info */}
                  <Card className="border-none shadow-sm bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              course.instructor.avatarUrl || "/placeholder.svg"
                            }
                            alt={course.instructor.name}
                          />
                          <AvatarFallback>
                            {course.instructor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {course.instructor?.name
                              ? course.instructor.name
                                  .split(" ")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1).toLowerCase()
                                  )
                                  .join(" ")
                              : "Unknown Instructor"}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {/* TODO: Add the instructor students, courses, instructor rating */}
                            <span>
                              {course.instructor.students}15,420 students
                            </span>
                            <span>{course.instructor.courses}12 courses</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                              {course.instructor.rating}4.9
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Video Player - Mobile */}
                <div className="lg:hidden">
                  <VideoPlayer />
                </div>
              </div>

              {/* Sidebar - Right Side */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Video Player - Desktop */}
                  <div className="hidden lg:block">
                    <VideoPlayer />
                  </div>

                  {/* Pricing Card */}
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold">
                            {course.price && course.price > 0
                              ? formatPriceINR(course.price)
                              : "Free"}
                          </span>

                          {/* TODO: Add course originalPrice and discount */}
                          {course.originalPrice &&
                            course.originalPrice > course.price && (
                              <>
                                <span className="text-lg text-muted-foreground line-through">
                                  {formatPriceINR(course.originalPrice)}
                                </span>
                                {course.discount && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    {course.discount}% OFF
                                  </Badge>
                                )}
                              </>
                            )}
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Course Progress</span>
                            <span>{overallProgress ?? 0}%</span>
                          </div>
                          <Progress
                            value={overallProgress ?? 0}
                            className="h-2"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <EnrollButton
                            courseId={course.id}
                            courseTitle={course.title}
                            courseDetails={course}
                            className="w-full h-12 text-base font-semibold"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="h-10">
                              <Heart className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline" className="h-10">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content Tabs */}
        <section className="bg-background py-8 lg:py-16">
          <div className="container px-4">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto">
                <TabsTrigger value="content" className="py-3 text-sm">
                  Content
                </TabsTrigger>
                <TabsTrigger value="assignments" className="py-3 text-sm">
                  Assignments
                </TabsTrigger>
                <TabsTrigger value="reviews" className="py-3 text-sm">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="overview" className="py-3 text-sm">
                  Overview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Course Content</h2>
                  {totalLessons} lessons •{" "}
                  {modules.reduce(
                    (acc, m) => acc + Number.parseInt(m.duration),
                    0
                  )}{" "}
                  hours total
                </div>

                {/* TODO: Add the course content with lessons */}
                {course?.lessons?.length === 0 ? (
                  <div className="px-4 py-4 sm:px-6 sm:py-5 bg-muted/10 rounded-md border border-dashed border-muted-foreground">
                    <p className="text-sm sm:text-base text-muted-foreground italic flex items-center gap-2 flex-wrap">
                      <span role="img" aria-label="book">
                        📚
                      </span>
                      <span>
                        No course content available yet —{" "}
                        <span className="text-primary font-medium">
                          coming very soon!
                        </span>
                      </span>
                      <span role="img" aria-label="rocket">
                        🚀
                      </span>
                    </p>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                      Meanwhile, why not sharpen your skills with our{" "}
                      <span className="text-primary font-semibold">
                        Quizzes
                      </span>{" "}
                      and{" "}
                      <span className="text-primary font-semibold">Exams</span>?
                      🎯 Stay tuned — amazing content is on the way! 💡
                    </p>
                  </div>
                ) : (
                  <Accordion type="multiple" className="space-y-4">
                    {modules.map((module, index) => (
                      <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="border rounded-lg"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">
                                  {index + 1}.
                                </span>
                                <h3 className="text-lg font-semibold text-left">
                                  {module.title}
                                </h3>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge
                                variant={
                                  module.progress === 100
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {module.progress}% Complete
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {module.duration}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <Progress
                            value={module.progress}
                            className="h-2 mb-4"
                          />
                          <div className="space-y-2">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  ) : (
                                    <Play className="h-5 w-5 text-muted-foreground" />
                                  )}
                                  <span
                                    className={`text-sm ${
                                      lesson.completed ? "font-medium" : ""
                                    }`}
                                  >
                                    {lesson.title}
                                  </span>
                                  {lesson.isPreview && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground">
                                    {lesson.duration}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8"
                                  >
                                    {lesson.completed ? "Rewatch" : "Start"}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>

              <TabsContent value="assignments" className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">Course Assignments</h2>
                  <Tabs defaultValue="all" className="w-full sm:w-auto">
                    <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                      {["all", "completed", "pending", "upcoming"].map(
                        (val) => (
                          <TabsTrigger
                            key={val}
                            value={val}
                            className="text-xs sm:text-sm capitalize"
                            disabled
                          >
                            {val}
                          </TabsTrigger>
                        )
                      )}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Quizzes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    <h3 className="text-xl font-semibold">Quizzes</h3>
                  </div>
                  {quizzes.length === 0 ? (
                    <div>
                      <p>No quizzes available yet!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {quizzes.map((quiz) => (
                        <Card
                          key={quiz.id}
                          className={`border ${
                            quiz.locked ? "bg-muted/30" : "bg-card"
                          }`}
                        >
                          <CardContent className="p-5">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{quiz.title}</h4>
                                </div>
                                {quiz.completed ? (
                                  <Badge className="bg-green-500">
                                    Completed
                                  </Badge>
                                ) : quiz.locked ? (
                                  <Badge
                                    variant="outline"
                                    className="border-muted-foreground"
                                  >
                                    Locked
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="border-blue-500 text-blue-500"
                                  >
                                    Available
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                  <span>{quiz.questions.length} Questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{quiz.timeLimit} Minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    Due:{" "}
                                    {new Date(
                                      quiz.dueDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    Attempts: {quiz.attemptsLeft}/
                                    {quiz.maxAttempts}
                                  </span>
                                </div>
                              </div>

                              {quiz.completed && (
                                <div className="bg-muted/30 p-3 rounded-md">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                      Your Score
                                    </span>
                                    <span className="text-sm font-bold">
                                      {quiz.score}/
                                      {Math.round(
                                        (quiz.score / quiz.scorePercentage) *
                                          100
                                      )}{" "}
                                      ({quiz.scorePercentage}%)
                                    </span>
                                  </div>

                                  <Progress
                                    value={quiz.scorePercentage}
                                    className="h-2 mt-2 relative overflow-hidden bg-muted"
                                  >
                                    <div
                                      className="absolute top-0 left-0 h-full transition-all duration-300"
                                      style={{
                                        width: `${quiz.scorePercentage}%`,
                                        backgroundColor:
                                          quiz.scorePercentage >=
                                          quiz.passingScore
                                            ? "#22c55e"
                                            : "#f59e0b",
                                      }}
                                    />
                                  </Progress>
                                </div>
                              )}

                              <div className="flex justify-end">
                                {quiz.locked ? (
                                  <Button
                                    variant="outline"
                                    disabled
                                    className="text-xs sm:text-sm"
                                  >
                                    Unlock Later
                                  </Button>
                                ) : quiz.completed ? (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      className="text-xs sm:text-sm"
                                      disabled
                                    >
                                      View Results
                                    </Button>
                                    {quiz.attemptsLeft > 0 && (
                                      <Link
                                        to={`/courses/${courseId}/quiz/${quiz.id}`}
                                      >
                                        <Button
                                          variant="default"
                                          className="text-xs sm:text-sm"
                                        >
                                          Retake Quiz
                                        </Button>
                                      </Link>
                                    )}
                                  </div>
                                ) : (
                                  <Link
                                    to={`/courses/${courseId}/quiz/${quiz.id}`}
                                  >
                                    <Button
                                      variant="default"
                                      className="text-xs sm:text-sm"
                                    >
                                      Start Quiz
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Exams */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    <h3 className="text-xl font-semibold">Exams</h3>
                  </div>
                  {course.exams.length === 0 ? (
                    <div>
                      <p>No exams available yet!</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {course.exams.map((exam) => (
                        <Card
                          key={exam.id}
                          className={`border ${
                            exam.locked ? "bg-muted/30" : "bg-card"
                          }`}
                        >
                          <CardContent className="p-5">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{exam.title}</h4>
                                </div>
                                {exam.completed ? (
                                  <Badge className="bg-green-500">
                                    Completed
                                  </Badge>
                                ) : exam.locked ? (
                                  <Badge
                                    variant="outline"
                                    className="border-muted-foreground"
                                  >
                                    Locked
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="border-purple-500 text-purple-500"
                                  >
                                    Available
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {exam.paper.questions.length} Questions
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{exam.timeLimit} Minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />

                                  <span>
                                    Date:{" "}
                                    {new Date(
                                      exam.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />

                                  <span>Unlimited attempts</span>
                                </div>
                              </div>

                              <div className="flex justify-end">
                                {exam.locked ? (
                                  <Button
                                    variant="outline"
                                    disabled
                                    className="text-xs sm:text-sm"
                                  >
                                    Unlock Later
                                  </Button>
                                ) : exam.completed ? (
                                  <Button
                                    variant="outline"
                                    className="text-xs sm:text-sm"
                                    disabled
                                  >
                                    View Results
                                  </Button>
                                ) : (
                                  <Link
                                    to={`/courses/${courseId}/exam/${exam.id}`}
                                  >
                                    <Button
                                      variant="default"
                                      className="text-xs sm:text-sm"
                                    >
                                      Start Exam
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-8">
                {/* Reviews Summary */}
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="md:col-span-1 space-y-4">
                    <h2 className="text-2xl font-bold">Student Reviews</h2>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-bold">
                        {course.reviewStats.averageRating}
                      </div>
                      <div className="space-y-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(course.reviewStats.averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {course.reviewStats.totalReviews} reviews
                        </div>
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                      {course.reviewStats.breakdown.map((item) => (
                        <div
                          key={item.rating}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center w-16">
                            <span className="text-sm">{item.rating} stars</span>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-12 text-right text-sm text-muted-foreground">
                            {item.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Write Review */}
                    <Card className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Write a Review
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Your Rating</div>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-6 w-6 ${
                                  i < userRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                                onClick={() => handleRate(i + 1)}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Your Review</div>
                          <Textarea
                            placeholder="Share your experience"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </div>
                        <Button
                          onClick={handleSubmitReview}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting…" : "Submit Review"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    {/* Review Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-lg font-medium">
                        All Reviews ({course.reviewStats.totalReviews})
                      </div>
                      <div className="flex gap-2">
                        <DropdownMenu onOpenChange={setIsRatingOpen}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm"
                            >
                              <Filter className="h-4 w-4 mr-2" />
                              {ratingFilter
                                ? `${ratingFilter}★ Only`
                                : "All Ratings"}
                              {isRatingOpen ? (
                                <ChevronUp className="h-4 w-4 ml-2" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-2" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setRatingFilter(null)}
                            >
                              All Ratings
                            </DropdownMenuItem>
                            {[5, 4, 3, 2, 1].map((s) => (
                              <DropdownMenuItem
                                key={s}
                                onClick={() => setRatingFilter(s)}
                              >
                                {s} Star{s > 1 && "s"} Only
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu onOpenChange={setIsSortOpen}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm"
                            >
                              Sort By
                              {isSortOpen ? (
                                <ChevronUp className="h-4 w-4 ml-2" />
                              ) : (
                                <ChevronDown className="h-4 w-4 ml-2" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSortOption("recent")}
                            >
                              Newest
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSortOption("highest")}
                            >
                              Highest Rated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSortOption("lowest")}
                            >
                              Lowest Rated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSortOption("helpful")}
                            >
                              Most Helpful
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Regular Reviews */}
                    {/* No Reviews Message */}
                    {course.reviews.length === 0 ? (
                      <div className="mt-4 text-sm italic text-muted-foreground">
                        No reviews found matching the selected filter.
                      </div>
                    ) : (
                      course.reviews.map((r) => (
                        <Card
                          key={r.id}
                          className={`border ${
                            r.featured ? "bg-muted/20" : ""
                          }`}
                        >
                          <CardContent className="p-5">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={r.user.avatar || "/placeholder.svg"}
                                    alt={r.user.name}
                                  />
                                  <AvatarFallback>
                                    {r.user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {r.user.name}
                                    </span>
                                    {r.user.isVerified && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Verified Learner
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < r.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span>
                                      <span>
                                        {new Date(r.date).toLocaleDateString()}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {r.comment}
                                </p>
                              </div>

                              <div className="flex items-center justify-end gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => voteReview(r.id, "helpful")}
                                  >
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    Helpful ({r.helpful})
                                  </Button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() =>
                                      voteReview(r.id, "unhelpful")
                                    }
                                  >
                                    <ThumbsDown className="h-4 w-4 mr-1" />
                                    Not Helpful ({r.unhelpful})
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}

                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        >
                          Previous
                        </Button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className={
                              currentPage === i + 1
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="overview" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Master reasoning and aptitude concepts asked in SSC,
                        Banking & Railways exams.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Learn General Knowledge, Current Affairs & Static GK
                        with updated content.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Practice mock tests & previous year papers in real
                        exam-like format.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Track your exam performance with smart analytics and
                        score reports.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Access topic-wise assignments, quizzes & unlimited exam
                        attempts.
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Learn at your own pace with expert-created courses for
                        UPSC, SSC, Banking & more.
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span>
                        Basic understanding of school-level subjects (Maths,
                        English, GK).
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span>
                        Access to a smartphone or computer with internet
                        connectivity.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span>
                        Willingness to prepare consistently for competitive
                        exams.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span>
                        Familiarity with basic computer operations (typing,
                        navigation, etc.).
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                      <span>
                        Motivation to crack exams like SSC, Banking, Railways,
                        UPSC, etc.
                      </span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    📘 Course Description
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      This course is designed for students preparing for various
                      government job exams like SSC, Banking, Railways,
                      Teaching, and State PSCs. It covers everything from
                      foundational concepts to advanced problem-solving
                      strategies.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      💡 Learn at your own pace, track your progress, and get
                      exam-ready with confidence. Our mission is to help you
                      crack your target exam and build a stable future.
                    </p>

                    <p className="text-muted-foreground leading-relaxed mt-4">
                      🚀 Join thousands of aspirants on the same path — and let
                      your preparation begin with the right guidance and tools!
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </>
  );
};

export default CourseDetails;
