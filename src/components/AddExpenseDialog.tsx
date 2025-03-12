
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Divide } from "lucide-react";
import { Friend, Split } from "@/types/expense";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [splitType, setSplitType] = useState("equal");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});

  // Initialize splits when amount changes or when friends selection changes
  const initializeSplits = () => {
    const selected = selectedFriends.length > 0 ? selectedFriends : friends.map(f => f.id);
    const perPersonAmount = (Number(amount) / selected.length).toFixed(2);
    
    const newSplits: Record<string, string> = {};
    selected.forEach(friendId => {
      newSplits[friendId] = perPersonAmount;
    });
    
    setCustomSplits(newSplits);
  };

  const handleSplitTypeChange = (value: string) => {
    setSplitType(value);
    if (value === "equal" && amount) {
      initializeSplits();
    }
  };

  const handleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => {
      const isSelected = prev.includes(friendId);
      const newSelection = isSelected 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId];
        
      // Update splits after selection changes
      setTimeout(() => {
        if (splitType === "equal" && amount && newSelection.length > 0) {
          const perPersonAmount = (Number(amount) / newSelection.length).toFixed(2);
          const newSplits: Record<string, string> = {};
          newSelection.forEach(id => {
            newSplits[id] = perPersonAmount;
          });
          setCustomSplits(newSplits);
        }
      }, 0);
      
      return newSelection;
    });
  };

  const handleCustomSplitChange = (friendId: string, value: string) => {
    setCustomSplits(prev => ({
      ...prev,
      [friendId]: value
    }));
  };

  const calculateSplitTotal = () => {
    return Object.values(customSplits).reduce((sum, val) => sum + Number(val), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let splits: Split[] = [];
    
    if (splitType === "equal") {
      // If no friends are explicitly selected, split among all friends
      const friendsToSplit = selectedFriends.length > 0 ? selectedFriends : friends.map(f => f.id);
      const perPersonAmount = Number(amount) / friendsToSplit.length;
      
      splits = friendsToSplit.map(friendId => ({
        friendId,
        amount: perPersonAmount,
      }));
    } else if (splitType === "custom") {
      splits = Object.entries(customSplits).map(([friendId, splitAmount]) => ({
        friendId,
        amount: Number(splitAmount),
      }));
    }
    
    onAddExpense(description, Number(amount), paidBy, splits);
    setDescription("");
    setAmount("");
    setPaidBy("");
    setSplitType("equal");
    setSelectedFriends([]);
    setCustomSplits({});
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
      <DialogContent className="glass-panel max-w-md">
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
              onChange={(e) => {
                setAmount(e.target.value);
                if (splitType === "equal" && e.target.value && selectedFriends.length > 0) {
                  const perPersonAmount = (Number(e.target.value) / selectedFriends.length).toFixed(2);
                  const newSplits: Record<string, string> = {};
                  selectedFriends.forEach(id => {
                    newSplits[id] = perPersonAmount;
                  });
                  setCustomSplits(newSplits);
                }
              }}
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

          <div className="space-y-3">
            <Label>Split Type</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={splitType === "equal" ? "default" : "outline"}
                onClick={() => handleSplitTypeChange("equal")}
                className="flex-1"
              >
                Equal
              </Button>
              <Button
                type="button"
                variant={splitType === "custom" ? "default" : "outline"}
                onClick={() => handleSplitTypeChange("custom")}
                className="flex-1"
              >
                Custom
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Split Among</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`friend-${friend.id}`}
                      checked={selectedFriends.length === 0 || selectedFriends.includes(friend.id)}
                      onCheckedChange={() => handleFriendSelection(friend.id)}
                    />
                    <Label htmlFor={`friend-${friend.id}`} className="cursor-pointer">
                      {friend.name}
                    </Label>
                  </div>

                  {splitType === "custom" && (selectedFriends.length === 0 || selectedFriends.includes(friend.id)) && (
                    <Input
                      value={customSplits[friend.id] || ""}
                      onChange={(e) => handleCustomSplitChange(friend.id, e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-24"
                    />
                  )}
                </div>
              ))}
            </div>

            {splitType === "custom" && (
              <div className="flex justify-between items-center text-sm">
                <span>Total: ${calculateSplitTotal().toFixed(2)}</span>
                <span className={Number(amount) !== calculateSplitTotal() ? "text-red-500" : "text-green-500"}>
                  {Number(amount) !== calculateSplitTotal() 
                    ? `Difference: $${(Number(amount) - calculateSplitTotal()).toFixed(2)}` 
                    : "Splits match total ✓"}
                </span>
              </div>
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
