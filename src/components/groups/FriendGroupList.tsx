
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FriendGroup } from "@/types/expense";
import { Users } from "lucide-react";
import { format } from "date-fns";

interface FriendGroupListProps {
  groups: FriendGroup[];
  onSelectGroup: (groupId: string) => void;
  selectedGroupId: string | null;
}

export const FriendGroupList = ({ 
  groups, 
  onSelectGroup,
  selectedGroupId
}: FriendGroupListProps) => {
  if (groups.length === 0) {
    return (
      <Card className="p-6 text-center glass-panel">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No friend groups created yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card 
        className={`p-4 cursor-pointer hover:shadow-md transition-shadow glass-panel ${!selectedGroupId ? 'bg-secondary/30' : ''}`}
        onClick={() => onSelectGroup(null)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">All Friends</h3>
            </div>
          </div>
        </div>
      </Card>

      {groups.map((group) => (
        <Card 
          key={group.id} 
          className={`p-4 cursor-pointer hover:shadow-md transition-shadow glass-panel ${selectedGroupId === group.id ? 'bg-secondary/30' : ''}`}
          onClick={() => onSelectGroup(group.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary rounded-xl">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{group.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Created {format(group.createdAt, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};
