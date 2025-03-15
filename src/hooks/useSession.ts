
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const queryClient = useQueryClient();
  
  // Default name that works whether logged in or not
  const userName = session?.user?.email?.split('@')[0] || "You";
  
  useEffect(() => {
    console.log("Setting up session listeners in useSession hook");
    
    // Fetch initial session immediately to prevent flickering
    const fetchSession = async () => {
      console.log("Fetching initial session in useSession hook");
      setIsLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session fetched, authenticated:", !!currentSession);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Invalidate queries to ensure fresh data is loaded
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
          queryClient.invalidateQueries({ queryKey: ['friends'] });
          queryClient.invalidateQueries({ queryKey: ['groups'] });
          queryClient.invalidateQueries({ queryKey: ['payments'] });
          queryClient.invalidateQueries({ queryKey: ['reminders'] });
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
        console.log("Session loading complete");
      }
    };
    
    fetchSession();
    
    // Set up auth listener for changes during the session
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed in useSession:", event);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          if (event === 'SIGNED_IN') {
            console.log("User signed in, invalidating queries");
            // Force a refetch of data when user signs in
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['reminders'] });
          }
        } else {
          // Clear session and user data when signed out
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => {
      console.log("Cleaning up session listeners");
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  console.log("useSession returning:", { 
    isAuthenticated: !!session, 
    isLoading, 
    isLoaded,
    email: user?.email,
    userName 
  });

  return {
    session,
    user,
    isLoading,
    isSessionLoaded: isLoaded,
    setSessionLoaded: setIsLoaded,
    userName
  };
};
