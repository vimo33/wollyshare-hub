
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Home, Package, Info, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose
} from "@/components/ui/drawer";

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileMenu = ({ open, setOpen }: MobileMenuProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function to check if a path is active
  const isActive = (path: string) => location.pathname === path;

  // Function to handle navigation and close drawer
  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <span className="sr-only">Open menu</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
          >
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="text-lg font-semibold">Menu</h3>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
          
          {user ? (
            <>
              <button 
                onClick={() => handleNavigation("/")}
                className={cn(
                  "text-base font-medium py-2 flex items-center gap-2 text-left",
                  isActive("/") ? "text-primary" : ""
                )}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => handleNavigation("/my-items")}
                className={cn(
                  "text-base font-medium py-2 flex items-center gap-2 text-left",
                  isActive("/my-items") ? "text-primary" : ""
                )}
              >
                <Package className="h-5 w-5" />
                <span>My Items</span>
              </button>
              <button 
                onClick={() => handleNavigation("/profile")}
                className={cn(
                  "text-base font-medium py-2 flex items-center gap-2 text-left",
                  isActive("/profile") ? "text-primary" : ""
                )}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              {isAdmin && (
                <button 
                  onClick={() => handleNavigation("/admin")}
                  className={cn(
                    "text-base font-medium py-2 text-left",
                    isActive("/admin") ? "text-primary" : ""
                  )}
                >
                  Admin Dashboard
                </button>
              )}
              <div className="pt-2 border-t">
                <LogoutButton size="sm" className="w-full justify-center" />
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/how-it-works")}
                className={cn(
                  "text-base font-medium py-2 flex items-center gap-2 text-left",
                  isActive("/how-it-works") ? "text-primary" : ""
                )}
              >
                <Info className="h-5 w-5" />
                <span>How It Works</span>
              </button>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button onClick={() => handleNavigation("/auth")} variant="outline" size="sm">
                  User Login
                </Button>
                <Button onClick={() => handleNavigation("/admin/auth")} variant="outline" size="sm">
                  Admin Login
                </Button>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
