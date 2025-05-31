import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "@/api/axios";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/VideoPlayer.jsx";
import EnrollButton from "@/components/EnrollButton.jsx";

const courseDetails = {
  id: "1",
  title: "Web Development Fundamentals",
  description:
    "Learn the core concepts of HTML, CSS, and JavaScript to build modern websites from scratch. This comprehensive course will take you from a complete beginner to being able to create your own responsive websites.",
  instructor: {
    name: "Sarah Johnson",
    bio: "Senior Web Developer with over 10 years of experience. Previously worked at Google and Facebook.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  level: "Beginner",
  duration: "8 weeks",
  rating: 4.8,
  students: 1245,
  image: "/placeholder.svg?height=400&width=800",
  price: "$49.99",
  isFree: false,
  modules: [
    {
      id: "m1",
      title: "Introduction to HTML",
      progress: 100,
      lessons: [
        { id: "l1", title: "HTML Basics", duration: "15 min", isPreview: true, completed: true },
        { id: "l2", title: "HTML Elements & Attributes", duration: "20 min", isPreview: false, completed: true },
        { id: "l3", title: "HTML Forms", duration: "25 min", isPreview: false, completed: true },
      ],
    },
    {
      id: "m2",
      title: "CSS Fundamentals",
      progress: 66,
      lessons: [
        { id: "l4", title: "CSS Syntax", duration: "18 min", isPreview: false, completed: true },
        { id: "l5", title: "CSS Selectors", duration: "22 min", isPreview: false, completed: true },
        { id: "l6", title: "CSS Box Model", duration: "30 min", isPreview: false, completed: false },
      ],
    },
    {
      id: "m3",
      title: "JavaScript Basics",
      progress: 0,
      lessons: [
        { id: "l7", title: "JavaScript Variables", duration: "20 min", isPreview: false, completed: false },
        { id: "l8", title: "JavaScript Functions", duration: "25 min", isPreview: false, completed: false },
        { id: "l9", title: "DOM Manipulation", duration: "35 min", isPreview: false, completed: false },
      ],
    },
  ],
  quizzes: [
    {
      id: "quiz-1",
      title: "HTML & CSS Fundamentals Quiz",
      questions: 5,
      timeLimit: 15,
      completed: false,
    },
    {
      id: "quiz-2",
      title: "JavaScript Basics Quiz",
      questions: 10,
      timeLimit: 20,
      completed: false,
    },
  ],
  exams: [
    {
      id: "exam-1",
      title: "Web Development Final Exam",
      questions: 20,
      timeLimit: 60,
      completed: false,
    },
  ],
  whatYouWillLearn: [
    "Build responsive websites using HTML, CSS, and JavaScript",
    "Understand core web development concepts",
    "Create interactive user interfaces",
    "Implement modern design principles",
    "Deploy websites to production",
  ],
  requirements: [
    "No prior programming experience required",
    "Basic computer skills",
    "A computer with internet access",
  ],
}

const CourseDetails = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [exams, setExams] = useState([]);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await API.get(`/courses/${courseId}`);
        setCourse(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await API.get(`/quizzes/course/${courseId}`);
        setQuizzes(response.data.quiz);
        console.log(response.data.quiz);
      } catch (error) {
        setQuizError(error.message);
      } finally {
        setQuizLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseId]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await API.get(`/exams/courses/${courseId}/exams`);
        setExams(response.data.exams);
        console.log(response.data.exams);
      } catch (error) {
        setQuizError(error.message);
      } finally {
        setQuizLoading(false);
      }
    };
    fetchExams();
  }, [courseId]);

  const formatPriceINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price || 999);
  };

  const totalLessons =
    course?.modules?.reduce((acc, module) => acc + module.lessons.length, 0) ||
    0;
  const completedLessons =
    course?.modules?.reduce(
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
    <div className="flex flex-col min-h-screen">
      {/* Course Header */}
      <section className="w-full py-6 md:py-12 lg:py-16 animated-bg relative overflow-hidden">
        <div
          className="blob opacity-30 md:opacity-50"
          style={{ top: "30%", left: "20%", width: "250px", height: "250px" }}
        ></div>
        <div
          className="blob opacity-30 md:opacity-50"
          style={{
            top: "60%",
            left: "70%",
            width: "250px",
            height: "250px",
            animationDelay: "-5s",
          }}
        ></div>
        <div className="container px-4 md:px-6 relative">
          <Link
            to="/courses"
            className="hidden lg:inline-flex items-center mb-4 text-sm font-medium text-primary animate-fade-in"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Courses
          </Link>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-secondary/50 animate-pulse-soft"
                  >
                    {course.level}
                  </Badge>
                  <div className="flex items-center text-sm">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {course.rating} ({course.studentsCount.toLocaleString()}{" "}
                    students)
                  </div>
                  {course.isFree && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Free
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter gradient-heading">
                  {course.title}
                </h1>
                <p
                  className="text-muted-foreground text-sm md:text-base animate-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  {course.description}
                </p>
              </div>
              <div
                className="flex flex-wrap items-center gap-4 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={
                      course.instructor?.avatar ||
                      `https://avatar.vercel.sh/${
                        course.instructor?.name || "Instructor"
                      }`
                    }
                    alt={course.instructor.name}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-medium">Instructor</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
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
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium">Duration</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {course.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium">Enrolled</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {course?.studentsCount?.toLocaleString()} students
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col gap-4 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="overflow-hidden rounded-lg shadow-xl">
                <VideoPlayer videoSrc={course.previewVideoUrl} />
              </div>
              <Card className="border-none shadow-lg">
                <CardContent className="p-6 sm:p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold">
                        {formatPriceINR(course.price)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span>Course Progress</span>
                        <span>{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-2" />
                    </div>
                    <EnrollButton
                      courseId={course.id}
                      courseTitle={course.title}
                      courseDetails={course.description}
                      className="w-full rounded-full btn-pulse"
                    />
                    {/* <Button size="lg" className="w-full rounded-full">
                      Continue Learning
                    </Button> */}
                    <Link to="/my-courses">
                      <Button variant="outline" className="w-full rounded-full">
                        View My Courses
                      </Button>
                    </Link>
                    <p className="text-center text-xs sm:text-sm text-muted-foreground">
                      30-Day Money-Back Guarantee
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span className="text-xs sm:text-sm">
                          Full lifetime access
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span className="text-xs sm:text-sm">
                          Access on mobile and TV
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <span className="text-xs sm:text-sm">
                          Certificate of completion
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="w-full py-6 md:py-12 lg:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8 h-auto">
              <TabsTrigger
                value="content"
                className="py-2 sm:py-3 text-xs sm:text-sm"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="py-2 sm:py-3 text-xs sm:text-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="assessments"
                className="py-2 sm:py-3 text-xs sm:text-sm"
              >
                Assessments
              </TabsTrigger>
              <TabsTrigger
                value="instructor"
                className="py-2 sm:py-3 text-xs sm:text-sm"
              >
                Instructor
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold gradient-heading">
                  Course Content
                </h2>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {totalLessons} lessons • {course.duration}
                </div>
              </div>
              <div className="space-y-4">
                {courseDetails?.modules.map((module, index) => (
                  <Card
                    key={module.id}
                    className="overflow-hidden border-none shadow-md animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-0">
                      <div className="border-b p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                          <h3 className="text-base sm:text-lg font-bold">
                            {module.title}
                          </h3>
                          <Badge
                            variant={
                              module.progress === 100 ? "default" : "secondary"
                            }
                            className="w-fit"
                          >
                            {module.progress}% Complete
                          </Badge>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                      <div className="space-y-1 p-1">
                        {module?.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 hover:bg-muted/50 rounded-md transition-colors ${
                              lesson.completed ? "bg-primary/5" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2 sm:mb-0">
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                              ) : (
                                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                              )}
                              <span
                                className={`text-xs sm:text-sm ${
                                  lesson.completed ? "font-medium" : ""
                                }`}
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
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 pl-6 sm:pl-0">
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                {lesson.duration}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 sm:h-8 rounded-full text-xs"
                              >
                                {lesson.completed ? "Rewatch" : "Start"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 gradient-heading">
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {courseDetails?.whatYouWillLearn?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 gradient-heading">
                  Requirements
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  {courseDetails?.requirements?.map((req, index) => (
                    <li
                      key={index}
                      className="animate-fade-in text-xs sm:text-sm"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 gradient-heading">
                  Description
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {course.description}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="assessments" className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 gradient-heading">
                  Quizzes
                </h2>
                <div className="grid gap-4">
                  {quizzes?.map((quiz, index) => (
                    <Card
                      key={quiz.id}
                      className="overflow-hidden border-none shadow-md animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                              <h3 className="text-sm sm:text-base font-bold">
                                {quiz.title}
                              </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {quiz.questions} questions • {quiz.timeLimit}{" "}
                              minutes
                            </p>
                          </div>
                          <Link to={`/courses/${courseId}/quiz/${quiz.id}`}>
                            <Button
                              variant={quiz.completed ? "outline" : "default"}
                              className="w-full sm:w-auto rounded-full shimmer text-xs sm:text-sm h-8 sm:h-9"
                            >
                              {quiz.completed ? "Retake Quiz" : "Start Quiz"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 gradient-heading">
                  Exams
                </h2>
                <div className="grid gap-4">
                  {exams?.map((exam, index) => (
                    <Card
                      key={exam.id}
                      className="overflow-hidden border-none shadow-md animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                              <h3 className="text-sm sm:text-base font-bold">
                                {exam.title}
                              </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {exam.questions} questions • {exam.timeLimit}{" "}
                              minutes
                            </p>
                          </div>
                          <Link to={`/courses/${courseId}/exam/${exam.id}`}>
                            <Button
                              variant={exam.completed ? "outline" : "default"}
                              className="w-full sm:w-auto rounded-full shimmer text-xs sm:text-sm h-8 sm:h-9"
                            >
                              {exam.completed ? "Retake Exam" : "Start Exam"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="instructor" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 animate-fade-in">
                <img
                  src={
                    course.instructor?.avatar ||
                    `https://avatar.vercel.sh/${
                      course.instructor?.name || "Instructor"
                    }`
                  }
                  alt={`Instructor avatar for ${
                    course.instructor?.name || "Unknown"
                  }`}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover animate-bounce-in"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold gradient-heading text-center sm:text-left">
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
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-2 text-center sm:text-left">
                    {courseDetails.instructor?.bio}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;
