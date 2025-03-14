
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddFriendDialogProps {
  onAddFriend: (name: string, email?: string, phone?: string) => void;
  onInviteFriend: (email?: string, phone?: string) => void;
}

export function AddFriendDialog({ onAddFriend, onInviteFriend }: AddFriendDialogProps) {
  const [open, setOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [newFriendPhone, setNewFriendPhone] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const { toast } = useToast();

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      onAddFriend(newFriendName, newFriendEmail, newFriendPhone);
      setNewFriendName("");
      setNewFriendEmail("");
      setNewFriendPhone("");
      setOpen(false);
      
      toast({
        title: "Friend Added",
        description: `${newFriendName} has been added to your friends list.`,
      });
    }
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail || invitePhone) {
      onInviteFriend(inviteEmail, invitePhone);
      setInviteEmail("");
      setInvitePhone("");
      setOpen(false);
      
      toast({
        title: "Invitation Sent",
        description: `Invitation has been sent to ${inviteEmail || invitePhone}.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <UserPlus className="mr-2 h-4 w-4" /> Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Add New Friend</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="add">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Friend</TabsTrigger>
            <TabsTrigger value="invite">Invite Friend</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="friendEmail">Email (Optional)</Label>
                <Input
                  id="friendEmail"
                  type="email"
                  value={newFriendEmail}
                  onChange={(e) => setNewFriendEmail(e.target.value)}
                  placeholder="friend@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="friendPhone">Phone Number (Optional)</Label>
                <Input
                  id="friendPhone"
                  type="tel"
                  value={newFriendPhone}
                  onChange={(e) => setNewFriendPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              
              <Button type="submit" className="w-full">Add Friend</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="invite" className="space-y-4">
            <form onSubmit={handleInviteFriend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                />
              </div>
              
              <div className="text-center my-2">
                <span className="text-sm text-muted-foreground">Or</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invitePhone">Phone Number</Label>
                <Input
                  id="invitePhone"
                  type="tel"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={!inviteEmail && !invitePhone}
              >
                Send Invitation
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
