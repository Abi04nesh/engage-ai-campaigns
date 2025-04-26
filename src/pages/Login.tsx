
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, KeyRound } from "lucide-react";
import { useAuthContext } from "@/App";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const { login, isLoading, resendVerificationEmail } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setNeedsVerification(false);
    
    const success = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      // Check if we need to show verification option (this will be caught in useAuth and handled)
      const authError = document.querySelector('.destructive') as HTMLElement;
      if (authError && authError.textContent?.includes('Email not confirmed')) {
        setNeedsVerification(true);
      }
    }
  };

  const handleResendVerification = async () => {
    if (email) {
      await resendVerificationEmail(email);
    } else {
      setErrorMessage("Please enter your email address");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | EngageAI</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-brand-100 p-3">
                <Mail className="h-6 w-6 text-brand-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {needsVerification && (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <AlertDescription className="text-amber-800">
                  <div className="flex flex-col gap-2">
                    <p>Your email is not yet verified. Please check your inbox for the verification email.</p>
                    <Button 
                      variant="outline" 
                      className="mt-2 border-amber-300 text-amber-800 hover:bg-amber-100"
                      onClick={handleResendVerification}
                      disabled={isLoading}
                    >
                      Resend Verification Email
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {errorMessage && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}
            
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-700 font-medium"
              >
                Create an account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
