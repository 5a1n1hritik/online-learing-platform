import React from "react";
import { Link } from "react-router-dom"; // React Router Link
import { useLocation } from "react-router-dom"; // React Router useLocation
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/courses",
    label: "Courses",
  },
  {
    href: "/Exams",
    label: "Exams",
  },
  {
    href: "/login",
    label: "Login",
  },
  {
    href: "/register",
    label: "Register",
  },
];
const user = {
  name: "John Doe",
  email: "m@example.com",
};
const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const Navbar = () => {
  const { pathname } = useLocation(); // Use useLocation to get current path
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation on mount
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
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2 animate-fade-in">
            <span className="text-xl font-bold tracking-tight gradient-heading">
              EduLearn
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route, index) => (
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
          {/* <ThemeToggle
            className="animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          /> */}
          <Avatar
            className="h-8 w-8 hidden md:flex animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <AvatarImage
              src={`https://avatar.vercel.sh/${getInitials(user.name)}`}
              alt="User"
            />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <Sheet>
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
              <nav className="flex flex-col gap-4 mt-8">
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
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
