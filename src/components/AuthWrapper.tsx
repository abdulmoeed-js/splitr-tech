
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "./Logo";

// Common authentication layout
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container max-w-md py-10">
      <div className="flex justify-center mb-6">
        <Logo className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-8">Splitr</h1>
      {children}
    </div>
  );
};

// Sign In Page Component
export const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back to Splitr!"
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="p-6 shadow-lg glass-panel">
        <Tabs defaultValue="email">
          <TabsList className="w-full mb-4">
            <TabsTrigger className="flex-1" value="email">Email</TabsTrigger>
            <TabsTrigger className="flex-1" value="magic" disabled>Magic Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-primary">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary font-medium">
              Sign up
            </a>
          </p>
        </div>
      </Card>
    </AuthLayout>
  );
};

// Sign Up Page Component
export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account."
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error.message || "Please try again with a different email"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="p-6 shadow-lg glass-panel">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-primary font-medium">
              Sign in
            </a>
          </p>
        </div>
      </Card>
    </AuthLayout>
  );
};

// Protected Route Wrapper
export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};
