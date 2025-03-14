
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Friend, Split } from "@/types/expense";
import { SelectPaidBy } from "./SelectPaidBy";
import { FriendSelection } from "./FriendSelection";
import { SplitMethodSelector } from "./SplitMethodSelector";
import { SplitDetails } from "./SplitDetails";
import { ExpenseDescription } from "./ExpenseDescription";
import { ExpenseAmount } from "./ExpenseAmount";
import { useExpenseFormValidation } from "./hooks/useExpenseFormValidation";
import { useExpenseFormSubmit } from "./hooks/useExpenseFormSubmit";

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
  const { validateExpenseForm } = useExpenseFormValidation();
  const { submitExpense } = useExpenseFormSubmit();

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

    const isValid = validateExpenseForm({
      description,
      amount,
      paidBy,
      selectedFriends,
      splits,
      splitMethod,
      toast
    });

    if (isValid) {
      submitExpense({
        description,
        amount,
        paidBy,
        selectedFriends,
        splits,
        splitMethod,
        onAddExpense,
        onSuccess,
        resetForm
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
      <ExpenseDescription 
        description={description}
        onDescriptionChange={setDescription}
      />
      
      <ExpenseAmount
        amount={amount}
        onAmountChange={handleAmountChange}
      />
      
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
          amount={parseFloat(amount) || 0}
          onSplitsChange={setSplits}
        />
      )}

      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  );
}
