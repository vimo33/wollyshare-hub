
import React from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthMenu = () => {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link to="/auth" className="flex items-center">
        <LogIn className="mr-2 h-4 w-4" />
        <span>Login</span>
      </Link>
    </Button>
  );
};

export default AuthMenu;
