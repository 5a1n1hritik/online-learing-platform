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
        "overflow-hidden course-card animate-fade-in border-none shadow-md",
        className
      )}
      style={{ animationDelay }}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={
            course.imageUrl ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx7932TNla9vTmP29NVDuIx9hrTm-qT9UNXA&s"
          }
          alt={course.title}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="bg-secondary/50 animate-pulse-soft"
          >
            {course.level}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            {course.rating}
          </div>
        </div>
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {course.duration}
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            {course.studentsCount} students
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm font-medium">By {course.instructor.name}</div>
        <div className="flex gap-2">
          <Link to={`/courses/${course.id}`}>
            <Button variant="outline" size="sm" className="rounded-full">
              View Course
            </Button>
          </Link>
          <EnrollButton
            courseId={course.id}
            courseTitle={course.title}
            courseDetails={course}
            className="rounded-full shimmer"
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
