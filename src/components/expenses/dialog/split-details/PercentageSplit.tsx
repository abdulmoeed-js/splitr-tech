
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  return (
    <div className="space-y-4">
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
                    onChange={(e) => onSplitChange(split.friendId, e.target.value, 'percentage')}
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
