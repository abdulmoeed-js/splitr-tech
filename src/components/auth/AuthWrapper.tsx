
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Ensure auth state is properly loaded before making decisions
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 1000); // Increased from 500ms to 1000ms to ensure auth is properly loaded
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading state while we're checking authentication
  if (loading || isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading your information...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Only show the toast if we're not already on the login page
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      toast({
        title: "Authentication Required",
        description: "Please log in to view this page",
        variant: "destructive",
      });
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render children
  return <>{children}</>;
};
