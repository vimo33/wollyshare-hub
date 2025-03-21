
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const DesktopNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Helper function to check if a path is active
  const isActive = (path: string) => location.pathname === path;

  return (
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
  );
};

export default DesktopNavigation;
