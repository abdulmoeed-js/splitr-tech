
import { Card } from "@/components/ui/card";
import { Friend, Split } from "@/types/expense";

interface EqualSplitProps {
  splits: Split[];
  friends: Friend[];
}

export function EqualSplit({ splits, friends }: EqualSplitProps) {
  return (
    <div className="space-y-4">
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
