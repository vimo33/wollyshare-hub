
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, HelpCircle, CircleUser } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Don't render on desktop or if user isn't logged in
  if (!isMobile || !user) {
    return null;
  }

  // Use the blue color from the hero section
  const activeClass = "text-[#1EAEDB]";
  const inactiveClass = "text-muted-foreground";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-md z-40">
      <div className="grid grid-cols-4 h-14">
        <button
          className="flex flex-col items-center justify-center"
          onClick={() => navigate("/")}
        >
          <Home className={isActive("/") ? activeClass : inactiveClass} size={20} />
          <span className={`text-xs mt-1 ${isActive("/") ? activeClass : inactiveClass}`}>
            Discover
          </span>
        </button>

        <button
          className="flex flex-col items-center justify-center"
          onClick={() => navigate("/my-items")}
        >
          <Package className={isActive("/my-items") ? activeClass : inactiveClass} size={20} />
          <span className={`text-xs mt-1 ${isActive("/my-items") ? activeClass : inactiveClass}`}>
            My Items
          </span>
        </button>

        <button
          className="flex flex-col items-center justify-center"
          onClick={() => navigate("/how-it-works")}
        >
          <HelpCircle className={isActive("/how-it-works") ? activeClass : inactiveClass} size={20} />
          <span className={`text-xs mt-1 ${isActive("/how-it-works") ? activeClass : inactiveClass}`}>
            Help
          </span>
        </button>

        <button
          className="flex flex-col items-center justify-center"
          onClick={() => navigate("/profile")}
        >
          <CircleUser className={isActive("/profile") ? activeClass : inactiveClass} size={20} />
          <span className={`text-xs mt-1 ${isActive("/profile") ? activeClass : inactiveClass}`}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
