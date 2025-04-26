
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SubscriberStats() {
  return (
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
  );
}
