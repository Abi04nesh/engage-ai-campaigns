import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ImportSubscribers } from "@/components/subscribers/ImportSubscribers";
import { SubscriberStats } from "@/components/subscribers/SubscriberStats";
import { SubscriberFilters } from "@/components/subscribers/SubscriberFilters";
import { SubscribersTable } from "@/components/subscribers/SubscribersTable";

const fakeSubscribers = [
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

export default function Subscribers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [subscribers] = useState(fakeSubscribers);

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
          <ImportSubscribers />
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Subscriber</span>
          </Button>
        </div>
      </div>

      <SubscriberStats />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscriber List</CardTitle>
              <CardDescription>
                View and manage your subscribers
              </CardDescription>
            </div>
            <SubscriberFilters
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              onSearchChange={setSearchTerm}
              onStatusChange={setSelectedStatus}
            />
          </div>
        </CardHeader>
        <CardContent>
          <SubscribersTable subscribers={filteredSubscribers} />
        </CardContent>
      </Card>
    </div>
  );
}
