import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, UserPlus, Mail, Phone } from "lucide-react";
import { Friend, Split } from "@/types/expense";
import { useToast } from "@/components/ui/use-toast";

interface AddExpenseDialogProps {
  friends: Friend[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
  onAddFriend: (name: string, email?: string, phone?: string) => void;
  onInviteFriend: (email?: string, phone?: string) => void;
}

export function AddExpenseDialog({ 
  friends, 
  onAddExpense, 
  onAddFriend,
  onInviteFriend
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(friends[0]?.id || "");
  const [splits, setSplits] = useState<Split[]>([]);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [newFriendPhone, setNewFriendPhone] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const { toast } = useToast();

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy(friends[0]?.id || "");
    setSplits([]);
    setNewFriendName("");
    setNewFriendEmail("");
    setNewFriendPhone("");
    setInviteEmail("");
    setInvitePhone("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount.trim()) {
      toast({
        title: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (!paidBy) {
      toast({
        title: "Please select who paid the expense.",
        variant: "destructive",
      });
      return;
    }

    if (splits.length === 0) {
      toast({
        title: "Please add at least one split.",
        variant: "destructive",
      });
      return;
    }

    onAddExpense(description, amountValue, paidBy, splits);
    setOpen(false);
    resetForm();
    
    toast({
      title: "Expense Added",
      description: "Your expense has been successfully added.",
    });
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      onAddFriend(newFriendName, newFriendEmail, newFriendPhone);
      setNewFriendName("");
      setNewFriendEmail("");
      setNewFriendPhone("");
    }
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail || invitePhone) {
      onInviteFriend(inviteEmail, invitePhone);
      setInviteEmail("");
      setInvitePhone("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expense description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <select
              id="paidBy"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {friends.map((friend) => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Splits</Label>
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-2">
                <Label htmlFor={`split-${friend.id}`}>{friend.name}</Label>
                <Input
                  type="number"
                  id={`split-${friend.id}`}
                  placeholder="0.00"
                  className="w-24"
                  onChange={(e) => {
                    const splitAmount = parseFloat(e.target.value);
                    if (!isNaN(splitAmount)) {
                      setSplits((prevSplits) => {
                        const existingSplitIndex = prevSplits.findIndex(
                          (split) => split.friendId === friend.id
                        );
                        if (existingSplitIndex !== -1) {
                          const newSplits = [...prevSplits];
                          newSplits[existingSplitIndex] = {
                            ...newSplits[existingSplitIndex],
                            amount: splitAmount,
                          };
                          return newSplits;
                        } else {
                          return [
                            ...prevSplits,
                            { friendId: friend.id, amount: splitAmount },
                          ];
                        }
                      });
                    } else {
                      setSplits((prevSplits) =>
                        prevSplits.filter((split) => split.friendId !== friend.id)
                      );
                    }
                  }}
                />
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
        
        <div className="mt-4 py-2 border-t">
          <h3 className="text-lg font-semibold">Add New Friend</h3>
          
          <form onSubmit={handleAddFriend} className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="newFriendName">Name</Label>
              <Input
                id="newFriendName"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="Friend's name"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="newFriendEmail">Email (Optional)</Label>
              <Input
                type="email"
                id="newFriendEmail"
                value={newFriendEmail}
                onChange={(e) => setNewFriendEmail(e.target.value)}
                placeholder="friend@example.com"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="newFriendPhone">Phone (Optional)</Label>
              <Input
                type="tel"
                id="newFriendPhone"
                value={newFriendPhone}
                onChange={(e) => setNewFriendPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            
            <Button type="submit" variant="secondary">
              <UserPlus className="mr-2 h-4 w-4" /> Add Friend
            </Button>
          </form>
          
          <div className="mt-4 py-2 border-t">
            <h3 className="text-lg font-semibold">Invite Friend</h3>
            
            <form onSubmit={handleInviteFriend} className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="inviteEmail">Email</Label>
                <Input
                  type="email"
                  id="inviteEmail"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="invitePhone">Phone</Label>
                <Input
                  type="tel"
                  id="invitePhone"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              
              <Button type="submit" variant="secondary">
                <Mail className="mr-2 h-4 w-4" /> Invite Friend
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
