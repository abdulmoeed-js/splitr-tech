
import { useCallback } from "react";
import { Split } from "@/types/expense";

export function useSplitCalculation() {
  // Calculate the total percentage of splits
  const calculateTotalPercentage = useCallback((splits: Split[]) => {
    return splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
  }, []);

  // Handle updating split amounts or percentages
  const handleSplitChange = useCallback((
    splits: Split[],
    friendId: string, 
    value: string, 
    field: 'amount' | 'percentage',
    amount: number
  ) => {
    const numericValue = parseFloat(value) || 0;

    // Create a new array with updated values
    return splits.map(split => {
      if (split.friendId === friendId) {
        if (field === 'amount') {
          return {
            ...split,
            amount: numericValue,
            percentage: amount > 0 ? (numericValue / amount) * 100 : 0
          };
        } else {
          return {
            ...split,
            percentage: numericValue,
            amount: (numericValue / 100) * amount
          };
        }
      }
      return split;
    });
  }, []);

  return {
    calculateTotalPercentage,
    handleSplitChange
  };
}
