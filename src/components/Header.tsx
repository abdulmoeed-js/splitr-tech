
import { useAuth, UserButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, User } from "lucide-react";

export const Header = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b">
      <div className="container max-w-2xl py-4 px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Split Buddy
        </Link>
        
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : isSignedIn ? (
            <>
              <nav className="hidden sm:flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/">
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-1" />
                    Profile
                  </Link>
                </Button>
              </nav>
              <UserButton afterSignOutUrl="/login" />
            </>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
