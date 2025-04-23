
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
  Calendar,
  Check,
  Edit,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sent" | "archived";
  recipients: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
  sentAt?: string;
};

const fakeCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Weekly Newsletter",
    subject: "This Week's Top Stories and Updates",
    status: "sent",
    recipients: 14350,
    openRate: 42.8,
    clickRate: 6.2,
    createdAt: "2023-04-15",
    sentAt: "2023-04-16",
  },
  {
    id: "2",
    name: "Product Update",
    subject: "Exciting New Features Now Available",
    status: "sent",
    recipients: 12180,
    openRate: 35.1,
    clickRate: 3.7,
    createdAt: "2023-04-10",
    sentAt: "2023-04-12",
  },
  {
    id: "3",
    name: "Special Offer",
    subject: "Limited Time: 25% Off All Products",
    status: "sent",
    recipients: 15600,
    openRate: 28.5,
    clickRate: 4.1,
    createdAt: "2023-04-05",
    sentAt: "2023-04-06",
  },
  {
    id: "4",
    name: "Product Launch",
    subject: "Introducing Our New Premium Service",
    status: "scheduled",
    recipients: 15200,
    openRate: 0,
    clickRate: 0,
    createdAt: "2023-04-18",
  },
  {
    id: "5",
    name: "Summer Promotion",
    subject: "Get Ready for Summer with These Deals",
    status: "draft",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: "2023-04-20",
  },
];

const statusColors = {
  draft: "text-muted-foreground bg-muted",
  scheduled: "text-brand-800 bg-brand-100",
  sent: "text-success-700 bg-success-100",
  archived: "text-warning-700 bg-warning-100",
};

export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>(fakeCampaigns);

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || campaign.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">
            Create, manage, and track your email campaigns
          </p>
        </div>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Create Campaign</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedStatus("all")}>
            All Campaigns
          </TabsTrigger>
          <TabsTrigger value="draft" onClick={() => setSelectedStatus("draft")}>
            Drafts
          </TabsTrigger>
          <TabsTrigger value="scheduled" onClick={() => setSelectedStatus("scheduled")}>
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="sent" onClick={() => setSelectedStatus("sent")}>
            Sent
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Campaigns</CardTitle>
                  <CardDescription>
                    View and manage all your email campaigns
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search campaigns..."
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length > 0 ? (
                    filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{campaign.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {campaign.subject}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusColors[campaign.status]}
                          >
                            {campaign.status.charAt(0).toUpperCase() +
                              campaign.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {campaign.recipients.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {campaign.openRate > 0
                            ? `${campaign.openRate}%`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {campaign.clickRate > 0
                            ? `${campaign.clickRate}%`
                            : "-"}
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
                                <Mail className="mr-2 h-4 w-4" />
                                {campaign.status === "draft" || campaign.status === "scheduled"
                                  ? "Send Now"
                                  : "Resend"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule
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
                          <AlertCircle className="h-8 w-8 mb-2" />
                          <p>No campaigns found</p>
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
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          {/* Similar content structure as "all" tab, but filtered for drafts */}
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          {/* Similar content structure as "all" tab, but filtered for scheduled */}
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4">
          {/* Similar content structure as "all" tab, but filtered for sent */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
