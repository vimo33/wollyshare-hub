
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
        // Check if we're in a recovery flow by looking at URL hash or query parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check both hash and query parameters for the token
        const accessToken = hashParams.get("access_token") || queryParams.get("token");
        const refreshToken = hashParams.get("refresh_token") || "";
        const type = hashParams.get("type") || queryParams.get("type");
        
        console.log("Reset password flow check:", { 
          accessToken: accessToken ? "[TOKEN EXISTS]" : null,
          type,
          hash: window.location.hash ? "[HASH EXISTS]" : null
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
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error("Error setting recovery session:", error);
              setError("Invalid or expired password reset link. Please request a new one.");
            } else {
              console.log("Successfully set recovery session");
              setValidResetFlow(true);
            }
          } catch (err) {
            console.error("Exception during recovery flow:", err);
            setError("An unexpected error occurred. Please try again.");
          }
        } else {
          // Not a valid reset flow
          console.error("No access token found in URL");
          setError("Invalid or expired password reset link. Please request a new one.");
        }
      } catch (err) {
        console.error("Exception in checkResetFlow:", err);
        setError("An unexpected error occurred. Please try again.");
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
