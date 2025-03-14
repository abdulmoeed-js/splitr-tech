
import React from "react";
import { Label } from "@/components/ui/label";
import { Friend, Split } from "@/types/expense";
import { EqualSplit } from "./split-details/EqualSplit";
import { AmountSplit } from "./split-details/AmountSplit";
import { PercentageSplit } from "./split-details/PercentageSplit";
import { useSplitCalculation } from "./hooks/useSplitCalculation";

interface SplitDetailsProps {
  selectedFriends: string[];
  friends: Friend[];
  amount: number;
  splitMethod: string;
  splits: Split[];
  onSplitsChange: (splits: Split[]) => void;
}

export function SplitDetails({ 
  selectedFriends, 
  friends, 
  amount, 
  splitMethod,
  splits,
  onSplitsChange
}: SplitDetailsProps) {
  const { calculateTotalPercentage, handleSplitChange } = useSplitCalculation();
  
  // Handle updating split amounts or percentages
  const onSplitChange = (friendId: string, value: string, field: 'amount' | 'percentage') => {
    const updatedSplits = handleSplitChange(splits, friendId, value, field, amount);
    onSplitsChange(updatedSplits);
  };

  // Equal split - divide equally among selected friends
  React.useEffect(() => {
    if (selectedFriends.length > 0 && splitMethod === 'equal') {
      const equalAmount = amount / selectedFriends.length;
      const equalPercentage = 100 / selectedFriends.length;
      
      const newSplits: Split[] = selectedFriends.map(friendId => ({
        friendId,
        amount: equalAmount,
        percentage: equalPercentage
      }));
      
      onSplitsChange(newSplits);
    }
  }, [selectedFriends, amount, splitMethod, onSplitsChange]);

  if (selectedFriends.length === 0) {
    return <p className="text-muted-foreground text-sm">Select friends to split with</p>;
  }

  if (splitMethod === 'equal') {
    return (
      <div className="space-y-4">
        <Label>Equal Split</Label>
        <EqualSplit splits={splits} friends={friends} />
      </div>
    );
  }

  if (splitMethod === 'amount') {
    return (
      <div className="space-y-4">
        <Label>Split by Amount</Label>
        <AmountSplit 
          splits={splits} 
          friends={friends} 
          amount={amount} 
          onSplitChange={onSplitChange} 
        />
      </div>
    );
  }

  if (splitMethod === 'percentage') {
    const totalPercentage = calculateTotalPercentage(splits);
    
    return (
      <div className="space-y-4">
        <Label>Split by Percentage</Label>
        <PercentageSplit 
          splits={splits} 
          friends={friends} 
          totalPercentage={totalPercentage} 
          onSplitChange={onSplitChange}
        />
      </div>
    );
  }

  return null;
}
