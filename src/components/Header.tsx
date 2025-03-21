
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/header/Logo";
import DesktopNavigation from "@/components/header/DesktopNavigation";
import UserMenu from "@/components/header/UserMenu";
import AuthMenu from "@/components/header/AuthMenu";
import MobileMenu from "@/components/header/MobileMenu";

const Header = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Navigation Links - Desktop */}
        <DesktopNavigation />

        {/* Auth buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {user ? <UserMenu /> : <AuthMenu />}
        </div>

        {/* Mobile Menu */}
        {isMobile && <MobileMenu open={open} setOpen={setOpen} />}
      </div>
    </header>
  );
};

export default Header;
