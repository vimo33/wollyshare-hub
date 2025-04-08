
import React from "react";
import { format } from "date-fns";
import { UserMinus, Users } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Profile } from "@/types/supabase";
import { deleteMember } from "@/services/memberService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MemberListProps {
  members: Profile[] | undefined;
  isLoading: boolean;
}

const MemberList: React.FC<MemberListProps> = ({ members, isLoading }) => {
  const queryClient = useQueryClient();
  const [memberToDelete, setMemberToDelete] = React.useState<string | null>(null);

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      toast.success("Member and their items removed successfully");
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setMemberToDelete(null);
    },
    onError: (error) => {
      toast.error("Failed to remove member: " + error);
    },
  });

  const handleDeleteMember = (memberId: string) => {
    setMemberToDelete(memberId);
  };

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      deleteMemberMutation.mutate(memberToDelete);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Member List
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">Loading members...</div>
        ) : members && members.length > 0 ? (
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
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.full_name || 'N/A'}</TableCell>
                  <TableCell>{member.email || 'N/A'}</TableCell>
                  <TableCell>{member.username || 'N/A'}</TableCell>
                  <TableCell>
                    {member.created_at ? format(new Date(member.created_at), 'MMM d, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <UserMinus className="h-3 w-3" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove member and their items?</AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <p>This will revoke membership access for this user. They will no longer be able to access member features.</p>
                            <p className="font-medium text-destructive">All items created by this member will also be permanently deleted.</p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDeleteMember}>
                            Remove Member
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No members yet. Start by inviting someone!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberList;
