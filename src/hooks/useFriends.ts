
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { Friend } from "@/types/expense";
import { fetchFriends, cleanupDuplicateYouFriends } from "@/utils/friends";
import { useAddFriend } from "@/hooks/friends/useAddFriend";
import { useUpdateFriend } from "@/hooks/friends/useUpdateFriend";
import { useInviteFriend } from "@/hooks/friends/useInviteFriend";
import { useRemoveFriend } from "@/hooks/friends/useRemoveFriend";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const useFriends = (session: Session | null, userName: string) => {
  // Clean up duplicate "You" entries when the hook is initialized
  useEffect(() => {
    if (session?.user) {
      console.log("Running cleanup of duplicate 'You' friends");
      cleanupDuplicateYouFriends(session, userName).catch(error => {
        console.error("Error during cleanup:", error);
      });
    }
  }, [session?.user?.id, userName]);

  // Fetch friends from Supabase
  const { 
    data: friends = [], 
    isLoading: isFriendsLoading,
    error: friendsError,
    refetch: refetchFriends
  } = useQuery({
    queryKey: ['friends', session?.user?.id],
    queryFn: () => fetchFriends(session, userName),
    enabled: !!session?.user, // Only fetch when authenticated
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 60 * 60 * 1000, // Keep data in cache for 1 hour
    retry: 3, // Retry 3 times on failure
    // Add error handling
    meta: {
      onError: (error: any) => {
        console.error("Error fetching friends:", error);
        toast({
          title: "Failed to load friends",
          description: error.message || "An error occurred while loading friends",
          variant: "destructive"
        });
      }
    }
  });

  // Manual refresh function with cleanup included
  const refreshData = async () => {
    if (session?.user) {
      console.log("Manually refreshing friends data");
      try {
        // First clean up any duplicates
        await cleanupDuplicateYouFriends(session, userName);
        // Then refetch the friends list
        return refetchFriends();
      } catch (error) {
        console.error("Error during friends refresh:", error);
        throw error;
      }
    }
    return Promise.resolve();
  };

  // Use the mutation hooks
  const addFriendMutation = useAddFriend(session);
  const updateFriendMutation = useUpdateFriend(session);
  const inviteFriendMutation = useInviteFriend(session);
  const removeFriendMutation = useRemoveFriend(session, friends);

  return {
    friends,
    isFriendsLoading,
    friendsError,
    refreshData,
    handleAddFriend: (name: string, email?: string, phone?: string) => {
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to add friends",
          variant: "destructive"
        });
        return;
      }
      addFriendMutation.mutate({ name, email, phone });
    },
    handleUpdateFriend: (friend: Partial<Friend> & { id: string }) => {
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to update friends",
          variant: "destructive"
        });
        return;
      }
      updateFriendMutation.mutate(friend);
    },
    handleInviteFriend: (email?: string, phone?: string) => {
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to invite friends",
          variant: "destructive"
        });
        return;
      }
      inviteFriendMutation.mutate({ email, phone });
    },
    handleRemoveFriend: (friendId: string) => {
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to remove friends",
          variant: "destructive"
        });
        return;
      }
      removeFriendMutation.mutate(friendId);
    }
  };
};
