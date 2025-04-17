
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./header/Logo";
import DesktopNavigation from "./header/DesktopNavigation";
import MobileMenu from "./header/MobileMenu";
import UserMenu from "./header/UserMenu";
import AuthMenu from "./header/AuthMenu";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Logo />
        <DesktopNavigation />
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="mr-2 flex items-center justify-center rounded-full p-2 hover:bg-accent"
              aria-label="Admin settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          )}
          {!isLoading && (user ? <UserMenu /> : <AuthMenu />)}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
