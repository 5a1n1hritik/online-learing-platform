import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";

// Mock data for featured courses
const featuredCourses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description:
      "Learn the core concepts of HTML, CSS, and JavaScript to build modern websites.",
    instructor: "Sarah Johnson",
    level: "Beginner",
    duration: "8 weeks",
    rating: 4.8,
    students: 1245,
    imageUrl:
      "https://image.lexica.art/full_webp/062926f4-df98-4625-a661-b7bca81b67ff",
  },
  {
    id: "2",
    title: "Data Science Essentials",
    description:
      "Master the fundamentals of data analysis, visualization, and machine learning.",
    instructor: "Michael Chen",
    level: "Intermediate",
    duration: "10 weeks",
    rating: 4.7,
    students: 982,
    imageUrl: "https://i.ytimg.com/vi/SVVYvHRxQzI/hqdefault.jpg",
  },
  {
    id: "3",
    title: "UX/UI Design Masterclass",
    description:
      "Create stunning user interfaces and improve user experience with modern design principles.",
    instructor: "Emily Rodriguez",
    level: "All Levels",
    duration: "6 weeks",
    rating: 4.9,
    students: 756,
    imageUrl:
      "https://askusedu.com/blogdashboard/wp-content/uploads/2024/07/how-to-prepare-for-upsc.webp",
  },
];

const FeaturedCourses = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl gradient-heading">
              Featured Courses
            </h2>
            <p
              className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Explore our most popular courses and start your learning journey
              today.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {featuredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
        <div
          className="flex justify-center mt-8 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <Link to="/courses">
            <Button variant="outline" className="rounded-full shimmer">
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
