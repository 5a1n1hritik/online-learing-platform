import React, { useState, useEffect, Suspense } from "react";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";
import API from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Display-friendly category labels
const categoryLabels = {
  ssc_cgl: "SSC CGL",
  rrb_group_d: "RRB Group D",
  ntpc: "RRB NTPC",
  ctet: "CTET",
  reet_level_1: "REET Level 1",
  reet_level_2: "REET Level 2",
  rajasthan_teacher_grade_3: "3rd Grade Teacher",
  upsc: "UPSC",
  banking: "Banking",
};

const levelOptions = ["Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [tempLevels, setTempLevels] = useState([]);
  const [tempCategory, setTempCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get("/courses/all-courses");
        setCourses(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !category || category === "all" || course.category === category;
    const matchesLevel =
      selectedLevels.length === 0 ||
      selectedLevels.includes(course.level?.toLowerCase());

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLevelToggle = (level) => {
    setTempLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const resetFilters = () => {
    setTempLevels([]);
    setTempCategory("");
  };

  const applyFilters = () => {
    setSelectedLevels(tempLevels.map((lvl) => lvl.toLowerCase()));
    setCategory(tempCategory);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container px-4 md:px-6 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-[250px] w-full rounded-md" />
        ))}
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!courses || courses.length === 0) {
    return <div>No courses available</div>;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Explore Our Courses
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Discover a wide range of courses designed to help you achieve
                  your learning goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:px-6 md:py-34 lg:py-12 bg-background">
          <div className="container mx-auto ">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex w-full md:w-auto gap-2 flex-col sm:flex-row">
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 gap-1 rounded-full"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Filter Courses</SheetTitle>
                      <SheetDescription>
                        Narrow down courses based on your preferences
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-6 py-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Category</h3>
                        <Select
                          value={tempCategory}
                          onValueChange={(val) => {
                            setTempCategory(val);
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {Object.entries(categoryLabels).map(
                              ([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Level</h3>
                        <div className="space-y-2">
                          {levelOptions.map((level) => (
                            <div
                              key={level}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`level-${level.toLowerCase()}`}
                                checked={tempLevels.includes(level)}
                                onCheckedChange={() => handleLevelToggle(level)}
                              />
                              <Label htmlFor={`level-${level.toLowerCase()}`}>
                                {level}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={resetFilters}>
                          Reset
                        </Button>
                        <Button onClick={applyFilters}>Apply Filters</Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <div className="pb-2">
                <TabsList className="w-full justify-start overflow-x-auto pl-2">
                  <TabsTrigger value="all" className="rounded-full">
                    All Courses
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="rounded-full">
                    Most Popular
                  </TabsTrigger>
                  <TabsTrigger value="new" className="rounded-full">
                    New Releases
                  </TabsTrigger>
                  <TabsTrigger value="free" className="rounded-full">
                    Free Courses
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  <Suspense fallback={<p>Loading courses...</p>}>
                    {paginatedCourses.map((course, index) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        index={index}
                      />
                    ))}
                  </Suspense>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      Prev
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  <Suspense fallback={<p>Loading courses...</p>}>
                    {courses
                      .slice()
                      .sort((a, b) => {
                        const scoreA = a.studentsCount * 0.7 + a.rating * 100;
                        const scoreB = b.studentsCount * 0.7 + b.rating * 100;
                        return scoreB - scoreA;
                      })
                      .slice(0, 8)
                      .map((course, index) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          index={index}
                        />
                      ))}
                  </Suspense>
                </div>
              </TabsContent>

              <TabsContent value="new" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  <Suspense fallback={<p>Loading courses...</p>}>
                    {courses
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .slice(0, 8)
                      .map((course, index) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          index={index}
                        />
                      ))}
                  </Suspense>
                </div>
              </TabsContent>

              <TabsContent value="free" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  <Suspense fallback={<p>Loading courses...</p>}>
                    {courses
                      .filter((course) => course.price === 0 || course.isFree)
                      .map((course, index) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          index={index}
                        />
                      ))}
                  </Suspense>
                </div>
              </TabsContent>
            </Tabs>

            {/* <div className="flex justify-center mt-8">
              <Button variant="outline" className="rounded-full">
                Load More Courses
              </Button>
            </div> */}
          </div>
        </section>
      </div>
    </>
  );
};

export default Courses;
