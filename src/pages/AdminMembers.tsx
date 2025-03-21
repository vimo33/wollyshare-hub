
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Mail, Users } from "lucide-react";
import { listInvitations } from "@/services/invitationService";
import { getMembers } from "@/services/memberService";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import MemberList from "@/components/members/MemberList";
import InvitationList from "@/components/members/InvitationList";
import InviteForm from "@/components/members/InviteForm";
import BulkUploadDialog from "@/components/members/BulkUploadDialog";

const AdminMembers = () => {
  const { user, adminProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !adminProfile)) {
      navigate("/admin/auth");
    }
  }, [user, adminProfile, authLoading, navigate]);

  // Fetch invitations
  const { data: invitations, isLoading: invitationsLoading, error: invitationsError } = useQuery({
    queryKey: ['invitations'],
    queryFn: listInvitations,
    enabled: !!user && !!adminProfile,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  // Log errors for debugging
  useEffect(() => {
    if (invitationsError) {
      console.error("Error fetching invitations:", invitationsError);
    }
  }, [invitationsError]);

  // Fetch members
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
    enabled: !!user && !!adminProfile,
  });

  if (authLoading) {
    return <div className="container mx-auto mt-12 p-4">Loading...</div>;
  }

  if (!user || !adminProfile) {
    return null;
  }

  return (
    <div className="container mx-auto pt-8 pb-12 px-4">
      <AdminBreadcrumb 
        items={[
          { label: "Members" }
        ]} 
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Members</h1>
        <div className="flex gap-2">
          <InviteForm />
          <BulkUploadDialog 
            open={bulkUploadOpen} 
            onOpenChange={setBulkUploadOpen} 
          />
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Current Members
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Invitations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <MemberList members={members} isLoading={membersLoading} />
        </TabsContent>
        
        <TabsContent value="invitations">
          <InvitationList invitations={invitations} isLoading={invitationsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMembers;
