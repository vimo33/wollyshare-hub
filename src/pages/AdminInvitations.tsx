
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvitation, listInvitations } from "@/services/invitationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Mail, Plus, Upload } from "lucide-react";
import { format } from "date-fns";
import AdminBreadcrumb from "@/components/AdminBreadcrumb";

// Form validation schema
const inviteFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

const AdminInvitations = () => {
  const { user, adminProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  // Redirect if not admin
  React.useEffect(() => {
    if (!authLoading && (!user || !adminProfile)) {
      navigate("/admin/auth");
    }
  }, [user, adminProfile, authLoading, navigate]);

  // Fetch invitations
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['invitations'],
    queryFn: listInvitations,
    enabled: !!user && !!adminProfile,
  });

  // Create invitation mutation
  const createInviteMutation = useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      toast.success("Invitation sent successfully");
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    onError: (error) => {
      toast.error("Failed to send invitation: " + error);
    },
  });

  // Form setup
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: InviteFormValues) => {
    createInviteMutation.mutate(data.email);
    form.reset();
  };

  // Handle bulk upload (placeholder function - will be implemented)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    toast.info("CSV upload feature will be implemented soon");
    // Reset the file input
    event.target.value = '';
    setBulkUploadOpen(false);
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
          { label: "Member Invitations" }
        ]} 
      />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Member Invitations</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Invite New Member</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a New Member</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="member@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={createInviteMutation.isPending}
                      className="w-full"
                    >
                      {createInviteMutation.isPending ? "Sending..." : "Send Invitation"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Upload Invitations</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload">Upload CSV/XLS File</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    File should have a column for email addresses.
                  </p>
                  <Input 
                    id="csv-upload" 
                    type="file" 
                    accept=".csv,.xls,.xlsx" 
                    onChange={handleFileUpload}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                >
                  Select File
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitation History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Loading invitations...</div>
          ) : invitations && invitations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Sent</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {invitation.email}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invitation.is_used 
                          ? "bg-green-100 text-green-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {invitation.is_used ? "Used" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>{format(new Date(invitation.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{invitation.expires_at ? format(new Date(invitation.expires_at), 'MMM d, yyyy') : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No invitations have been sent yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvitations;
