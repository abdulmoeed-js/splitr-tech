
import { Split } from "@/types/expense";

export function useSplitCalculation() {
  const calculateTotalPercentage = (splits: Split[]): number => {
    return splits.reduce((total, split) => total + (split.percentage || 0), 0);
  };

  const handleSplitChange = (
    splits: Split[],
    friendId: string,
    value: string,
    field: 'amount' | 'percentage',
    totalAmount: number
  ): Split[] => {
    const numericValue = parseFloat(value);
    const isValidNumber = !isNaN(numericValue) && numericValue >= 0;
    
    return splits.map(split => {
      if (split.friendId === friendId) {
        if (field === 'amount') {
          return {
            ...split,
            amount: isValidNumber ? numericValue : 0,
            // If changing amount, update percentage too
            percentage: isValidNumber ? (numericValue / totalAmount) * 100 : 0
          };
        } else if (field === 'percentage') {
          return {
            ...split,
            percentage: isValidNumber ? numericValue : 0,
            // If changing percentage, update amount too
            amount: isValidNumber ? (totalAmount * numericValue) / 100 : 0
          };
        }
      }
      return split;
    });
  };

  return {
    calculateTotalPercentage,
    handleSplitChange
  };
}
