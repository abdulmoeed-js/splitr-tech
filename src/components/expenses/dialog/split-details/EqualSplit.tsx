
import { Friend, Split } from "@/types/expense";

interface EqualSplitProps {
  splits: Split[];
  friends: Friend[];
}

export function EqualSplit({ splits, friends }: EqualSplitProps) {
  // Create a map for quick lookup of friend names
  const friendsMap = friends.reduce((map, friend) => {
    map[friend.id] = friend.name;
    return map;
  }, {} as Record<string, string>);

  if (!splits.length) {
    return <p className="text-muted-foreground text-sm">No friends selected</p>;
  }

  const splitAmount = splits[0]?.amount || 0;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Everyone pays the same amount</p>
      
      <div className="space-y-1">
        {splits.map((split) => (
          <div key={split.friendId} className="flex justify-between items-center">
            <span className="text-sm">{friendsMap[split.friendId] || 'Unknown'}</span>
            <span className="text-sm font-medium">Rs. {splitAmount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
