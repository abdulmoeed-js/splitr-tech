
import { Friend } from "@/types/expense";
import { FriendsList } from "@/components/friends/FriendsList";
import { FriendsHeader } from "./FriendsHeader";
import { QuickInvite } from "./QuickInvite";

interface FriendsManagementProps {
  friends: Friend[];
  onAddFriend: (name: string, email?: string, phone?: string) => void;
  onUpdateFriend: (friend: Partial<Friend> & { id: string }) => void;
  onInviteFriend: (email?: string, phone?: string) => void;
  onRemoveFriend: (friendId: string) => void;
}

export const FriendsManagement = ({ 
  friends, 
  onAddFriend, 
  onUpdateFriend,
  onInviteFriend,
  onRemoveFriend 
}: FriendsManagementProps) => {
  return (
    <div className="space-y-6">
      <FriendsHeader 
        onAddFriend={onAddFriend}
        onInviteFriend={onInviteFriend}
      />
      
      <QuickInvite onInviteFriend={onInviteFriend} />

      <FriendsList 
        friends={friends} 
        onRemoveFriend={onRemoveFriend}
        onUpdateFriend={onUpdateFriend}
      />
    </div>
  );
};
