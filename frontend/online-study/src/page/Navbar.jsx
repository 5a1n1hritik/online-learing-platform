import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  LogOut,
  Home,
  BookOpen,
  FileText,
  LogIn,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "../components/ThemeToggle";
import { useUser } from "@/context/UserContext";
import { Separator } from "@radix-ui/react-dropdown-menu";

const routes = [
  {
    href: "/dashboard",
    label: "Explore",
    icon: Home,
    authOnly: false,
  },
  {
    href: "/courses",
    label: "Courses",
    icon: BookOpen,
    authOnly: false,
  },
  {
    href: "/globalExams",
    label: "Exams",
    icon: FileText,
    authOnly: false,
  },
  {
    href: "/login",
    label: "Login",
    icon: LogIn,
    authOnly: false,
    // hideWhenAuthenticated: true,
  },
];

const secondaryNavItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
];

const Navbar = () => {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300",
        scrolled ? "bg-background/95 shadow-md" : "bg-transparent",
        mounted ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 animate-fade-in"
          >
            <span className="text-xl font-bold tracking-tight gradient-heading">
              EduLearn
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes
              .filter((route) => !(user && route.hideWhenAuthenticated))
              .map((route, index) => (
                <Link
                  key={route.href}
                  to={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative py-1",
                    pathname === route.href
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']"
                      : "text-muted-foreground",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                >
                  {route.label}
                </Link>
              ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle
            className="animate-fade-in text-muted-foreground"
            style={{ animationDelay: "0.5s" }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar
                className="h-8 w-8 hidden md:flex cursor-pointer animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                <AvatarImage
                  src={
                    user?.avatarUrl ||
                    `https://avatar.vercel.sh/${user?.name}.png?height=32&width=32`
                  }
                  alt={user?.name || "User"}
                />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "US"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-slide-up w-48">
              <DropdownMenuLabel className="text-sm font-semibold">
                {user?.name?.replace(/\b\w/g, (l) => l.toUpperCase()) ||
                  "Student"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="w-full text-left animate-slide-in-right"
                  style={{ animationDelay: "0.1s" }}
                >
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  to="/settings"
                  className="w-full text-left animate-slide-in-right"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="text-destructive cursor-pointer animate-slide-in-right"
                style={{ animationDelay: "0.4s" }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold gradient-heading">
                  EduLearn
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground mt-2 border-b pb-4">
                  Welcome to EduLearn! Your one-stop solution for online
                  learning.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {routes.map((route, index) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary animate-slide-in-right",
                      pathname === route.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {route.icon && (
                      <route.icon className="h-4 w-4 mr-1 inline-block" />
                    )}

                    {route.label}
                  </Link>
                ))}
              </nav>

              <Separator className="my-4" />

              <nav className="flex flex-col gap-4 mt-6">
                {secondaryNavItems.map((route, index) => (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary animate-slide-in-right",
                      pathname === route.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {route.icon && (
                      <route.icon className="h-4 w-4 mr-1 inline-block" />
                    )}

                    {route.title}
                  </Link>
                ))}
              </nav>

              <SheetFooter className="border-t pt-2 mt-8">
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          user?.avatarUrl ||
                          `https://avatar.vercel.sh/${user?.name}.png?height=32&width=32`
                        }
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "US"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {user?.name?.replace(/\b\w/g, (l) => l.toUpperCase()) ||
                          "Student"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email || "student@example.com"}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    title="Logout"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
