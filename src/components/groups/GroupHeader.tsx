
import { FriendGroup, Friend } from "@/types/expense";
import { FriendGroupDialog } from "@/components/groups/FriendGroupDialog";
import { FriendGroupList } from "@/components/groups/FriendGroupList";

interface GroupHeaderProps {
  groups: FriendGroup[];
  friends: Friend[];
  selectedGroupId: string | null;
  onAddGroup: (group: FriendGroup) => void;
  onSelectGroup: (groupId: string | null) => void;
}

export const GroupHeader = ({ 
  groups, 
  friends,
  selectedGroupId,
  onAddGroup,
  onSelectGroup 
}: GroupHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Friend Groups</h2>
        <FriendGroupDialog 
          friends={friends}
          groups={groups}
          onAddGroup={onAddGroup}
        />
      </div>
      <FriendGroupList 
        groups={groups}
        onSelectGroup={onSelectGroup}
        selectedGroupId={selectedGroupId}
      />
    </div>
  );
};
