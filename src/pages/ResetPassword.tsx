
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
        // Extract token from URL hash (Supabase sends recovery links with hash format)
        let accessToken = null;
        let refreshToken = null;
        let type = null;

        // First check hash parameters (most common with Supabase auth)
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

        // If not in hash, check query parameters as fallback
        if (!accessToken) {
          const queryParams = new URLSearchParams(window.location.search);
          accessToken = queryParams.get("token");
          type = queryParams.get("type");
          
          console.log("Found in query params:", { 
            hasAccessToken: !!accessToken,
            type
          });
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
            } else {
              console.log("Successfully set recovery session with user:", data.user?.email);
              setValidResetFlow(true);
            }
          } catch (err: any) {
            console.error("Exception during recovery flow:", err);
            setError(`An unexpected error occurred: ${err?.message || "Unknown error"}. Please try again.`);
          }
        } else {
          // Not a valid reset flow
          console.error("No access token found in URL");
          setError("Invalid or expired password reset link. Please request a new one.");
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
