
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowDown, ArrowUp, Mail, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Dashboard stat card component
function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: any;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 bg-brand-100 rounded-md flex items-center justify-center">
          <Icon className="h-4 w-4 text-brand-700" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <div className={`flex items-center mt-3 text-xs ${
          trend === "up" ? "text-success-500" : trend === "down" ? "text-danger-500" : "text-muted-foreground"
        }`}>
          {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : 
           trend === "down" ? <ArrowDown className="h-3 w-3 mr-1" /> : null}
          <span>{trendValue}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Campaign performance component
function CampaignPerformance() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>Recent campaign metrics and engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Weekly Newsletter</p>
                <p className="text-xs text-muted-foreground">Sent 3 days ago</p>
              </div>
              <div className="font-medium">42.8%</div>
            </div>
            <Progress value={42.8} className="h-2 mt-2" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Product Update</p>
                <p className="text-xs text-muted-foreground">Sent 1 week ago</p>
              </div>
              <div className="font-medium">35.1%</div>
            </div>
            <Progress value={35.1} className="h-2 mt-2" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Special Offer</p>
                <p className="text-xs text-muted-foreground">Sent 2 weeks ago</p>
              </div>
              <div className="font-medium">28.5%</div>
            </div>
            <Progress value={28.5} className="h-2 mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Recent activity component
function RecentActivity() {
  const activities = [
    { id: 1, action: "Campaign Sent", details: "Weekly Newsletter", time: "2 hours ago" },
    { id: 2, action: "New Subscriber", details: "john.doe@example.com", time: "5 hours ago" },
    { id: 3, action: "Campaign Edited", details: "Product Launch", time: "1 day ago" },
    { id: 4, action: "List Created", details: "VIP Customers", time: "2 days ago" },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions on your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center mr-3">
                <Activity className="h-4 w-4 text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.details}</p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your email marketing performance and analytics
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Subscribers" 
          value="14,526" 
          description="Active subscribers in your lists" 
          icon={Users} 
          trend="up" 
          trendValue="12% from last month"
        />
        <StatCard 
          title="Open Rate" 
          value="35.2%" 
          description="Average across all campaigns" 
          icon={Mail} 
          trend="down" 
          trendValue="3% from last month" 
        />
        <StatCard 
          title="Click Rate" 
          value="4.3%" 
          description="Average across all campaigns" 
          icon={Activity} 
          trend="up" 
          trendValue="2% from last month"
        />
        <StatCard 
          title="Campaigns Sent" 
          value="243" 
          description="Total campaigns sent" 
          icon={Mail} 
          trend="neutral" 
          trendValue="Same as last month"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CampaignPerformance />
        <RecentActivity />
      </div>
    </div>
  );
}
