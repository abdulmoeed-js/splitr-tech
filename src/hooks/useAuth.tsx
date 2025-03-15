
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth listeners");
    
    // Get initial session and set up auth state change listener
    const fetchInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session fetch complete, user authenticated:", !!initialSession?.user);
        setSession(initialSession);
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, "Session exists:", !!currentSession);
        setSession(currentSession);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log("User signed in successfully");
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out successfully");
        }
      }
    );

    return () => {
      console.log("Cleaning up auth listeners");
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    console.log("Sign out requested");
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      
      console.log("Signed out successfully");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Error in sign out process:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "An error occurred while signing out",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log("useAuth hook returning:", { 
    isAuthenticated: !!session, 
    loading, 
    userId: session?.user?.id 
  });

  return {
    session,
    loading,
    isAuthenticated: !!session,
    user: session?.user ?? null,
    handleSignOut,
  };
};
