
import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-full bg-wolly-green flex items-center justify-center">
        <span className="text-green-800 font-bold">W</span>
      </div>
      <span className="font-semibold text-lg hidden sm:inline-block">WollyShare</span>
    </Link>
  );
};

export default Logo;
