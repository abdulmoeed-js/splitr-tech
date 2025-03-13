
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { checkFriendHasExpenses, removeFriend } from "@/utils/friendsApi";
import { Session } from "@supabase/supabase-js";

export const useRemoveFriend = (session: Session | null, friends: Friend[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string) => {
      // Check if this is the user's own entry
      if (friendId === "1") {
        throw new Error("Cannot remove yourself from friends list.");
      }
      
      // Check if friend has any expenses
      const hasExpenses = await checkFriendHasExpenses(session, friendId);
      if (hasExpenses) {
        throw new Error("This friend has associated expenses. Settle all expenses before removing.");
      }
      
      return removeFriend(session, friendId);
    },
    onSuccess: (removedFriendId) => {
      // Update friends list
      queryClient.setQueryData(['friends'], (oldFriends: Friend[] = []) => 
        oldFriends.filter(friend => friend.id !== removedFriendId)
      );
      
      // Also update groups to remove this friend
      queryClient.setQueryData(['groups'], (oldGroups: any[] = []) =>
        oldGroups.map(group => ({
          ...group,
          members: group.members.filter((member: any) => member.id !== removedFriendId)
        }))
      );
      
      const removedFriend = friends.find(f => f.id === removedFriendId);
      toast({
        title: "Friend Removed",
        description: `${removedFriend?.name || 'Friend'} has been removed from your friends list.`
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cannot Remove Friend",
        description: error.message || "An error occurred while removing friend",
        variant: "destructive"
      });
    }
  });
};
