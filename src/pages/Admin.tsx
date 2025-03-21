
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users } from "lucide-react";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";

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
    <div className="container mx-auto pt-8 pb-12 px-4">
      <AdminBreadcrumb items={[]} /> {/* Empty items for the main dashboard */}
      
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="community" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Community Settings</span>
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Member Invitations</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Community Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/admin/community-settings")}
                className="mb-4"
              >
                Manage Community Settings
              </Button>
              <p className="text-muted-foreground text-sm">
                Edit your community logo, name, and manage buildings/locations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invitations">
          <Card>
            <CardHeader>
              <CardTitle>Manage Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/admin/members")}
              >
                Manage Members
              </Button>
              <p className="text-muted-foreground text-sm mt-2">
                Invite new members and manage existing member accounts.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
