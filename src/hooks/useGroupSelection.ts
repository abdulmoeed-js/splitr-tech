
import { useState } from "react";
import { FriendGroup } from "@/types/expense";

export function useGroupSelection(groups: FriendGroup[]) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  const selectedGroup = selectedGroupId
    ? groups.find(g => g.id === selectedGroupId)
    : null;

  const handleSelectGroup = (groupId: string | null) => {
    setSelectedGroupId(groupId);
  };

  return {
    selectedGroupId,
    selectedGroup,
    handleSelectGroup
  };
}
