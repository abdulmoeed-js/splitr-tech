import { SignIn, SignUp, useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthWrapper = ({ children, requireAuth = true }: AuthWrapperProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoaded && !isSignedIn && requireAuth) {
      navigate("/login");
    }
  }, [isLoaded, isSignedIn, requireAuth, navigate]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!isSignedIn && requireAuth) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export const SignInPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Split Buddy
      </h1>
      <div className="glass-panel w-full max-w-md p-8">
        <SignIn 
          routing="path" 
          path="/login" 
          signUpUrl="/signup"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "glass-panel border-none shadow-none",
              headerTitle: "text-2xl font-bold text-primary",
              headerSubtitle: "text-gray-500",
              formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-full",
            }
          }}
        />
      </div>
    </div>
  );
};

export const SignUpPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Split Buddy
      </h1>
      <div className="glass-panel w-full max-w-md p-8">
        <SignUp 
          routing="path" 
          path="/signup" 
          signInUrl="/login"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "glass-panel border-none shadow-none",
              headerTitle: "text-2xl font-bold text-primary",
              headerSubtitle: "text-gray-500",
              formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-full",
            }
          }}
        />
      </div>
    </div>
  );
};
