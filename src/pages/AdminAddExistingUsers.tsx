
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, ArrowLeft, UserPlus } from "lucide-react";
import { getNonMembers, addMemberDirectly } from "@/services/memberService";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Profile } from "@/types/supabase";

const AdminAddExistingUsers = () => {
  const { user, adminProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !adminProfile)) {
      navigate("/admin/auth");
    }
  }, [user, adminProfile, authLoading, navigate]);

  // Fetch non-member users
  const { data: nonMembers, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['nonMembers'],
    queryFn: getNonMembers,
    enabled: !!user && !!adminProfile,
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: (userData: { id: string, email: string, username: string, fullName: string }) => 
      addMemberDirectly(userData.email, userData.username || userData.email.split('@')[0], userData.fullName || "Member"),
    onSuccess: () => {
      toast.success("Member added successfully");
      queryClient.invalidateQueries({ queryKey: ['nonMembers'] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      refetchUsers();
    },
    onError: (error: any) => {
      console.error("Add member error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add member. Please try again.");
      }
    },
  });

  const handleAddMember = (userData: Profile) => {
    addMemberMutation.mutate({
      id: userData.id,
      email: userData.email || "",
      username: userData.username || "",
      fullName: userData.full_name || ""
    });
  };

  // Filter users based on search term
  const filteredUsers = nonMembers ? nonMembers.filter(user => 
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

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
          { label: "Members", href: "/admin/members" },
          { label: "Add Existing Users" }
        ]} 
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add Existing Users</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/members")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Non-Member Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {usersLoading ? (
            <div className="py-8 text-center">Loading users...</div>
          ) : filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((nonMember) => (
                  <TableRow key={nonMember.id}>
                    <TableCell>{nonMember.full_name || 'N/A'}</TableCell>
                    <TableCell>{nonMember.email || 'N/A'}</TableCell>
                    <TableCell>{nonMember.username || 'N/A'}</TableCell>
                    <TableCell>
                      {nonMember.created_at ? format(new Date(nonMember.created_at), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleAddMember(nonMember)}
                        disabled={addMemberMutation.isPending && addMemberMutation.variables?.id === nonMember.id}
                      >
                        <UserPlus className="h-3 w-3" />
                        {addMemberMutation.isPending && addMemberMutation.variables?.id === nonMember.id 
                          ? "Adding..." 
                          : "Add as Member"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {searchTerm 
                ? "No users found matching your search." 
                : "No non-member users found in the system."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAddExistingUsers;
