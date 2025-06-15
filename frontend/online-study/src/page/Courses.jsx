import React, { useState, useEffect, Suspense } from "react";
import { ChevronUp, Filter, Search } from "lucide-react";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LEVEL_OPTIONS = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([{ id: "ALL", name: "ALL" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [resetFlag, setResetFlag] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const parems = {
          page: currentPage,
          limit: itemsPerPage,
          categoryId: selectedCategory !== "ALL" ? selectedCategory : undefined,
          level: selectedLevel !== "ALL" ? selectedLevel : undefined,
          isPaid: showPaidOnly ? true : undefined,
          search: searchTerm || undefined,
        };

        const response = await API.get("/courses/all-courses", {
          params: parems,
        });
        const { data, pagination: pg } = response.data;
        setCourses((prev) =>
          currentPage === 1 || resetFlag ? data : [...prev, ...data]
        );
        setPagination({
          total: pg.total,
          totalPages: pg.totalPages,
        });
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError("Failed to load exams. Please try again later.");
      } finally {
        setLoading(false);
        setResetFlag(false);
      }
    };

    fetchCourses();
  }, [currentPage, selectedCategory, selectedLevel, showPaidOnly, searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category/categories");
        const allCategories = res.data || [];
        const formatted = allCategories.map((c) => ({
          id: c.id,
          name: c.name.toUpperCase(),
        }));
        setCategories([{ id: "ALL", name: "ALL" }, ...formatted]);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedLevel("ALL");
    setShowPaidOnly(false);
    setSearchTerm("");
    setCurrentPage(1);
    setResetFlag(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categoryOptions = categories;
  const levelsOptions = LEVEL_OPTIONS;

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
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Explore Courses
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover new skills, expand your knowledge
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-2 flex-col sm:flex-row">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
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
                    <Label htmlFor="category-filter">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value)}
                    >
                      <SelectTrigger
                        id="category-filter"
                        className="w-full sm:w-[180px]"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name === "ALL" ? "All Categories" : cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level-filter">Difficulty Level</Label>
                    <Select
                      value={selectedLevel}
                      onValueChange={(value) => setSelectedLevel(value)}
                    >
                      <SelectTrigger id="level-filter">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levelsOptions.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level === "ALL" ? "All Levels" : level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="paid-filter"
                      checked={showPaidOnly}
                      onCheckedChange={(checked) => setShowPaidOnly(checked)}
                    />
                    <Label
                      htmlFor="paid-filter"
                      className="text-sm font-medium"
                    >
                      Show only paid courses
                    </Label>
                  </div>
                </div>
                <SheetFooter className="border-t pt-2 mt-8">
                  <div className="mt-4">
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </SheetFooter>
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
                {courses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </Suspense>
            </div>
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
                    <CourseCard key={course.id} course={course} index={index} />
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
                    <CourseCard key={course.id} course={course} index={index} />
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
                    <CourseCard key={course.id} course={course} index={index} />
                  ))}
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>

        {pagination.totalPages > currentPage && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-accent transition"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Courses;
