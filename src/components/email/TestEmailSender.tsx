
import { useState } from "react";
import { useEmailSender } from "@/hooks/useEmailSender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TestEmailSender() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("<p>This is a test email sent from EngageAI.</p>");
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const { sendEmail, isSending } = useEmailSender();

  const handleSendTestEmail = async () => {
    if (!recipient || !subject || !content) {
      setErrorInfo("All fields must be filled out");
      return;
    }

    setDebugInfo("Starting email send process...");
    setErrorInfo(null);

    try {
      setDebugInfo("Calling sendEmail function...");
      const result = await sendEmail({
        to: recipient,
        subject,
        html: content
      });

      if (result.success) {
        setDebugInfo(`Email sent successfully: ${JSON.stringify(result.data, null, 2)}`);
      } else {
        setErrorInfo(`Failed to send email: ${JSON.stringify(result.error, null, 2)}`);
      }
    } catch (error) {
      setErrorInfo(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      console.error("Test email sender error:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Send Test Email</CardTitle>
        <CardDescription>Test your email configuration by sending a test message</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorInfo && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-xs">
              {errorInfo}
            </AlertDescription>
          </Alert>
        )}
        
        {debugInfo && (
          <Alert>
            <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-xs">
              {debugInfo}
            </AlertDescription>
          </Alert>
        )}
        
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
      <CardFooter className="flex flex-col items-start space-y-4">
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
        
        <Alert className="w-full">
          <AlertDescription className="text-xs">
            <p>For troubleshooting:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Make sure your Resend API key is correctly set in Supabase</li>
              <li>Verify that your Resend account is active</li>
              <li>Check if the email domain is verified in Resend</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
}
