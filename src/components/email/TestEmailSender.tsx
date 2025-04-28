
import { useState } from "react";
import { sendEmail } from "@/utils/email/emailService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, AlertCircle, Info, CheckCircle, Key } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TestEmailSender() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("<p>This is a test email sent from EngageAI.</p>");
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const handleSendTestEmail = async () => {
    if (!recipient || !subject || !content) {
      setErrorInfo("All fields must be filled out");
      return;
    }

    setIsSending(true);
    setDebugInfo("Starting email send process...");
    setErrorInfo(null);
    setSuccessInfo(null);

    try {
      setDebugInfo("Calling AWS SES email function...");
      const result = await sendEmail({
        to: recipient,
        subject,
        html: content
      });

      setLastResponse(result);
      setIsSending(false);

      if (result.success) {
        setDebugInfo(`Email request processed. Response: ${JSON.stringify(result.data, null, 2)}`);
        setSuccessInfo("Email request processed successfully. Check your inbox for the email.");
      } else {
        // Check for AWS credentials error
        if (result.error?.message?.includes("credentials")) {
          setErrorInfo(`AWS credentials error: Please check that you've set the correct AWS access keys in Supabase Edge Function Secrets.`);
        } else if (result.error?.name === "MessageRejected") {
          setErrorInfo(`Email rejected: ${result.error.message}. Make sure your sender email is verified in AWS SES.`);
        } else {
          setErrorInfo(`Failed to send email: ${JSON.stringify(result.error, null, 2)}`);
        }
      }
    } catch (error) {
      setIsSending(false);
      setErrorInfo(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      console.error("Test email sender error:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Send Test Email</CardTitle>
        <CardDescription>Test your AWS SES email configuration by sending a test message</CardDescription>
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
        
        {lastResponse?.data?.error?.name === "CredentialsError" && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <Key className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-xs text-yellow-700">
              <strong>AWS Credentials Error</strong>
              <p className="mt-1">AWS access keys appear to be invalid or missing. Please make sure you have:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Added the AWS_ACCESS_KEY_ID to Supabase Edge Function Secrets</li>
                <li>Added the AWS_SECRET_KEY_ID to Supabase Edge Function Secrets</li>
                <li>Verified the sender email address in AWS SES</li>
                <li>Properly set up your AWS SES account</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {lastResponse && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-xs">
              <strong>Last API Response:</strong>
              <pre className="mt-2 bg-blue-100 p-2 rounded overflow-auto max-h-40">
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
            <p>For troubleshooting AWS SES email sending:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>Make sure your AWS access keys are correctly set in Supabase Edge Function Secrets</li>
              <li>Verify that the sender email address is verified in AWS SES</li>
              <li>If you're in the AWS SES sandbox, recipient emails must also be verified</li>
              <li>Check if your AWS SES account is active and has sending permissions</li>
              <li>Check the Supabase edge function logs for detailed error messages</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
}
