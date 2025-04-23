
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowUpDown,
  Check,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  Upload,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Subscriber = {
  id: string;
  email: string;
  name: string;
  status: "active" | "unsubscribed" | "bounced" | "new";
  source: string;
  joinedAt: string;
  lastActivity?: string;
};

const fakeSubscribers: Subscriber[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    status: "active",
    source: "Website Form",
    joinedAt: "2023-01-15",
    lastActivity: "2023-04-18",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    status: "active",
    source: "Manual Import",
    joinedAt: "2023-02-20",
    lastActivity: "2023-04-20",
  },
  {
    id: "3",
    email: "robert.johnson@example.com",
    name: "Robert Johnson",
    status: "unsubscribed",
    source: "Website Form",
    joinedAt: "2023-01-05",
    lastActivity: "2023-03-10",
  },
  {
    id: "4",
    email: "emily.wilson@example.com",
    name: "Emily Wilson",
    status: "bounced",
    source: "API Integration",
    joinedAt: "2023-03-12",
    lastActivity: "2023-03-12",
  },
  {
    id: "5",
    email: "michael.brown@example.com",
    name: "Michael Brown",
    status: "active",
    source: "Landing Page",
    joinedAt: "2023-04-01",
    lastActivity: "2023-04-19",
  },
  {
    id: "6",
    email: "sarah.garcia@example.com",
    name: "Sarah Garcia",
    status: "active",
    source: "Website Form",
    joinedAt: "2023-03-22",
    lastActivity: "2023-04-21",
  },
  {
    id: "7",
    email: "alex.rodriguez@example.com",
    name: "Alex Rodriguez",
    status: "new",
    source: "Website Form",
    joinedAt: "2023-04-21",
  },
];

const statusColors = {
  active: "text-success-700 bg-success-100",
  unsubscribed: "text-warning-700 bg-warning-100",
  bounced: "text-danger-700 bg-danger-100",
  new: "text-brand-800 bg-brand-100",
};

export default function Subscribers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [subscribers, setSubscribers] = useState<Subscriber[]>(fakeSubscribers);

  // Filter subscribers based on search term and status
  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || subscriber.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscribers</h2>
          <p className="text-muted-foreground">
            Manage your subscriber lists and segments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Subscriber</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,526</div>
            <p className="text-xs text-muted-foreground">Across all lists</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">New Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+267</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unsubscribe Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.8%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscriber List</CardTitle>
              <CardDescription>
                View and manage your subscribers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search subscribers..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
