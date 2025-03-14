
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
import { PlusCircle } from "lucide-react";
import { Friend, Split } from "@/types/expense";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddExpenseDialogProps {
  friends: Friend[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
}

export function AddExpenseDialog({ 
  friends, 
  onAddExpense
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(friends[0]?.id || "");
  const [splits, setSplits] = useState<Split[]>([]);
  const [splitMethod, setSplitMethod] = useState<"equal" | "custom" | "percentage">("equal");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const { toast } = useToast();

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy(friends[0]?.id || "");
    setSplits([]);
    setSplitMethod("equal");
    setSelectedFriends([]);
  };

  const handleFriendSelection = (friendId: string, checked: boolean) => {
    setSelectedFriends(prev => {
      const newSelection = checked 
        ? [...prev, friendId]
        : prev.filter(id => id !== friendId);
      
      // Automatically update splits when friends are selected/deselected
      if (splitMethod === "equal" && amount) {
        const amountValue = parseFloat(amount);
        if (!isNaN(amountValue)) {
          const splitAmount = amountValue / (newSelection.length || 1);
          setSplits(newSelection.map(id => ({
            friendId: id,
            amount: splitAmount
          })));
        }
      }
      
      return newSelection;
    });
  };

  const handleSplitMethodChange = (method: "equal" | "custom" | "percentage") => {
    setSplitMethod(method);
    if (method === "equal" && amount && selectedFriends.length > 0) {
      const amountValue = parseFloat(amount);
      if (!isNaN(amountValue)) {
        const splitAmount = amountValue / selectedFriends.length;
        setSplits(selectedFriends.map(id => ({
          friendId: id,
          amount: splitAmount
        })));
      }
    } else if (method === "percentage") {
      const equalPercentage = 100 / (selectedFriends.length || 1);
      setSplits(selectedFriends.map(id => ({
        friendId: id,
        amount: 0,
        percentage: equalPercentage
      })));
    }
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

    if (selectedFriends.length === 0) {
      toast({
        title: "Please select at least one friend to split with.",
        variant: "destructive",
      });
      return;
    }

    const finalSplits = splits.filter(split => 
      selectedFriends.includes(split.friendId)
    );

    if (splitMethod === "percentage") {
      const totalPercentage = finalSplits.reduce((sum, split) => sum + (split.percentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast({
          title: "Percentages must add up to 100%",
          variant: "destructive",
        });
        return;
      }

      // Convert percentages to amounts
      finalSplits.forEach(split => {
        split.amount = (amountValue * (split.percentage || 0)) / 100;
      });
    }

    if (finalSplits.length === 0) {
      toast({
        title: "Please add at least one split.",
        variant: "destructive",
      });
      return;
    }

    onAddExpense(description, amountValue, paidBy, finalSplits);
    setOpen(false);
    resetForm();
    
    toast({
      title: "Expense Added",
      description: "Your expense has been successfully added.",
    });
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (splitMethod === "equal" && selectedFriends.length > 0) {
      const amountValue = parseFloat(value);
      if (!isNaN(amountValue)) {
        const splitAmount = amountValue / selectedFriends.length;
        setSplits(selectedFriends.map(id => ({
          friendId: id,
          amount: splitAmount
        })));
      }
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
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
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
          </div>

          <div className="space-y-2">
            <Label>Split Between</Label>
            <div className="grid grid-cols-2 gap-2">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`friend-${friend.id}`}
                    checked={selectedFriends.includes(friend.id)}
                    onCheckedChange={(checked) => 
                      handleFriendSelection(friend.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`friend-${friend.id}`}>{friend.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Split Method</Label>
            <RadioGroup 
              value={splitMethod} 
              onValueChange={(value) => handleSplitMethodChange(value as "equal" | "custom" | "percentage")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal">Equal Split</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Amounts</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Percentage Split</Label>
              </div>
            </RadioGroup>
          </div>

          {selectedFriends.length > 0 && (
            <div className="space-y-2">
              <Label>Split Details</Label>
              {selectedFriends.map((friendId) => {
                const friend = friends.find(f => f.id === friendId);
                if (!friend) return null;
                
                const split = splits.find(s => s.friendId === friendId);
                const value = splitMethod === "percentage" 
                  ? split?.percentage?.toString() || ""
                  : split?.amount?.toString() || "";
                
                return (
                  <div key={friendId} className="flex items-center space-x-2">
                    <Label htmlFor={`split-${friendId}`} className="w-24">
                      {friend.name}
                    </Label>
                    <Input
                      type="number"
                      id={`split-${friendId}`}
                      value={value}
                      placeholder={splitMethod === "percentage" ? "%" : "0.00"}
                      className="w-24"
                      step={splitMethod === "percentage" ? "1" : "0.01"}
                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        if (!isNaN(newValue)) {
                          setSplits(prev => {
                            const newSplits = prev.filter(s => s.friendId !== friendId);
                            if (splitMethod === "percentage") {
                              newSplits.push({
                                friendId,
                                amount: 0, // Will be calculated on submit
                                percentage: newValue
                              });
                            } else {
                              newSplits.push({
                                friendId,
                                amount: newValue
                              });
                            }
                            return newSplits;
                          });
                        }
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {splitMethod === "percentage" ? "%" : "$"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
