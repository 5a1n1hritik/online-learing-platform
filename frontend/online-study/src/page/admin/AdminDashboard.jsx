import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  Play,
  CheckCircle,
  Activity,
  BarChart3,
  Plus,
} from "lucide-react";

// Sample data for charts
const userGrowthData = [
  { month: "Jan", users: 1200, newUsers: 180 },
  { month: "Feb", users: 1450, newUsers: 250 },
  { month: "Mar", users: 1800, newUsers: 350 },
  { month: "Apr", users: 2200, newUsers: 400 },
  { month: "May", users: 2800, newUsers: 600 },
  { month: "Jun", users: 3400, newUsers: 600 },
  { month: "Jul", users: 4100, newUsers: 700 },
  { month: "Aug", users: 4900, newUsers: 800 },
  { month: "Sep", users: 5800, newUsers: 900 },
  { month: "Oct", users: 6900, newUsers: 1100 },
  { month: "Nov", users: 8200, newUsers: 1300 },
  { month: "Dec", users: 9800, newUsers: 1600 },
];

const courseEnrollmentData = [
  { course: "React Fundamentals", enrollments: 1247, completions: 892 },
  { course: "JavaScript Mastery", enrollments: 982, completions: 756 },
  { course: "Python Basics", enrollments: 1156, completions: 834 },
  { course: "UI/UX Design", enrollments: 756, completions: 523 },
  { course: "Data Science", enrollments: 634, completions: 445 },
  { course: "Node.js Backend", enrollments: 523, completions: 367 },
];

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      title: "Total Courses",
      value: "284",
      change: "+8.2%",
      trend: "up",
      icon: BookOpen,
      color: "bg-green-500",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    },
    {
      title: "Total Enrollments",
      value: "45,231",
      change: "+23.1%",
      trend: "up",
      icon: GraduationCap,
      color: "bg-purple-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
    {
      title: "Monthly Revenue",
      value: "$89,432",
      change: "-2.4%",
      trend: "down",
      icon: DollarSign,
      color: "bg-orange-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    },
  ];

  const activities = [
    {
      id: 1,
      type: "enrollment",
      user: "Sarah Johnson",
      course: "React Fundamentals",
      time: "2 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      type: "completion",
      user: "Mike Chen",
      course: "JavaScript Mastery",
      time: "4 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      type: "review",
      user: "Emma Davis",
      course: "UI/UX Design",
      time: "6 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      type: "enrollment",
      user: "John Smith",
      course: "Python Basics",
      time: "8 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ];

  const topCourses = [
    {
      title: "React Fundamentals",
      instructor: "John Doe",
      enrollments: 1247,
      rating: 4.8,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      title: "JavaScript Mastery",
      instructor: "Jane Smith",
      enrollments: 982,
      rating: 4.9,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
    {
      title: "UI/UX Design",
      instructor: "Mike Johnson",
      enrollments: 756,
      rating: 4.7,
      thumbnail: "/placeholder.svg?height=60&width=80",
    },
  ];

  return (
    <div className="bg-background space-y-4 sm:space-y-6 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        {/* <div className="flex flex-wrap gap-2">
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
            className="text-xs sm:text-sm"
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
            className="text-xs sm:text-sm"
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
            className="text-xs sm:text-sm"
          >
            90 Days
          </Button>
        </div> */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            <Activity className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden bg-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 truncate">
                    {stat.title}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-full ${stat.bgColor} flex-shrink-0`}
                >
                  <stat.icon
                    className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.color}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* User Growth Chart */}
        <Card className="xl:col-span-2 bg-card to-indigo-50 border-0 shadow-lg">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center text-foreground text-base sm:text-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              User Growth Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <ChartContainer
              config={{
                users: {
                  label: "Total Users",
                  color: "hsl(var(--chart-1))",
                },
                newUsers: {
                  label: "New Users",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]"
            >
              <div className="w-full aspect-[16/9]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={userGrowthData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorNewUsers"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={10} />
                  <YAxis stroke="#6B7280" fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorNewUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-0 shadow-lg">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-foreground text-base sm:text-lg">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
            <Button className="w-full justify-start bg-muted text-foreground hover:bg-muted-foreground shadow-sm text-sm">
              <Users className="w-4 h-4 mr-2" />
              Add New User
            </Button>
            <Button className="w-full justify-start bg-muted text-foreground hover:bg-muted-foreground shadow-sm text-sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Create Course
            </Button>
            <Button className="w-full justify-start bg-muted text-foreground hover:bg-muted-foreground shadow-sm text-sm">
              <GraduationCap className="w-4 h-4 mr-2" />
              Add Instructor
            </Button>
            <Button className="w-full justify-start bg-muted text-foreground hover:bg-muted-foreground shadow-sm text-sm">
              <DollarSign className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
      

      {/* Course Performance and Top Courses */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Course Performance Chart */}
        <Card className="bg-card border-0 shadow-lg">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center text-foreground text-base sm:text-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
              Course Enrollment Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <ChartContainer
              config={{
                enrollments: {
                  label: "Enrollments",
                  color: "hsl(var(--chart-1))",
                },
                completions: {
                  label: "Completions",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-full min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]"
            >
              <div className="w-full aspect-[16/9]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseEnrollmentData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="course"
                    stroke="#6B7280"
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis stroke="#6B7280" fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="enrollments" fill="#3B82F6" radius={[2, 2, 0, 0]} name="Enrollments" />
                  <Bar dataKey="completions" fill="#10B981" radius={[2, 2, 0, 0]} name="Completions" />
                </BarChart>
              </ResponsiveContainer>
              </div>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card className="bg-card border-0 shadow-lg">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-foreground text-base sm:text-lg">
              Top Performing Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
            {topCourses.map((course, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-muted rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate text-sm sm:text-base">
                    {course.title}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {course.instructor}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-muted-foreground ml-1">
                        {course.rating}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {course.enrollments} students
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="bg-card border-0 shadow-lg">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-foreground text-base sm:text-lg">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-muted rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {activity.type === "enrollment" && (
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                    )}
                    {activity.type === "completion" && (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    )}
                    {activity.type === "review" && (
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                    )}
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      <span className="font-semibold">{activity.user}</span>
                      {activity.type === "enrollment" && " enrolled in "}
                      {activity.type === "completion" && " completed "}
                      {activity.type === "review" && " reviewed "}
                      <span className="font-semibold">{activity.course}</span>
                    </p>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground mr-1 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
