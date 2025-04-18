
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

const ResetPassword = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validResetFlow, setValidResetFlow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkResetFlow = async () => {
      setLoading(true);
      
      try {
        console.log("Starting reset password flow check...");
        
        // Check for error parameters from Supabase auth redirect
        const urlParams = new URLSearchParams(window.location.search);
        const errorCode = urlParams.get('error_code') || urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (errorCode || errorDescription) {
          console.error(`Auth error detected: ${errorCode} - ${errorDescription}`);
          setError(`${errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : 'Authentication error'}. Please request a new password reset link.`);
          setLoading(false);
          return;
        }

        // Modern approach: Check for 'code' parameter (newest Supabase versions)
        const code = urlParams.get('code');
        const type = urlParams.get('type');
        
        console.log("URL parameters:", { 
          hasCode: !!code,
          type
        });

        if (code && (type === "recovery" || type === "passwordRecovery" || !type)) {
          try {
            console.log("Verifying with OTP code");
            
            // Use token_hash parameter for recovery flow
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: code,
              type: "recovery"
            });
            
            if (verifyError) {
              console.error("Error verifying code:", verifyError);
              throw verifyError;
            }
            
            if (data?.session) {
              console.log("Successfully verified code and created session");
              setValidResetFlow(true);
              setLoading(false);
              return;
            } else {
              console.error("No session returned after OTP verification");
              throw new Error("Authentication failed. No session was established.");
            }
          } catch (error) {
            console.error("Error verifying recovery code:", error);
            setError(`Invalid or expired password reset link. Please request a new one.`);
            setLoading(false);
            return;
          }
        }
        
        // Legacy approach: Check for existing session as fallback
        console.log("Checking for existing session");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error checking session:", sessionError);
          throw sessionError;
        }
        
        if (session?.user) {
          console.log("Found existing session for user:", session.user.email);
          setValidResetFlow(true);
          setLoading(false);
          return;
        }
        
        // No valid recovery flow found
        console.error("No valid recovery code or session found");
        setError("Invalid or expired password reset link. Please request a new password reset link.");
        
      } catch (err: any) {
        console.error("Exception in checkResetFlow:", err);
        setError(`An unexpected error occurred. Please request a new password reset link.`);
      }
      
      setLoading(false);
    };
    
    checkResetFlow();
  }, [navigate]);

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
