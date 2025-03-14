
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Friend, Split } from "@/types/expense";

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
  
  // Get the total of current splits for percentage validation
  const calculateTotalPercentage = () => {
    return splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
  };

  // Handle updating split amounts or percentages
  const handleSplitChange = (friendId: string, value: string, field: 'amount' | 'percentage') => {
    const numericValue = parseFloat(value) || 0;

    // Create a new array with updated values
    const updatedSplits = splits.map(split => {
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
        <div className="grid gap-2">
          {splits.map((split) => {
            const friend = friends.find(f => f.id === split.friendId);
            return (
              <Card key={split.friendId} className="p-2">
                <div className="flex justify-between items-center">
                  <span>{friend?.name}</span>
                  <span className="font-medium">
                    Rs. {split.amount.toFixed(2)} ({split.percentage?.toFixed(1)}%)
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (splitMethod === 'amount') {
    return (
      <div className="space-y-4">
        <Label>Split by Amount</Label>
        <div className="grid gap-2">
          {splits.map((split) => {
            const friend = friends.find(f => f.id === split.friendId);
            return (
              <Card key={split.friendId} className="p-2">
                <div className="flex justify-between items-center">
                  <span>{friend?.name}</span>
                  <div className="flex items-center gap-2">
                    <span>Rs.</span>
                    <Input
                      type="number"
                      value={split.amount || ''}
                      onChange={(e) => handleSplitChange(split.friendId, e.target.value, 'amount')}
                      className="w-24"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="text-right text-sm font-medium">
          Total: Rs. {splits.reduce((sum, split) => sum + split.amount, 0).toFixed(2)} / {amount.toFixed(2)}
        </div>
      </div>
    );
  }

  if (splitMethod === 'percentage') {
    const totalPercentage = calculateTotalPercentage();
    
    return (
      <div className="space-y-4">
        <Label>Split by Percentage</Label>
        <div className="grid gap-2">
          {splits.map((split) => {
            const friend = friends.find(f => f.id === split.friendId);
            return (
              <Card key={split.friendId} className="p-2">
                <div className="flex justify-between items-center">
                  <span>{friend?.name}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={split.percentage || ''}
                      onChange={(e) => handleSplitChange(split.friendId, e.target.value, 'percentage')}
                      className="w-20"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span>%</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div className={`text-right text-sm font-medium ${totalPercentage !== 100 ? 'text-red-500' : ''}`}>
          Total: {totalPercentage.toFixed(1)}% {totalPercentage !== 100 ? '(should be 100%)' : ''}
        </div>
      </div>
    );
  }

  return null;
}
