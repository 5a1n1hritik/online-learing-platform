import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "@/context/UserContext";
import ThemeToggle from "../ThemeToggle";

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  return (
    <header className="bg-background border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-3 flex-shrink-0">
      <div className="flex items-center justify-between">

        {/* Left side - Search (hidden on mobile, shown on tablet+) */}
        <div className="hidden sm:flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent w-full text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Mobile search button */}
        <div className="sm:hidden">
          <Button variant="ghost" size="sm">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle
            className="animate-fade-in text-muted-foreground"
            style={{ animationDelay: "0.5s" }}
          />
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage
                    src={
                      user?.avatarUrl ||
                      `https://avatar.vercel.sh/${user?.name}.png?height=32&width=32`
                    }
                    alt={user?.name || "Admin"}
                  />
                  <AvatarFallback>
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "AD"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">
                    {user?.name?.replace(/\b\w/g, (l) => l.toUpperCase()) ||
                      "Admin User"}
                  </p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email || "admin@edulearn.com"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
