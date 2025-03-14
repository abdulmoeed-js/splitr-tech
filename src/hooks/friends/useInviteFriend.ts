
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Friend } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { inviteFriend } from "@/utils/friends";
import { Session } from "@supabase/supabase-js";

export const useInviteFriend = (session: Session | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, phone }: { email?: string; phone?: string }) => {
      return inviteFriend(session, { email, phone });
    },
    onSuccess: (newFriend) => {
      queryClient.setQueryData(['friends'], (oldFriends: Friend[] = []) => [...oldFriends, newFriend]);
      
      toast({
        title: "Friend Invited",
        description: `Invitation sent to ${newFriend.email || newFriend.phone}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Invite Friend",
        description: error.message || "An error occurred while inviting friend",
        variant: "destructive"
      });
    }
  });
};
