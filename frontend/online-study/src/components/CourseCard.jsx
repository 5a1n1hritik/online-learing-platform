import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Star } from "lucide-react";

import { cn } from "../lib/utils";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import EnrollButton from "./EnrollButton";

const CourseCard = ({ course, className, index = 0 }) => {
  const animationDelay = `${index * 0.1}s`;

  return (
    <Card
      className={cn(
        "overflow-hidden course-card animate-fade-in border-none shadow-md h-full flex flex-col",
        className
      )}
      style={{ animationDelay }}
    >
      <div className="aspect-video w-full overflow-hidden relative">
        <img
          src={
            course.imageUrl ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx7932TNla9vTmP29NVDuIx9hrTm-qT9UNXA&s"
          }
          alt={course.title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
        {course.isFree && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            Free
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge
            variant="outline"
            className="bg-secondary/50 animate-pulse-soft text-xs whitespace-nowrap"
          >
            {course.level}
          </Badge>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <Star className="mr-1 h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
            {course.rating}
          </div>
        </div>
        <CardTitle className="line-clamp-1 text-base sm:text-lg mt-2">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs sm:text-sm">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 flex-grow">
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground flex-wrap gap-y-2">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
            {course.studentsCount} students
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 sm:p-6 pt-0 sm:pt-0 flex-wrap gap-y-3 mt-auto">
        <div className="text-xs sm:text-sm font-medium">
          By{" "}
          {course.instructor?.name
            ? course.instructor.name
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")
            : "Unknown Instructor"}
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Link to={`/courses/${course.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-8 text-xs px-3 sm:px-4 whitespace-nowrap"
            >
              View Course
            </Button>
          </Link>
          <EnrollButton
            courseId={course.id}
            courseTitle={course.title}
            courseDetails={course}
            className="rounded-full shimmer h-8 text-xs px-3 sm:px-4 whitespace-nowrap"
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
