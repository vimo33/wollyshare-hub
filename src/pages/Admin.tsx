
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const { user, adminProfile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not an admin
    if (!isLoading && (!user || !adminProfile)) {
      navigate("/admin/auth");
    }
  }, [user, adminProfile, isLoading, navigate]);

  if (isLoading) {
    return <div className="container mx-auto mt-12 p-4">Loading...</div>;
  }

  if (!user || !adminProfile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto mt-12 p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Create and manage invitations for new members.</p>
            <Button onClick={() => navigate("/admin/invitations")}>
              Manage Invitations
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Username: {adminProfile.username}</p>
            <p>Name: {adminProfile.full_name}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
