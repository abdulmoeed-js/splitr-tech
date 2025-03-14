
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Friend, Split } from "@/types/expense";

interface SplitDetailsProps {
  friends: Friend[];
  selectedFriends: string[];
  splits: Split[];
  splitMethod: "equal" | "custom" | "percentage";
  onSplitChange: (splits: Split[]) => void;
}

export function SplitDetails({ 
  friends,
  selectedFriends,
  splits,
  splitMethod,
  onSplitChange
}: SplitDetailsProps) {
  return (
    <div className="space-y-2">
      <Label>Split Details</Label>
      {selectedFriends.map((friendId) => {
        const friend = friends.find(f => f.id === friendId);
        if (!friend) return null;
        
        const split = splits.find(s => s.friendId === friendId);
        const value = splitMethod === "percentage" 
          ? split?.percentage?.toString() || ""
          : split?.amount?.toString() || "";
        
        return (
          <div key={friendId} className="flex items-center space-x-2">
            <Label htmlFor={`split-${friendId}`} className="w-24">
              {friend.name}
            </Label>
            <Input
              type="number"
              id={`split-${friendId}`}
              value={value}
              placeholder={splitMethod === "percentage" ? "%" : "0.00"}
              className="w-24"
              step={splitMethod === "percentage" ? "1" : "0.01"}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                if (!isNaN(newValue)) {
                  onSplitChange(prev => {
                    const newSplits = prev.filter(s => s.friendId !== friendId);
                    if (splitMethod === "percentage") {
                      newSplits.push({
                        friendId,
                        amount: 0, // Will be calculated on submit
                        percentage: newValue
                      });
                    } else {
                      newSplits.push({
                        friendId,
                        amount: newValue
                      });
                    }
                    return newSplits;
                  });
                }
              }}
            />
            <span className="text-sm text-muted-foreground">
              {splitMethod === "percentage" ? "%" : "$"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
