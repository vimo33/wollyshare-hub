
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
        
        // Extract error from hash if present (for detecting expired tokens)
        if (window.location.hash && window.location.hash.includes('error=')) {
          const errorParams = new URLSearchParams(window.location.hash.substring(1));
          const errorCode = errorParams.get('error_code');
          const errorDescription = errorParams.get('error_description');
          
          if (errorCode && errorDescription) {
            console.error(`Auth error detected: ${errorCode} - ${errorDescription}`);
            setError(`${errorDescription.replace(/\+/g, ' ')}. Please request a new password reset link.`);
            setLoading(false);
            return;
          }
        }
        
        // Determine if we have a token either in the hash or query params
        let accessToken = null;
        let refreshToken = null;
        let type = null;
        let queryToken = null;

        // Case 1: Token in hash fragment (#) - Supabase's default callback format
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          accessToken = hashParams.get("access_token");
          refreshToken = hashParams.get("refresh_token") || "";
          type = hashParams.get("type");
          
          console.log("Found in hash params:", { 
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            type
          });
        }

        // Case 2: Token in URL query parameters (?) - Alternative format
        if (!accessToken) {
          const queryParams = new URLSearchParams(window.location.search);
          queryToken = queryParams.get("token");
          type = queryParams.get("type");
          
          console.log("Found in query params:", { 
            hasToken: !!queryToken,
            type
          });
          
          // If we have a token in query params, we need to verify it
          if (queryToken && type === "recovery") {
            try {
              // For recovery tokens in query params, use token_hash
              const { data, error: verifyError } = await supabase.auth.verifyOtp({
                token_hash: queryToken,
                type: "recovery"
              });
              
              if (verifyError) {
                console.error("Error verifying OTP:", verifyError);
                throw verifyError;
              }
              
              if (data?.session) {
                console.log("Successfully verified OTP and created session");
                // Set valid reset flow since we now have an authenticated session
                setValidResetFlow(true);
                setLoading(false);
                return;
              }
            } catch (error: any) {
              console.error("Error verifying recovery token:", error);
              setError(`Invalid or expired password reset link. Please request a new one. (${error.message})`);
              setLoading(false);
              return;
            }
          }
        }
        
        console.log("Reset password flow check:", { 
          hasAccessToken: !!accessToken,
          type,
          hashExists: !!window.location.hash,
          hashLength: window.location.hash.length
        });
        
        // If we have an access token in the URL, we're in a password reset flow
        if (accessToken) {
          console.log("Valid reset token found, setting up recovery session");
          
          // Sign out any current user to ensure we're in a clean state
          await supabase.auth.signOut();
          
          try {
            // This will set the recovery token as the active session
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });
            
            if (error) {
              console.error("Error setting recovery session:", error);
              setError(`Invalid or expired password reset link. Please request a new one. (${error.message})`);
            } else if (data?.session) {
              console.log("Successfully set recovery session with user:", data.user?.email);
              setValidResetFlow(true);
            } else {
              console.error("No session established");
              setError("Invalid or expired password reset link. Please request a new one. (No session established)");
            }
          } catch (err: any) {
            console.error("Exception during recovery flow:", err);
            setError(`An unexpected error occurred: ${err?.message || "Unknown error"}. Please try again.`);
          }
        } else {
          // Check if we already have an active session that might be a recovery session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            console.log("Found existing session, checking if it's a recovery session");
            // We have a session - check if it's a valid recovery session
            setValidResetFlow(true);
          } else {
            // Not a valid reset flow
            console.error("No access token or valid session found");
            setError("Invalid or expired password reset link. Please request a new one. (Auth session missing!)");
          }
        }
      } catch (err: any) {
        console.error("Exception in checkResetFlow:", err);
        setError(`An unexpected error occurred: ${err?.message || "Unknown error"}. Please try again.`);
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
              <Alert className="mb-4">
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
