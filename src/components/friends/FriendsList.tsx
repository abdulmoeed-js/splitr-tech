
import { Friend } from "@/types/expense";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface FriendsListProps {
  friends: Friend[];
  onRemoveFriend: (friendId: string) => void;
}

export const FriendsList = ({ friends, onRemoveFriend }: FriendsListProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  
  const handleRemove = () => {
    if (selectedFriendId) {
      onRemoveFriend(selectedFriendId);
      setSelectedFriendId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Friends</h2>
      </div>
      
      {friends.map((friend) => (
        <Card key={friend.id} className="p-4 glass-panel">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <span className="font-medium text-primary">
                  {friend.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium">{friend.name}</span>
            </div>
            
            {friend.id !== "1" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedFriendId(friend.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <UserX className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {friend.name} from your friends list? 
                      This action cannot be undone if they have associated expenses.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedFriendId(null)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemove} className="bg-destructive">
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
