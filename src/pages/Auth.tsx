
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "react-router-dom";
import { verifyInvitation } from "@/services/invitationService";
import PendingApprovalModal from "@/components/auth/PendingApprovalModal";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get("token");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in but not approved, show approval modal
    if (user && profile && !profile.is_member) {
      setShowApprovalModal(true);
      return;
    }
    
    // Redirect approved users to home
    if (user && profile && profile.is_member) {
      navigate("/");
      return;
    }

    // Verify invitation token if present
    if (invitationToken && !tokenChecked) {
      const checkToken = async () => {
        const isValid = await verifyInvitation(invitationToken);
        setTokenValid(isValid);
        setTokenChecked(true);
        
        // If token is valid, show signup form
        if (isValid) {
          setIsLogin(false);
        }
      };
      
      checkToken();
    } else if (!invitationToken) {
      setTokenChecked(true);
    }
  }, [user, navigate, invitationToken, tokenChecked, profile]);

  const toggleForm = () => setIsLogin(!isLogin);

  // Show approval modal for users who aren't yet approved members
  if (user && profile && !profile.is_member) {
    return (
      <div className="container max-w-md mx-auto mt-12 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Pending Approval</CardTitle>
            <CardDescription>
              Your account is waiting for admin approval
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Please contact an admin on Telegram for approval.
            </p>
            <PendingApprovalModal 
              isOpen={showApprovalModal} 
              onClose={() => setShowApprovalModal(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitationToken && !tokenChecked) {
    return (
      <div className="container max-w-md mx-auto mt-12 p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Verifying invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto mt-12 p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Welcome back to WollyShare" 
              : "Join WollyShare community"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitationToken && tokenValid === false && (
            <Alert className="mb-4">
              <AlertDescription>
                The invitation link is invalid or has expired. Please contact an administrator.
              </AlertDescription>
            </Alert>
          )}
          
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm invitationToken={tokenValid ? invitationToken : undefined} />
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleForm} 
              className="text-primary hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
