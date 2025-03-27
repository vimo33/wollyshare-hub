
import { Home, Package, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Don't show the bottom nav if the user isn't logged in
  if (!user) return null;
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <div className="flex items-center justify-around py-2 px-1">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        
        <Link 
          to="/my-items" 
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive("/my-items") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Package className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">My Items</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
            isActive("/profile") ? "text-primary" : "text-muted-foreground"
          )}
        >
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
