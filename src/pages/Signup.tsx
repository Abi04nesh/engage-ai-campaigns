
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext } from "@/App";
import { Helmet } from "react-helmet-async";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { signup, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match!");
      return;
    }
    
    if (!acceptTerms) {
      setPasswordError("Please accept the terms and conditions");
      return;
    }
    
    const success = await signup(fullName, email, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | EngageAI</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-brand-100 p-3">
                <Mail className="h-6 w-6 text-brand-700" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500">{passwordError}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-brand-500 hover:text-brand-700">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-brand-500 hover:text-brand-700">
                      privacy policy
                    </Link>
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-500 hover:text-brand-700 font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
