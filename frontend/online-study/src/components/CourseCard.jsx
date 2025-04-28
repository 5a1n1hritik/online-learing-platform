import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Star } from "lucide-react";

import { cn } from "../lib/utils"; // Adjust the path based on your project
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
          src={course.image || "/placeholder.svg"}
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
            {course.students.toLocaleString()} students
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm font-medium">By {course.instructor}</div>
        <Link to={`/courses/${course.id}`}>
          <Button variant="default" size="sm" className="rounded-full shimmer">
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
