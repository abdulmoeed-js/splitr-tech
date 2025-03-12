
import { Friend } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { FriendsList } from "@/components/friends/FriendsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus } from "lucide-react";

interface FriendsManagementProps {
  friends: Friend[];
  onAddFriend: (name: string) => void;
  onRemoveFriend: (friendId: string) => void;
}

export const FriendsManagement = ({ 
  friends, 
  onAddFriend, 
  onRemoveFriend 
}: FriendsManagementProps) => {
  const [open, setOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      onAddFriend(newFriendName);
      setNewFriendName("");
      setOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Friends</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Friend
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel">
            <DialogHeader>
              <DialogTitle>Add New Friend</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddFriend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="friendName">Friend's Name</Label>
                <Input
                  id="friendName"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="Enter friend's name"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Friend</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <FriendsList 
        friends={friends} 
        onRemoveFriend={onRemoveFriend} 
      />
    </div>
  );
};
