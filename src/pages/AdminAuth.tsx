
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import AdminSignupForm from "@/components/auth/AdminSignupForm";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, adminProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if already logged in as admin
    if (user && adminProfile) {
      navigate("/admin");
    }
  }, [user, adminProfile, navigate]);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="container max-w-md mx-auto mt-12 p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isLogin ? "Admin Login" : "Admin Registration"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Access WollyShare admin dashboard" 
              : "Create an admin account for WollyShare"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <AdminLoginForm />
          ) : (
            <AdminSignupForm />
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            {isLogin ? "Don't have an admin account? " : "Already have an admin account? "}
            <button 
              onClick={toggleForm} 
              className="text-primary hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuth;
