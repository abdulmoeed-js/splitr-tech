
import { Friend } from "@/types/expense";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, Edit2, Mail, Phone, Check, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface FriendsListProps {
  friends: Friend[];
  onRemoveFriend: (friendId: string) => void;
  onUpdateFriend: (friend: Partial<Friend> & { id: string }) => void;
}

export const FriendsList = ({ friends, onRemoveFriend, onUpdateFriend }: FriendsListProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  
  const handleRemove = () => {
    if (selectedFriendId) {
      onRemoveFriend(selectedFriendId);
      setSelectedFriendId(null);
    }
  };

  const handleEdit = (friend: Friend) => {
    setEditingFriend({ ...friend });
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    if (editingFriend) {
      onUpdateFriend(editingFriend);
      setEditDialogOpen(false);
      setEditingFriend(null);
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
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <span className="font-medium text-primary">
                    {friend.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">{friend.name}</span>
                  {friend.isInvited && !friend.isComplete && (
                    <Badge variant="outline" className="ml-2 text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      Invited
                    </Badge>
                  )}
                </div>
              </div>
              
              {friend.email && (
                <div className="flex items-center text-sm text-muted-foreground ml-11">
                  <Mail className="h-3 w-3 mr-2" />
                  <span>{friend.email}</span>
                </div>
              )}
              
              {friend.phone && (
                <div className="flex items-center text-sm text-muted-foreground ml-11">
                  <Phone className="h-3 w-3 mr-2" />
                  <span>{friend.phone}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              {friend.id !== "1" && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(friend)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
                  
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
                </>
              )}
            </div>
          </div>
        </Card>
      ))}

      {/* Edit Friend Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle>Edit Friend</DialogTitle>
          </DialogHeader>
          
          {editingFriend && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Name</Label>
                <Input
                  id="editName"
                  value={editingFriend.name}
                  onChange={(e) => setEditingFriend({...editingFriend, name: e.target.value})}
                  placeholder="Friend's name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingFriend.email || ''}
                  onChange={(e) => setEditingFriend({...editingFriend, email: e.target.value || undefined})}
                  placeholder="friend@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone Number</Label>
                <Input
                  id="editPhone"
                  type="tel"
                  value={editingFriend.phone || ''}
                  onChange={(e) => setEditingFriend({...editingFriend, phone: e.target.value || undefined})}
                  placeholder="+1234567890"
                />
              </div>
              
              <DialogFooter className="flex space-x-2 justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditDialogOpen(false);
                    setEditingFriend(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {friends.length === 0 && (
        <div className="text-center p-6 bg-gray-800/50 rounded-lg">
          <p className="text-muted-foreground">No friends added yet. Add friends to split expenses with them.</p>
        </div>
      )}
    </div>
  );
};
