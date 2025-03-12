
import { Friend } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { FriendsList } from "@/components/friends/FriendsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Mail, Phone } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const [open, setOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [newFriendPhone, setNewFriendPhone] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      onAddFriend(newFriendName, newFriendEmail, newFriendPhone);
      setNewFriendName("");
      setNewFriendEmail("");
      setNewFriendPhone("");
      setOpen(false);
    }
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail || invitePhone) {
      onInviteFriend(inviteEmail, invitePhone);
      setInviteEmail("");
      setInvitePhone("");
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
      </div>

      <FriendsList 
        friends={friends} 
        onRemoveFriend={onRemoveFriend}
        onUpdateFriend={onUpdateFriend}
      />
    </div>
  );
};
