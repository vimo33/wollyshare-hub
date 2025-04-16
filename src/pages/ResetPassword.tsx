
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

        // Modern approach: Check for recovery token in query params first
        const token = urlParams.get('token');
        const type = urlParams.get('type');
        const code = urlParams.get('code'); // Newer Supabase versions use 'code'
        
        console.log("URL parameters:", { 
          hasToken: !!token,
          hasCode: !!code,
          type
        });

        // Handle modern Supabase auth flow with 'code' parameter
        if (code && (type === "recovery" || type === "passwordRecovery" || !type)) {
          try {
            console.log("Verifying with OTP code");
            
            // For recovery flow, we need to use token_hash instead of token to match Supabase's expected parameters
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
            }
          } catch (error: any) {
            console.error("Error verifying recovery code:", error);
            setError(`Invalid or expired password reset link. Please request a new one. (${error.message})`);
            setLoading(false);
            return;
          }
        }
        
        // Handle legacy token in query params
        if (token && (type === "recovery" || type === "passwordRecovery" || !type)) {
          try {
            console.log("Verifying with token_hash");
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: "recovery"
            });
            
            if (verifyError) {
              console.error("Error verifying token_hash:", verifyError);
              throw verifyError;
            }
            
            if (data?.session) {
              console.log("Successfully verified token and created session");
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
        
        // Handle hash fragment (older Supabase approach)
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          const hashType = hashParams.get("type");
          
          console.log("Hash parameters:", { 
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hashType
          });
          
          if (accessToken && (hashType === "recovery" || !hashType)) {
            console.log("Setting session with access token from hash");
            
            // Sign out any current user to ensure we're in a clean state
            await supabase.auth.signOut();
            
            try {
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || "",
              });
              
              if (error) {
                console.error("Error setting session from hash:", error);
                setError(`Invalid or expired password reset link. Please request a new one. (${error.message})`);
              } else if (data?.session) {
                console.log("Successfully set session from hash with user:", data.user?.email);
                setValidResetFlow(true);
                setLoading(false);
                return;
              } else {
                console.error("No session established from hash");
                setError("Invalid or expired password reset link. Please request a new one. (No session established)");
              }
            } catch (err: any) {
              console.error("Exception during hash recovery flow:", err);
              setError(`An unexpected error occurred: ${err?.message || "Unknown error"}. Please try again.`);
              setLoading(false);
              return;
            }
          }
        }
        
        // As a last resort, check if we already have an active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Found existing session, checking if it's a recovery session");
          const isRecoverySession = session?.user?.aud === 'recovery'; // This check might not be reliable
          setValidResetFlow(true);
          setLoading(false);
          return;
        }
        
        // No valid reset flow found
        console.error("No valid recovery token, code, or session found");
        setError("Invalid or expired password reset link. Please request a new password reset link.");
        
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
