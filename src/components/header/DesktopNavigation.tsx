
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DesktopNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Use the blue color from the hero section
  const activeClass = "text-[#1EAEDB] font-medium";
  const inactiveClass = "text-muted-foreground hover:text-[#1EAEDB]";
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" ? activeClass : inactiveClass;
    }
    return location.pathname.startsWith(path) ? activeClass : inactiveClass;
  };

  return (
    <nav className="hidden md:flex items-center gap-6 mx-8">
      {user ? (
        // Navigation for logged-in users
        <>
          <Link to="/" className={isActive("/") + " transition duration-200"}>
            Discover
          </Link>
          <Link to="/my-items" className={isActive("/my-items") + " transition duration-200"}>
            My Items
          </Link>
          <Link to="/how-it-works" className={isActive("/how-it-works") + " transition duration-200"}>
            How It Works
          </Link>
          <Link to="/about" className={isActive("/about") + " transition duration-200"}>
            About
          </Link>
        </>
      ) : (
        // Navigation for guests
        <>
          <Link to="/" className={isActive("/") + " transition duration-200"}>
            Home
          </Link>
          <Link to="/how-it-works" className={isActive("/how-it-works") + " transition duration-200"}>
            How It Works
          </Link>
          <Link to="/about" className={isActive("/about") + " transition duration-200"}>
            About
          </Link>
        </>
      )}
    </nav>
  );
};

export default DesktopNavigation;
