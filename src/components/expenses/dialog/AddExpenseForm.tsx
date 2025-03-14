
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Friend, Split } from "@/types/expense";
import { SelectPaidBy } from "./SelectPaidBy";
import { FriendSelection } from "./FriendSelection";
import { SplitMethodSelector } from "./SplitMethodSelector";
import { SplitDetails } from "./SplitDetails";

interface AddExpenseFormProps {
  friends: Friend[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
  onSuccess: () => void;
}

export function AddExpenseForm({ 
  friends, 
  onAddExpense,
  onSuccess
}: AddExpenseFormProps) {
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

    try {
      onAddExpense(description, amountValue, paidBy, finalSplits);
      resetForm();
      onSuccess();
      
      toast({
        title: "Expense Added",
        description: "Your expense has been successfully added.",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while adding the expense",
        variant: "destructive",
      });
    }
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
      
      <SelectPaidBy 
        friends={friends} 
        value={paidBy} 
        onChange={setPaidBy} 
      />

      <FriendSelection 
        friends={friends}
        selectedFriends={selectedFriends}
        onSelectionChange={handleFriendSelection}
      />

      <SplitMethodSelector 
        value={splitMethod} 
        onChange={handleSplitMethodChange} 
      />

      {selectedFriends.length > 0 && (
        <SplitDetails
          friends={friends}
          selectedFriends={selectedFriends}
          splits={splits}
          splitMethod={splitMethod}
          onSplitChange={setSplits}
        />
      )}

      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  );
}
