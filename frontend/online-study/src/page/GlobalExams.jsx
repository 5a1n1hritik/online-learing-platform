import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import AnimatedScene from "@/components/AnimatedScreen";
import API from "@/api/axios";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const getCategoryColor = (category) => {
  const colors = {
    UPSC: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    SSC: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    BANKING:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    RAILWAYS:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    CTET: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    STATE_PSC:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  };
  return colors[category?.toUpperCase()] || "bg-gray-100 text-gray-800";
};

const getLevelColor = (level) => {
  const colors = {
    EASY: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    MEDIUM:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    HARD: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return colors[level?.toUpperCase()] || "bg-gray-100 text-gray-800";
};

const DIFFICULTY_LEVELS = ["ALL", "EASY", "MEDIUM", "HARD"];

const GlobalExams = () => {
  const [globalExams, setGlobalExams] = useState([]);
  const [categories, setCategories] = useState([{ id: "ALL", name: "ALL" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const examsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const parems = {
          page: currentPage,
          limit: itemsPerPage,
          categoryId: selectedCategory !== "ALL" ? selectedCategory : undefined,
          difficulty: selectedLevel !== "ALL" ? selectedLevel : undefined,
          isPaid: showPaidOnly ? true : undefined,
          search: searchTerm || undefined,
        };

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const response = await API.get("/exams", { params: parems });
        const { data, pagination: pg } = response.data;
        setGlobalExams(data);
        setPagination({
          total: pg.total,
          totalPages: pg.totalPages,
        });
      } catch (error) {
        console.error("Error fetching exams:", error);
        setError("Failed to load exams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    examsData();
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

  const categoryOptions = categories;
  const levelsOptions = DIFFICULTY_LEVELS;

  const FilterContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-filter">Category</Label>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger id="category-filter">
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
        <Label htmlFor="paid-filter" className="text-sm font-medium">
          Show only paid exams
        </Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Scene */}
      <AnimatedScene />

      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-heading mb-4 animate-fade-in">
            🌍 Global Exams
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto animate-slide-up">
            Prepare for competitive exams with our comprehensive test series
            covering UPSC, SSC, Banking, Railways, and more...
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div
          className="mb-6 sm:mb-8 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search exams by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Mobile Filter Button */}
            <div className="sm:hidden">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 animate-fade-in"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="">
                  <SheetHeader>
                    <SheetTitle className="text-lg font-bold gradient-heading">
                      Filter Exams
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground mt-2 border-b pb-4">
                      Refine your search with these filters
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                  <SheetFooter className="border-t pt-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("ALL");
                        setSelectedLevel("ALL");
                        setShowPaidOnly(false);
                        setCurrentPage(1);
                      }}
                      className="mt-3"
                    >
                      Clear all filters
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex flex-wrap gap-4">
            <div className="min-w-[180px]">
              <Select
                value={selectedCategory}
                onValueChange={(v) => {
                  setSelectedCategory(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
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

            <div className="min-w-[150px]">
              <Select
                value={selectedLevel}
                onValueChange={(value) => setSelectedLevel(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
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

            <div className="flex items-center space-x-2 px-3 py-2 border rounded-md bg-background">
              <Checkbox
                id="paid-desktop"
                checked={showPaidOnly}
                onCheckedChange={(checked) => setShowPaidOnly(checked)}
              />
              <Label
                htmlFor="paid-desktop"
                className="text-sm font-medium whitespace-nowrap"
              >
                Paid only
              </Label>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {globalExams.length} of {pagination.total} exams
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: itemsPerPage }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg shadow-sm bg-card dark:bg-gray-800 space-y-4 animate-pulse"
                >
                  <Skeleton className="w-1/3 h-5" />
                  <Skeleton className="w-3/4 h-6" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <div className="flex space-x-2">
                    <Skeleton className="w-1/4 h-6" />
                    <Skeleton className="w-1/4 h-6" />
                    <Skeleton className="w-1/4 h-6" />
                  </div>
                  <Skeleton className="w-full h-10 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {globalExams.map((exam, index) => (
              <Card
                key={exam.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${0.1 * (index % 9)}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      className={getCategoryColor(exam.category?.name)}
                      variant="secondary"
                    >
                      {exam.category?.name}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {exam.rating
                        ? exam.rating
                        : (Math.random() * 1.2 + 3.8).toFixed(1)}
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {exam.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {exam.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      className={getLevelColor(exam.difficulty)}
                      variant="secondary"
                    >
                      {exam.difficulty}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {exam.timeLimit}m
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        exam.isPaid
                          ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300"
                          : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
                      }
                    >
                      {exam.isPaid ? `₹${exam.price}` : "Free"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>
                        {exam.participants?.toLocaleString()} participants
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {exam.tags?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {exam.tags?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{exam.tags?.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    <Link to={`/globalExams/${exam.id}/start`}>Start Exam</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {globalExams.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">No exams found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setSelectedLevel("ALL");
                setShowPaidOnly(false);
                setCurrentPage(1);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 animate-slide-up">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex items-center gap-2">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNumber = pagination.totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className="w-10 h-10"
                    >
                      {pageNumber}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages)
                )
              }
              disabled={currentPage === pagination.totalPages}
              className="flex items-center gap-2"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalExams;
