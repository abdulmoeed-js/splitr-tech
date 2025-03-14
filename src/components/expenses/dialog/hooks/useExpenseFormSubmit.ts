
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
    console.log("Submit expense called with:", { description, amount, paidBy, selectedFriends, splits, splitMethod });
    
    if (isNaN(amountValue) || amountValue <= 0) {
      showToast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive",
      });
      return;
    }

    if (!paidBy) {
      showToast({
        title: "Missing Information",
        description: "Please select who paid for the expense.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFriends.length === 0) {
      showToast({
        title: "Missing Information",
        description: "Please select at least one friend to split with.",
        variant: "destructive",
      });
      return;
    }
    
    // Filter splits to only include selected friends
    const finalSplits = splits.filter(split => 
      selectedFriends.includes(split.friendId)
    );

    console.log("Final splits:", finalSplits);

    if (finalSplits.length === 0) {
      showToast({
        title: "Missing Information",
        description: "Please specify how to split the expense.",
        variant: "destructive",
      });
      return;
    }

    // If using percentage splits, convert to actual amounts
    if (splitMethod === "percentage") {
      finalSplits.forEach(split => {
        split.amount = (amountValue * (split.percentage || 0)) / 100;
      });
    }

    try {
      console.log("Calling onAddExpense with:", description, amountValue, paidBy, finalSplits);
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
