import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This part remains the same since it uses Supabase's built-in functionality
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for the password reset link.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send reset password email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | EngageAI</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-brand-100 p-3">
                <Mail className="h-6 w-6 text-brand-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              {!isSubmitted 
                ? "Enter your email address and we'll send you a reset link"
                : "Check your email for a link to reset your password"}
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            </CardContent>
          ) : (
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                <p className="text-green-800">
                  If an account exists with the email you entered, we've sent you a password reset link.
                </p>
              </div>
            </CardContent>
          )}
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-brand-500 hover:text-brand-700 font-medium"
              >
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
