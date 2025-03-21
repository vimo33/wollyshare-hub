
import { useState, useEffect } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-semibold flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="h-9 w-9 rounded-full bg-wolly-green flex items-center justify-center">
            <span className="text-green-800 font-bold">W</span>
          </div>
          <span>WollyShare</span>
        </Link>

        {/* Desktop Navigation - Only show when user is logged in */}
        {user && (
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-primary/80 transition-colors">
              Home
            </Link>
            <Link to="/my-items" className="text-sm font-medium hover:text-primary/80 transition-colors">
              My Items
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-9 w-9 rounded-full bg-wolly-blue flex items-center justify-center">
            <span className="text-blue-800 font-bold">U</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fade-in">
          <div className="flex flex-col py-4 px-6 space-y-4">
            {/* Only show navigation items when user is logged in */}
            {user ? (
              <>
                <Link 
                  to="/" 
                  className="text-sm font-medium py-2 hover:text-primary/80 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/my-items" 
                  className="text-sm font-medium py-2 hover:text-primary/80 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Items
                </Link>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="text-sm font-medium py-2 hover:text-primary/80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
            <div className="flex items-center space-x-4 pt-2">
              <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
