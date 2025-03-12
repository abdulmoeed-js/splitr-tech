
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Home, User, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

export const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b">
      <div className="container max-w-2xl py-4 px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Splitr
        </Link>
        
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session ? (
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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
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
