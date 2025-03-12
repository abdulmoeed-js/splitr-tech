import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Friend } from "@/types/expense";
import { Plus, Users } from "lucide-react";

interface FriendGroupDialogProps {
  friends: Friend[];
  onAddGroup: (name: string, memberIds: string[]) => void;
}

export const FriendGroupDialog = ({ 
  friends, 
  onAddGroup 
}: FriendGroupDialogProps) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast({
        title: "Group name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedFriends.length === 0) {
      toast({
        title: "Please select at least one friend",
        variant: "destructive"
      });
      return;
    }
    
    onAddGroup(groupName.trim(), selectedFriends);
    setOpen(false);
    setGroupName("");
    setSelectedFriends([]);
    
    toast({
      title: "Group Created",
      description: `${groupName} has been created with ${selectedFriends.length} friends`
    });
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId) 
        : [...prev, friendId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Users className="mr-2 h-4 w-4" /> Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel max-w-md">
        <DialogHeader>
          <DialogTitle>Create Friend Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input 
              id="groupName" 
              value={groupName} 
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Weekend Friends, Roommates, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Select Friends</Label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`friend-${friend.id}`} 
                    checked={selectedFriends.includes(friend.id)}
                    onCheckedChange={() => toggleFriendSelection(friend.id)}
                  />
                  <Label htmlFor={`friend-${friend.id}`} className="cursor-pointer">
                    {friend.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
