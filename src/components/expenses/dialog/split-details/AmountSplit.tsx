
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Friend, Split } from "@/types/expense";

interface AmountSplitProps {
  splits: Split[];
  friends: Friend[];
  amount: number;
  onSplitChange: (friendId: string, value: string, field: 'amount' | 'percentage') => void;
}

export function AmountSplit({ splits, friends, amount, onSplitChange }: AmountSplitProps) {
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
                  <span>Rs.</span>
                  <Input
                    type="number"
                    value={split.amount || ''}
                    onChange={(e) => onSplitChange(split.friendId, e.target.value, 'amount')}
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
