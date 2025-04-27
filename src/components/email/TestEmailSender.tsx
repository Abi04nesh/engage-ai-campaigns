
import { useState } from "react";
import { useEmailSender } from "@/hooks/useEmailSender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";

export function TestEmailSender() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("<p>This is a test email sent from EngageAI.</p>");
  const { sendEmail, isSending } = useEmailSender();

  const handleSendTestEmail = async () => {
    if (!recipient || !subject || !content) {
      return;
    }

    await sendEmail({
      to: recipient,
      subject,
      html: content
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Send Test Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Email</Label>
          <Input
            id="recipient"
            type="email"
            placeholder="recipient@example.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Email Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content (HTML)</Label>
          <Textarea
            id="content"
            placeholder="<p>Your email content here...</p>"
            className="min-h-[150px] font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSendTestEmail} 
          disabled={isSending || !recipient || !subject || !content}
        >
          {isSending ? "Sending..." : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Test Email
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
