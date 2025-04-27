
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
import { motion } from "framer-motion";

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center bg-background px-4"
      >
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="space-y-1 text-center">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-2"
            >
              <div className="rounded-full bg-brand-100 p-3">
                <Mail className="h-6 w-6 text-brand-700" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="transition-all duration-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-all duration-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all duration-200 focus:ring-brand-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="transition-all duration-200 focus:ring-brand-500"
                  />
                  {passwordError && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-500"
                    >
                      {passwordError}
                    </motion.p>
                  )}
                </div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
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
                </motion.div>
                <Button 
                  type="submit" 
                  className="w-full bg-brand-600 hover:bg-brand-700 transition-colors" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </motion.form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-center text-sm"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand-500 hover:text-brand-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}
