import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, Eye, FileText, Star } from "lucide-react";
import { popularMockTest } from "@/data/homePageData";

const HomePopularTest = () => {
  return (
    <section className="w-full py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 sm:gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Popular Mock Tests
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Practice with exam-pattern questions
            </p>
          </div>
          <Button variant="outline" className="mt-2 sm:mt-0">
            <Link to="/globalExams">View All Tests</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularMockTest.map((test, index) => (
            <Card
              key={index}
              className="border-none shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant={
                      test.difficulty === "Hard"
                        ? "destructive"
                        : test.difficulty === "Medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {test.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{test.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-base sm:text-lg leading-tight">
                  {test.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>{test.questions} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>{test.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <Eye className="h-4 w-4" />
                  <span>{test.attempts.toLocaleString()} attempts</span>
                </div>
                <Link to="/globalExams">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Take Test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePopularTest;
