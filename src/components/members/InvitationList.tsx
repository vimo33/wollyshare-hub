
import React from "react";
import { format } from "date-fns";
import { Mail } from "lucide-react";
import { Invitation } from "@/types/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

interface InvitationListProps {
  invitations: Invitation[] | undefined;
  isLoading: boolean;
}

const InvitationList: React.FC<InvitationListProps> = ({ invitations, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Invitation History
        </CardTitle>
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
  );
};

export default InvitationList;
