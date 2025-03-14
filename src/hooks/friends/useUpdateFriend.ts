
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { updateFriend } from "@/utils/friends";
import { Session } from "@supabase/supabase-js";

export const useUpdateFriend = (session: Session | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friend: Partial<Friend> & { id: string }) => {
      return updateFriend(session, friend);
    },
    onSuccess: (updatedFriend) => {
      queryClient.setQueryData(['friends'], (oldFriends: Friend[] = []) => 
        oldFriends.map(friend => friend.id === updatedFriend.id ? updatedFriend : friend)
      );
      
      toast({
        title: "Friend Updated",
        description: `${updatedFriend.name} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Friend",
        description: error.message || "An error occurred while updating friend",
        variant: "destructive"
      });
    }
  });
};
