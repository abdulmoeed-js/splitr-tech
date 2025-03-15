
import { Input } from "@/components/ui/input";
import { Friend, Split } from "@/types/expense";

interface PercentageSplitProps {
  splits: Split[];
  friends: Friend[];
  totalPercentage: number;
  onSplitChange: (friendId: string, value: string, field: 'amount' | 'percentage') => void;
}

export function PercentageSplit({ 
  splits, 
  friends, 
  totalPercentage,
  onSplitChange 
}: PercentageSplitProps) {
  // Create a map for quick lookup of friend names
  const friendsMap = friends.reduce((map, friend) => {
    map[friend.id] = friend.name;
    return map;
  }, {} as Record<string, string>);

  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Split percentages</span>
        <span className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid ? 'Balanced' : `Total: ${totalPercentage.toFixed(2)}%`}
        </span>
      </div>
      
      <div className="space-y-2">
        {splits.map((split) => (
          <div key={split.friendId} className="flex justify-between items-center space-x-2">
            <span className="text-sm flex-1">{friendsMap[split.friendId] || 'Unknown'}</span>
            <div className="flex items-center">
              <Input
                type="number"
                value={split.percentage || ''}
                onChange={(e) => onSplitChange(split.friendId, e.target.value, 'percentage')}
                className="w-20"
                step="0.1"
                min="0"
                max="100"
              />
              <span className="text-sm ml-2">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
