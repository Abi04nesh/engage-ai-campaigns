
import { useState } from "react";
import { useEmailSender } from "@/hooks/useEmailSender";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TestEmailSender() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("<p>This is a test email sent from EngageAI.</p>");
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const { sendEmail, isSending, lastResponse } = useEmailSender();

  const handleSendTestEmail = async () => {
    if (!recipient || !subject || !content) {
      setErrorInfo("All fields must be filled out");
      return;
    }

    setDebugInfo("Starting email send process...");
    setErrorInfo(null);
    setSuccessInfo(null);

    try {
      setDebugInfo("Calling sendEmail function...");
      const result = await sendEmail({
        to: recipient,
        subject,
        html: content
      });

      if (result.success) {
        setDebugInfo(`Email request processed. Response: ${JSON.stringify(result.data, null, 2)}`);
        setSuccessInfo("Email request processed successfully. Note that with Resend free tier, emails might be delayed or filtered if you're not using a verified domain.");
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
        
        {successInfo && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-xs text-green-700">
              {successInfo}
            </AlertDescription>
          </Alert>
        )}
        
        {debugInfo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-xs">
              {debugInfo}
            </AlertDescription>
          </Alert>
        )}
        
        {lastResponse && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-xs">
              <strong>Last API Response:</strong>
              <pre className="mt-2 bg-blue-100 p-2 rounded">
                {JSON.stringify(lastResponse, null, 2)}
              </pre>
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
          className="w-full md:w-auto"
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
              <li>With Resend free tier, you must use <code>onboarding@resend.dev</code> as the sender</li>
              <li>Check if emails are being delivered to your spam folder</li>
              <li>Check the Supabase edge function logs for detailed error messages</li>
              <li>Resend has delivery limits on free accounts - check the quota on your dashboard</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
}
