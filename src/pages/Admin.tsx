
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users } from "lucide-react";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CommunitySettingsTab from "@/components/admin/CommunitySettingsTab";
import MembersTab from "@/components/admin/MembersTab";

interface Location {
  id: string;
  name: string;
  address: string;
}

const Admin = () => {
  const { user, adminProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  useEffect(() => {
    // Redirect if not an admin
    if (!isLoading && (!user || !adminProfile)) {
      navigate("/admin/auth");
    }
  }, [user, adminProfile, isLoading, navigate]);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const { data, error } = await supabase
          .from('community_locations')
          .select('*');

        if (error) {
          console.error('Error fetching locations:', error);
          toast.error('Failed to load community locations');
        } else if (data) {
          setLocations(data as Location[]);
        }
      } catch (err) {
        console.error('Error in fetchLocations:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoadingLocations(false);
      }
    };

    if (user && adminProfile) {
      fetchLocations();
    }
  }, [user, adminProfile]);

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
          <CommunitySettingsTab 
            locations={locations} 
            isLoadingLocations={isLoadingLocations}
            setLocations={setLocations}
          />
        </TabsContent>
        
        <TabsContent value="invitations">
          <MembersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
