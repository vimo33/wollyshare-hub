import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IncomingRequest } from "@/types/supabase";

interface IncomingRequestsTableProps {
  requests: IncomingRequest[];
  refreshRequests: () => void; // Add refresh function
}

const IncomingRequestsTable = ({ 
  requests,
  refreshRequests, // Include in props
}: IncomingRequestsTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableCaption>A list of your incoming requests.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Requester</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.requester_username}</TableCell>
              <TableCell>{request.item_name}</TableCell>
              <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                {/* Add action buttons here */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default IncomingRequestsTable;
