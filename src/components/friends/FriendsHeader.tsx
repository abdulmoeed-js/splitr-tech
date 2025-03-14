
import { Users } from "lucide-react";
import { AddFriendDialog } from "./AddFriendDialog";

interface FriendsHeaderProps {
  onAddFriend: (name: string, email?: string, phone?: string) => void;
  onInviteFriend: (email?: string, phone?: string) => void;
}

export function FriendsHeader({ onAddFriend, onInviteFriend }: FriendsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Manage Friends</h1>
      </div>
      
      <div className="flex gap-2">
        <AddFriendDialog 
          onAddFriend={onAddFriend}
          onInviteFriend={onInviteFriend}
        />
      </div>
    </div>
  );
}
