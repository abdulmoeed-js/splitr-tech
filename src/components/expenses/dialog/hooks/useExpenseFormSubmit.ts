
import { Split } from "@/types/expense";
import { toast as showToast } from "@/components/ui/use-toast";

interface SubmitExpenseParams {
  description: string;
  amount: string;
  paidBy: string;
  selectedFriends: string[];
  splits: Split[];
  splitMethod: "equal" | "custom" | "percentage";
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
  onSuccess: () => void;
  resetForm: () => void;
}

export function useExpenseFormSubmit() {
  const submitExpense = ({
    description,
    amount,
    paidBy,
    selectedFriends,
    splits,
    splitMethod,
    onAddExpense,
    onSuccess,
    resetForm
  }: SubmitExpenseParams) => {
    const amountValue = parseFloat(amount);
    
    // Filter splits to only include selected friends
    const finalSplits = splits.filter(split => 
      selectedFriends.includes(split.friendId)
    );

    // If using percentage splits, convert to actual amounts
    if (splitMethod === "percentage") {
      finalSplits.forEach(split => {
        split.amount = (amountValue * (split.percentage || 0)) / 100;
      });
    }

    try {
      onAddExpense(description, amountValue, paidBy, finalSplits);
      resetForm();
      onSuccess();
      
      showToast({
        title: "Expense Added",
        description: "Your expense has been successfully added.",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      showToast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while adding the expense",
        variant: "destructive",
      });
    }
  };

  return { submitExpense };
}
