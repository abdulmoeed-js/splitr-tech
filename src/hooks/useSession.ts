
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
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed in useSession:", event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user && event === 'SIGNED_IN') {
          console.log("User signed in, invalidating queries");
          // Force a refetch of data when user signs in, except for friends
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
          queryClient.invalidateQueries({ queryKey: ['groups'] });
          queryClient.invalidateQueries({ queryKey: ['payments'] });
          queryClient.invalidateQueries({ queryKey: ['reminders'] });
          
          // For friends, we want to merge data with local data, not invalidate it
          // We'll update friends in the background if needed
          const friends = queryClient.getQueryData(['friends']);
          if (friends) {
            console.log("Friends data exists, skipping invalidation");
            // If we have friends data already, don't invalidate it
            // The fetchFriends function will handle merging data
          } else {
            console.log("No friends data exists, invalidating");
            // Only invalidate if we don't have any friends data
            queryClient.invalidateQueries({ queryKey: ['friends'] });
          }
        }
      }
    );

    const fetchSession = async () => {
      console.log("Fetching initial session in useSession hook");
      setIsLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session fetched, authenticated:", !!currentSession);
        setSession(currentSession);
        setUser(currentSession?.user || null);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
        console.log("Session loading complete");
      }
    };
    
    fetchSession();

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
