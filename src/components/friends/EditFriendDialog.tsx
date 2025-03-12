
import { Friend } from "@/types/expense";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface EditFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: Friend | null;
  onSave: (friend: Friend) => void;
}

export const EditFriendDialog = ({ 
  open, 
  onOpenChange, 
  friend, 
  onSave 
}: EditFriendDialogProps) => {
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);

  useEffect(() => {
    if (friend) {
      setEditingFriend({ ...friend });
    }
  }, [friend]);

  const handleSave = () => {
    if (editingFriend) {
      onSave(editingFriend);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  onOpenChange(false);
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
  );
};
