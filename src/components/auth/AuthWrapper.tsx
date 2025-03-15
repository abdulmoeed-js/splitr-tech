
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Short timeout to ensure auth state is properly loaded
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading state while we're checking authentication
  if (loading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render children
  return <>{children}</>;
};
