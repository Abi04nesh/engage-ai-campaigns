
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AuthUser } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load session from Supabase on initial render
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session);
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata.name || '',
            createdAt: new Date(session.user.created_at || '').toISOString()
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Got existing session:", session);
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.name || '',
          createdAt: new Date(session.user.created_at || '').toISOString()
        };
        setUser(authUser);
      }
      setIsLoading(false);
    }).catch(err => {
      console.error("Error getting session:", err);
      setIsLoading(false);
    });
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        // Handle specific error for unconfirmed email
        if (authError.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link before logging in.",
            variant: "destructive",
          });
          
          // Offer to resend the confirmation email
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email
          });
          
          if (!resendError) {
            toast({
              title: "Verification Email Resent",
              description: "We've resent the verification email. Please check your inbox.",
            });
          }
        } else {
          throw authError;
        }
        return false;
      }
      
      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || '',
          createdAt: new Date(data.user.created_at || '').toISOString()
        };
        
        setUser(authUser);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${authUser.name || authUser.email}!`,
        });
        return true;
      }
      
      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (authError) throw authError;
      
      if (data.user) {
        // Show verification email sent message
        toast({
          title: "Signup Successful",
          description: "Please check your email to verify your account before logging in.",
        });
        
        // Don't log the user in automatically if email verification is required
        if (data.session) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || '',
            name: name,
            createdAt: new Date(data.user.created_at || '').toISOString()
          };
          
          setUser(authUser);
        }
        
        return true;
      }
      
      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Logout failed';
      toast({
        title: "Logout Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Handle password reset functionality
  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password',
      });
      
      if (error) throw error;
      
      toast({
        title: "Reset Email Sent",
        description: "Check your email for the password reset link.",
      });
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send reset password email';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Function to resend verification email
  const resendVerificationEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification Email Resent",
        description: "Please check your inbox for the verification link.",
      });
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to resend verification email';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    resendVerificationEmail
  };
};
