
import { Split } from "@/types/expense";
import { Toast } from "@/components/ui/use-toast";

interface ValidationParams {
  description: string;
  amount: string;
  paidBy: string;
  selectedFriends: string[];
  splits: Split[];
  splitMethod: string;
  toast: (props: Toast) => void;
}

export function useExpenseFormValidation() {
  const validateExpenseForm = ({
    description,
    amount,
    paidBy,
    selectedFriends,
    splits,
    splitMethod,
    toast
  }: ValidationParams): boolean => {
    if (!description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a description for the expense.",
        variant: "destructive",
      });
      return false;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive",
      });
      return false;
    }

    if (!paidBy) {
      toast({
        title: "Missing Information",
        description: "Please select who paid for the expense.",
        variant: "destructive",
      });
      return false;
    }

    if (selectedFriends.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one friend to split with.",
        variant: "destructive",
      });
      return false;
    }

    // Check if we have proper splits for the selected friends
    const validSplits = splits.filter(split => 
      selectedFriends.includes(split.friendId)
    );

    if (validSplits.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please specify how to split the expense.",
        variant: "destructive",
      });
      return false;
    }

    // For percentage splits, ensure they sum to 100%
    if (splitMethod === "percentage") {
      const totalPercentage = validSplits.reduce((sum, split) => sum + (split.percentage || 0), 0);
      
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast({
          title: "Invalid Split",
          description: `The total percentage should be 100%. Current total: ${totalPercentage.toFixed(2)}%`,
          variant: "destructive",
        });
        return false;
      }
    }

    // For custom amount splits, ensure they sum to the total
    if (splitMethod === "custom") {
      const totalSplit = validSplits.reduce((sum, split) => sum + split.amount, 0);
      
      if (Math.abs(totalSplit - amountValue) > 0.01) {
        toast({
          title: "Invalid Split",
          description: `The split amounts should sum to the total expense (${amountValue}). Current sum: ${totalSplit.toFixed(2)}`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  return { validateExpenseForm };
}
