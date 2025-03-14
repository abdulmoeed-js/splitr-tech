
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Friend } from "@/types/expense";

interface FriendSelectionProps {
  friends: Friend[];
  selectedFriends: string[];
  onSelectionChange: (friendId: string, checked: boolean) => void;
}

export function FriendSelection({ 
  friends, 
  selectedFriends,
  onSelectionChange 
}: FriendSelectionProps) {
  return (
    <div className="space-y-2">
      <Label>Split Between</Label>
      <div className="grid grid-cols-2 gap-2">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center space-x-2">
            <Checkbox
              id={`friend-${friend.id}`}
              checked={selectedFriends.includes(friend.id)}
              onCheckedChange={(checked) => 
                onSelectionChange(friend.id, checked as boolean)
              }
            />
            <Label htmlFor={`friend-${friend.id}`}>{friend.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
