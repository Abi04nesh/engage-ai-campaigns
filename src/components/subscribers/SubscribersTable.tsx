
import { Check, Edit, MoreHorizontal, Trash, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Subscriber {
  id: string;
  email: string;
  name: string;
  status: "active" | "unsubscribed" | "bounced" | "new";
  source: string;
  joinedAt: string;
  lastActivity?: string;
}

interface SubscribersTableProps {
  subscribers: Subscriber[];
}

const statusColors = {
  active: "text-success-700 bg-success-100",
  unsubscribed: "text-warning-700 bg-warning-100",
  bounced: "text-danger-700 bg-danger-100",
  new: "text-brand-800 bg-brand-100",
};

export function SubscribersTable({ subscribers }: SubscribersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscribers.length > 0 ? (
          subscribers.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell className="font-medium">
                {subscriber.email}
              </TableCell>
              <TableCell>{subscriber.name || "-"}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={statusColors[subscriber.status]}
                >
                  {subscriber.status.charAt(0).toUpperCase() +
                    subscriber.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{subscriber.source}</TableCell>
              <TableCell>
                {new Date(subscriber.joinedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Check className="mr-2 h-4 w-4" />
                      {subscriber.status === "unsubscribed"
                        ? "Resubscribe"
                        : "Unsubscribe"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-24 text-center"
            >
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Users className="h-8 w-8 mb-2" />
                <p>No subscribers found</p>
                <p className="text-sm">
                  Try adjusting your search or filters
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
