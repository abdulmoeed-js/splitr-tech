
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { addFriend } from "@/utils/friendsApi";
import { Session } from "@supabase/supabase-js";

export const useAddFriend = (session: Session | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, phone }: { name: string; email?: string; phone?: string }) => {
      return addFriend(session, { name, email, phone });
    },
    onSuccess: (newFriend) => {
      queryClient.setQueryData(['friends'], (oldFriends: Friend[] = []) => [...oldFriends, newFriend]);
      
      toast({
        title: "Friend Added",
        description: `${newFriend.name || "A new friend"} has been added to your friends list.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Friend",
        description: error.message || "An error occurred while adding friend",
        variant: "destructive"
      });
    }
  });
};
