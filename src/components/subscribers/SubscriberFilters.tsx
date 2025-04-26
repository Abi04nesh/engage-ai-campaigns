
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriberFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function SubscriberFilters({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: SubscriberFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search subscribers..."
          className="pl-8 w-64"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={selectedStatus}
        onValueChange={onStatusChange}
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
  );
}
