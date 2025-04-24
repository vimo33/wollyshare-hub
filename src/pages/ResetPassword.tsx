import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validResetFlow, setValidResetFlow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkResetFlow = async () => {
      setLoading(true);
      
      try {
        console.log("Starting reset password flow check...");
        console.log("Current URL:", window.location.href);
        
        // Parse URL parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const type = searchParams.get('type');
        
        // Debug URL parameters
        console.log("Reset flow parameters:", {
          code: code ? "present" : "missing",
          type,
          fullParams: Object.fromEntries(searchParams.entries())
        });

        // Validate reset flow parameters
        if (!code || code.trim() === '') {
          console.error("Missing or empty code parameter");
          setError("Missing authentication code. Please request a new password reset link.");
          setLoading(false);
          return;
        }

        if (!type || (type !== 'recovery' && type !== 'passwordRecovery')) {
          console.error("Invalid or missing type parameter:", type);
          setError("Invalid reset link type. Please request a new password reset link.");
          setLoading(false);
          return;
        }

        // Verify the reset token with Supabase
        try {
          console.log("Verifying reset token...");
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: "recovery"
          });
          
          if (verifyError) {
            console.error("Error verifying reset token:", verifyError);
            throw verifyError;
          }
          
          if (data?.session) {
            console.log("Successfully verified reset token");
            setValidResetFlow(true);
          } else {
            console.error("No session returned after token verification");
            throw new Error("Failed to establish reset session");
          }
        } catch (verifyError: any) {
          console.error("Token verification failed:", verifyError);
          setError("Invalid or expired password reset link. Please request a new one.");
          setLoading(false);
          return;
        }
        
      } catch (err: any) {
        console.error("Error in reset flow:", err);
        setError("An unexpected error occurred. Please request a new password reset link.");
      }
      
      setLoading(false);
    };
    
    checkResetFlow();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="container max-w-md mx-auto mt-12 p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Validating your reset link...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto mt-12 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <>
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="text-center mt-4">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Request a new password reset link
                </Link>
              </div>
            </>
          ) : (
            validResetFlow && <ResetPasswordForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
