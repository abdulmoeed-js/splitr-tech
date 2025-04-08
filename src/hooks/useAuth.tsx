
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
    
    // Set up auth state listener FIRST
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, "Session exists:", !!currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          
          // Handle specific auth events
          if (event === 'SIGNED_IN') {
            console.log("User signed in successfully");
            navigate("/");
          }
        } else {
          setSession(null);
          
          if (event === 'SIGNED_OUT') {
            console.log("User signed out successfully");
            navigate("/login");
          }
        }
      }
    );

    // THEN get initial session
    const fetchInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session fetch complete, user authenticated:", !!initialSession?.user);
        
        if (initialSession) {
          console.log("Found existing session, user is authenticated");
          setSession(initialSession);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSession();
    
    return () => {
      console.log("Cleaning up auth listeners");
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

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
      
      // Clear session state
      setSession(null);
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

  // Function to clear user data
  const clearUserData = async () => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "You must be logged in to clear your data",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("clear-user-data", {
        body: { user_id: session.user.id },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Data cleared",
        description: "Your data has been cleared successfully. Please refresh the page.",
      });
    } catch (error: any) {
      console.error("Error clearing user data:", error);
      toast({
        variant: "destructive",
        title: "Error clearing data",
        description: error.message || "An error occurred while clearing your data",
      });
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
    clearUserData,
  };
};
