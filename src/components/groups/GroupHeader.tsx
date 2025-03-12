
import { Button } from "@/components/ui/button";
import { FriendGroupDialog } from "@/components/groups/FriendGroupDialog";
import { Friend, FriendGroup } from "@/types/expense";
import { useState } from "react";
import { Users } from "lucide-react";

export interface GroupHeaderProps {
  selectedGroupId?: string | null;
  onClearSelection?: () => void;
  handleCreateGroup?: (name: string, memberIds: string[]) => void;
  friends?: Friend[];
  groups?: FriendGroup[];
}

export const GroupHeader = ({
  selectedGroupId,
  onClearSelection,
  handleCreateGroup,
  friends = [],
  groups = [],
}: GroupHeaderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedGroup = selectedGroupId 
    ? groups.find(g => g.id === selectedGroupId) 
    : null;

  const handleAddGroup = (name: string, memberIds: string[]) => {
    if (handleCreateGroup) {
      handleCreateGroup(name, memberIds);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-semibold">
          {selectedGroup ? selectedGroup.name : "All Friends"}
        </h2>
      </div>
      
      <div className="flex gap-2">
        {selectedGroupId && onClearSelection && (
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            View All
          </Button>
        )}
        
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          Create Group
        </Button>
      </div>

      <FriendGroupDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAddGroup}
        friends={friends}
      />
    </div>
  );
};
