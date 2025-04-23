
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Calendar, Users, Code, Send } from "lucide-react";

export function CampaignEditor() {
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [sender, setSender] = useState("you@example.com");
  const [replyTo, setReplyTo] = useState("you@example.com");
  const [content, setContent] = useState("<h1>Hello, {{name}}!</h1><p>This is your newsletter content.</p>");
  const [selectedList, setSelectedList] = useState("");

  // These would be fetched from API in a real app
  const subscriberLists = [
    { id: "all", name: "All Subscribers" },
    { id: "active", name: "Active Subscribers" },
    { id: "new", name: "New Subscribers" },
    { id: "vip", name: "VIP Customers" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Campaign</h2>
        <div className="flex gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send or Schedule
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Content</CardTitle>
                  <CardDescription>
                    Design your email using our drag-and-drop editor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-6 min-h-[400px] flex items-center justify-center bg-muted text-muted-foreground">
                    <div className="text-center">
                      <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="mb-2">Drag and drop components to build your email</p>
                      <p className="text-sm">(WYSIWYG editor would be integrated here)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="code">
              <Card>
                <CardHeader>
                  <CardTitle>HTML Editor</CardTitle>
                  <CardDescription>
                    Edit the HTML code directly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    className="min-h-[400px] font-mono text-sm"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Email Preview</CardTitle>
                  <CardDescription>
                    Preview how your email will look to recipients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-6 min-h-[400px]">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Weekly Newsletter"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="Enter a subject line"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sender">From</Label>
                <Input
                  id="sender"
                  placeholder="your@email.com"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reply-to">Reply-To</Label>
                <Input
                  id="reply-to"
                  placeholder="your@email.com"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subscriber-list">Subscriber List</Label>
                <Select value={selectedList} onValueChange={setSelectedList}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a list" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriberLists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedList === "all" 
                    ? "14,526 recipients"
                    : selectedList === "active"
                    ? "12,450 recipients" 
                    : selectedList === "new"
                    ? "267 recipients"
                    : selectedList === "vip"
                    ? "578 recipients"
                    : "Select a list"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
