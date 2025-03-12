
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { Friend } from "@/types/expense";
import { fetchFriends } from "@/utils/friendsApi";
import { useAddFriend } from "@/hooks/friends/useAddFriend";
import { useUpdateFriend } from "@/hooks/friends/useUpdateFriend";
import { useInviteFriend } from "@/hooks/friends/useInviteFriend";
import { useRemoveFriend } from "@/hooks/friends/useRemoveFriend";

export const useFriends = (session: Session | null, userName: string) => {
  // Fetch friends from Supabase
  const { data: friends = [], isLoading: isFriendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: () => fetchFriends(session, userName),
    enabled: !!session || true,
  });

  // Use the mutation hooks
  const addFriendMutation = useAddFriend(session);
  const updateFriendMutation = useUpdateFriend(session);
  const inviteFriendMutation = useInviteFriend(session);
  const removeFriendMutation = useRemoveFriend(session, friends);

  return {
    friends,
    isFriendsLoading,
    handleAddFriend: (name: string, email?: string, phone?: string) => 
      addFriendMutation.mutate({ name, email, phone }),
    handleUpdateFriend: (friend: Partial<Friend> & { id: string }) => 
      updateFriendMutation.mutate(friend),
    handleInviteFriend: (email?: string, phone?: string) => 
      inviteFriendMutation.mutate({ email, phone }),
    handleRemoveFriend: (friendId: string) => removeFriendMutation.mutate(friendId)
  };
};
