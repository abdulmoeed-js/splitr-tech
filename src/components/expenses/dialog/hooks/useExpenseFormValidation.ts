
import { toast } from "@/components/ui/use-toast";
import { Split } from "@/types/expense";

interface ValidationParams {
  description: string;
  amount: string;
  paidBy: string;
  selectedFriends: string[];
  splits: Split[];
  splitMethod: "equal" | "custom" | "percentage";
  toast: typeof toast;
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
    if (!description.trim() || !amount.trim()) {
      toast({
        title: "Please fill in all fields.",
        variant: "destructive",
      });
      return false;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Please enter a valid amount.",
        variant: "destructive",
      });
      return false;
    }

    if (!paidBy) {
      toast({
        title: "Please select who paid the expense.",
        variant: "destructive",
      });
      return false;
    }

    if (selectedFriends.length === 0) {
      toast({
        title: "Please select at least one friend to split with.",
        variant: "destructive",
      });
      return false;
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
        return false;
      }
    }

    if (finalSplits.length === 0) {
      toast({
        title: "Please add at least one split.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateExpenseForm };
}
