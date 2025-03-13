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
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user && event === 'SIGNED_IN') {
          // Force a refetch of data when user signs in
          // We don't want to invalidate friends on sign-in because we want to keep
          // the user's friends between sessions
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
          queryClient.invalidateQueries({ queryKey: ['groups'] });
          queryClient.invalidateQueries({ queryKey: ['payments'] });
          queryClient.invalidateQueries({ queryKey: ['reminders'] });
          
          // For friends, only invalidate if we don't have any friends data already
          const friends = queryClient.getQueryData(['friends']);
          if (!friends) {
            queryClient.invalidateQueries({ queryKey: ['friends'] });
          }
        }
      }
    );

    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user || null);
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };
    
    fetchSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  return {
    session,
    user,
    isLoading,
    isSessionLoaded: isLoaded,
    setSessionLoaded: setIsLoaded,
    userName
  };
};
