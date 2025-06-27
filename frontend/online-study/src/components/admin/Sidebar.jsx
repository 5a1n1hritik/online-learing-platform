import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ClipboardList,
  Plus,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Instructors", href: "/admin/instructors", icon: GraduationCap },
  { name: "Quizzes", href: "/admin/quizzes", icon: HelpCircle },
  { name: "Exams", href: "/admin/exams", icon: ClipboardList },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const quickActions = [
  { name: "Create Course", href: "/admin/courses/create", icon: Plus },
  { name: "Create Quiz", href: "/admin/quizzes/create", icon: Plus },
  { name: "Create Exam", href: "/admin/exams/create", icon: Plus },
];

const Sidebar = ({ className = "" }) => {
  const { user } = useUser();
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-3 left-3 z-50 md:hidden shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "peer fixed left-0 top-0 z-40 h-full bg-background dark:bg-sidebar-background border-r border-gray-200 dark:border-sidebar-border transition-all duration-300 shadow-lg",
          // Desktop behavior
          "hidden md:flex md:flex-col",
          isCollapsed ? "md:w-16" : "md:w-64",
          // Mobile behavior
          "md:translate-x-0",
          isMobileOpen
            ? "flex flex-col w-64 translate-x-0"
            : "-translate-x-full",
          className
        )}
        data-collapsed={isCollapsed}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-sidebar-border min-h-[64px]">
            {isCollapsed ? (
              <div className="group relative flex items-center justify-center w-full">
                {/* Logo Icon */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>

                {/* Chevron shows only on hover */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(false)}
                  className="absolute w-8 h-8 right-0 top-0 bottom-0 m-auto hidden group-hover:flex rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 dark:text-secondary hover:dark:text-secondary-foreground"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                {/* Expanded Logo + Text */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold gradient-heading truncate">
                    EduLearn
                  </span>
                </div>

                {/* Collapse Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                  className="hidden md:flex flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 sm:p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700 shadow-sm"
                      : "text-muted-foreground",
                    isCollapsed && "md:justify-center md:space-x-0"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          {!isCollapsed && (
            <div className="p-2 sm:p-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
                Quick Actions
              </p>
              <div className="space-y-1">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                  >
                    <action.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* User Profile */}
          <div className="p-2 sm:p-4 border-t border-border">
            <div
              className={cn(
                "flex items-center space-x-3",
                isCollapsed && "md:justify-center md:space-x-0"
              )}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-white">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : <Users className="w-4 h-4" />}
                </span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name?.replace(/\b\w/g, (l) => l.toUpperCase()) ||
                      "Admin User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "admin@edulearn.com"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
