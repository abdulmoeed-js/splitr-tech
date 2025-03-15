
import { Input } from "@/components/ui/input";
import { Friend, Split } from "@/types/expense";

interface AmountSplitProps {
  splits: Split[];
  friends: Friend[];
  amount: number;
  onSplitChange: (friendId: string, value: string, field: 'amount' | 'percentage') => void;
}

export function AmountSplit({ 
  splits, 
  friends, 
  amount,
  onSplitChange 
}: AmountSplitProps) {
  // Create a map for quick lookup of friend names
  const friendsMap = friends.reduce((map, friend) => {
    map[friend.id] = friend.name;
    return map;
  }, {} as Record<string, string>);

  // Calculate the total of all splits
  const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
  const isValid = Math.abs(totalSplit - amount) < 0.01;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Split amounts</span>
        <span className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid ? 'Balanced' : `Difference: Rs. ${(amount - totalSplit).toFixed(2)}`}
        </span>
      </div>
      
      <div className="space-y-2">
        {splits.map((split) => (
          <div key={split.friendId} className="flex justify-between items-center space-x-2">
            <span className="text-sm flex-1">{friendsMap[split.friendId] || 'Unknown'}</span>
            <div className="flex items-center">
              <span className="text-sm mr-2">Rs.</span>
              <Input
                type="number"
                value={split.amount || ''}
                onChange={(e) => onSplitChange(split.friendId, e.target.value, 'amount')}
                className="w-24"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
