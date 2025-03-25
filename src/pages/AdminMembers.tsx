
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Mail, UserPlus, Users, Upload, RefreshCcw } from "lucide-react";
import { listInvitations } from "@/services/invitationService";
import { getMembers } from "@/services/memberService";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import MemberList from "@/components/members/MemberList";
import InvitationList from "@/components/members/InvitationList";
import InviteForm from "@/components/members/InviteForm";
import BulkUploadDialog from "@/components/members/BulkUploadDialog";

const AdminMembers = () => {
  const { user, adminProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !adminProfile)) {
      navigate("/admin/auth");
    }
  }, [user, adminProfile, authLoading, navigate]);

  // Fetch invitations
  const { 
    data: invitations, 
    isLoading: invitationsLoading, 
    error: invitationsError,
    refetch: refetchInvitations
  } = useQuery({
    queryKey: ['invitations'],
    queryFn: listInvitations,
    enabled: !!user && !!adminProfile,
    refetchInterval: 15000, // Refetch every 15 seconds
    refetchOnWindowFocus: true,
  });

  // Log errors for debugging
  useEffect(() => {
    if (invitationsError) {
      console.error("Error fetching invitations:", invitationsError);
    }
  }, [invitationsError]);

  // Fetch members
  const { 
    data: members, 
    isLoading: membersLoading,
    refetch: refetchMembers
  } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
    enabled: !!user && !!adminProfile,
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  const handleRefresh = () => {
    refetchMembers();
    refetchInvitations();
    toast.success("Data refreshed");
  };

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
        <h1 className="text-3xl font-bold">Member Management</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="ml-auto mr-2"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Members</CardTitle>
            <CardDescription>Invite new members or add existing users to your community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setInviteOpen(true)} 
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                <span>Send Invitation</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin/add-existing-users")} 
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Existing Users</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setBulkUploadOpen(true)} 
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Current Members
          </h2>
          <MemberList members={members} isLoading={membersLoading} />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Invitation History
          </h2>
          <InvitationList invitations={invitations} isLoading={invitationsLoading} />
        </div>
      </div>

      {/* Dialogs */}
      <InviteForm open={inviteOpen} onOpenChange={setInviteOpen} onSuccess={refetchInvitations} />
      <BulkUploadDialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen} />
    </div>
  );
};

export default AdminMembers;
