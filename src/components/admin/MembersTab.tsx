
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Mail } from "lucide-react";
import InviteForm from "@/components/members/InviteForm";
import AddMemberForm from "@/components/members/AddMemberForm";

const MembersTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Member Management
          </CardTitle>
          <CardDescription>
            Invite new members to your community and manage existing member accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <InviteForm />
              <AddMemberForm />
              <Button 
                variant="outline" 
                onClick={() => navigate("/admin/members")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                <span>View All Members</span>
              </Button>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Quick tips:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-primary/70" />
                  <span>Use "Invite Member" to send email invitations to new members</span>
                </li>
                <li className="flex items-start gap-2">
                  <UserPlus className="h-4 w-4 mt-0.5 text-primary/70" />
                  <span>Use "Add Member Directly" for users who already have accounts</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersTab;
