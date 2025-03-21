
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogIn, LogOut, Info, Home, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/auth/LogoutButton";

const Header = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function to check if a path is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-wolly-green flex items-center justify-center">
            <span className="text-green-800 font-bold">W</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline-block">WollyShare</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Only show these links if user is logged in */}
          {user && (
            <>
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-medium transition-colors flex items-center gap-1",
                  isActive("/") 
                    ? "text-primary" 
                    : "hover:text-primary/80"
                )}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/my-items" 
                className={cn(
                  "text-sm font-medium transition-colors flex items-center gap-1",
                  isActive("/my-items") 
                    ? "text-primary" 
                    : "hover:text-primary/80"
                )}
              >
                <Package className="h-4 w-4" />
                <span>My Items</span>
              </Link>
            </>
          )}
          
          <Link 
            to="/how-it-works" 
            className={cn(
              "text-sm font-medium transition-colors flex items-center gap-1",
              isActive("/how-it-works") 
                ? "text-primary" 
                : "hover:text-primary/80"
            )}
          >
            <Info className="h-4 w-4" />
            <span>How It Works</span>
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                  <div className="h-9 w-9 rounded-full bg-wolly-blue flex items-center justify-center">
                    <span className="text-blue-800 font-bold">
                      {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{profile?.username || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <LogoutButton variant="ghost" size="sm" className="w-full justify-start" />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/auth" className="w-full cursor-pointer">
                    User Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/auth" className="w-full cursor-pointer">
                    Admin Login
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
