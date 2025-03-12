
import { Friend } from "@/types/expense";
import { FriendCard } from "./FriendCard";
import { EditFriendDialog } from "./EditFriendDialog";
import { useState } from "react";

interface FriendsListProps {
  friends: Friend[];
  onRemoveFriend: (friendId: string) => void;
  onUpdateFriend: (friend: Partial<Friend> & { id: string }) => void;
}

export const FriendsList = ({ friends, onRemoveFriend, onUpdateFriend }: FriendsListProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  
  const handleEdit = (friend: Friend) => {
    setEditingFriend({ ...friend });
    setEditDialogOpen(true);
  };

  const handleSave = (updatedFriend: Friend) => {
    onUpdateFriend(updatedFriend);
    setEditDialogOpen(false);
    setEditingFriend(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Friends</h2>
      </div>
      
      {friends.map((friend) => (
        <FriendCard 
          key={friend.id}
          friend={friend}
          onEdit={handleEdit}
          onRemove={onRemoveFriend}
        />
      ))}

      <EditFriendDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        friend={editingFriend}
        onSave={handleSave}
      />

      {friends.length === 0 && (
        <div className="text-center p-6 bg-gray-800/50 rounded-lg">
          <p className="text-muted-foreground">No friends added yet. Add friends to split expenses with them.</p>
        </div>
      )}
    </div>
  );
};
