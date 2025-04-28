import React from "react";
import { Quote } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for testimonials
const testimonials = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "Software Developer",
    content:
      "The courses on EduLearn have been instrumental in advancing my career. The instructors are knowledgeable and the content is always up-to-date with industry standards.",
    avatar: "https://avatar.vercel.sh/alex-thompson",
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "UX Designer",
    content:
      "I've taken multiple design courses on this platform and each one has helped me improve my skills. The community support is amazing and the feedback from instructors is invaluable.",
    avatar: "https://avatar.vercel.sh/priya-sharma",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    role: "Data Analyst",
    content:
      "The data science courses here are comprehensive and practical. I was able to apply what I learned immediately in my job, which led to a promotion within six months!",
    avatar: "https://avatar.vercel.sh/marcus-johnson",
  },
];

const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const Testimonials = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/30 pattern-bg">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl gradient-heading">
              What Our Students Say
            </h2>
            <p
              className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Hear from our community of learners about their experiences with
              EduLearn.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="relative card-hover-effect border-none shadow-md animate-fade-in"
              style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
            >
              <CardHeader className="pb-0">
                <Quote className="h-8 w-8 text-primary opacity-50 animate-pulse-soft" />
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-base">
                  {testimonial.content}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex items-center gap-4 border-t pt-4">
                <Avatar
                  className="animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1 + 0.6}s` }}
                >
                  <AvatarImage
                    src={
                      testimonial.avatar || "https://avatar.vercel.sh/default"
                    }
                    alt={testimonial.name}
                  />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-base">
                    {testimonial.name}
                  </CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
