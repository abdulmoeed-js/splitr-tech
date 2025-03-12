
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User } from "lucide-react";
import { Friend, Split } from "@/types/expense";

interface AddExpenseDialogProps {
  friends: Friend[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
  onAddFriend: (name: string) => void;
}

export const AddExpenseDialog = ({ friends, onAddExpense, onAddFriend }: AddExpenseDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [open, setOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const splits = friends.map((friend) => ({
      friendId: friend.id,
      amount: Number(amount) / friends.length,
    }));
    onAddExpense(description, Number(amount), paidBy, splits);
    setDescription("");
    setAmount("");
    setPaidBy("");
    setOpen(false);
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      onAddFriend(newFriendName.trim());
      setNewFriendName("");
      setShowAddFriend(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full shadow-lg">
          <Plus className="mr-2" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Enter the expense details and select who paid.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, Movies, etc."
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
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="paidBy">Paid By</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAddFriend(!showAddFriend)}
                className="text-xs flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Friend
              </Button>
            </div>
            
            {showAddFriend ? (
              <div className="flex space-x-2 my-2">
                <Input
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="Friend's name"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddFriend}
                  size="sm"
                >
                  Add
                </Button>
              </div>
            ) : (
              <Select value={paidBy} onValueChange={setPaidBy} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      {friend.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
