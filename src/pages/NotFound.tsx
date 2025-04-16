
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-purple-700">404</h1>
        <p className="text-xl text-gray-700 mb-6">Page not found</p>
        <p className="text-gray-600 mb-6">
          The requested URL <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">{location.pathname}</span> was not found.
        </p>
        <div className="space-y-4">
          <Link to="/" className="block w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
            Return to Home
          </Link>
          <Link to="/auth" className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
