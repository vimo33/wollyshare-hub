
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MembersTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default MembersTab;
