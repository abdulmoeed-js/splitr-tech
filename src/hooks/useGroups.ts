
import { supabase } from "@/integrations/supabase/client";
import { FriendGroup, Friend } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";

export const useGroups = (session: Session | null, friends: Friend[]) => {
  const queryClient = useQueryClient();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch friend groups
  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      if (!session?.user) {
        return [] as FriendGroup[];
      }

      const { data, error } = await supabase
        .from('friend_groups')
        .select(`
          *,
          group_members:group_members(*)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // We need to join with friends to get the names
      const friendsMap = friends.reduce((map, friend) => {
        map[friend.id] = friend;
        return map;
      }, {} as Record<string, Friend>);
      
      return data.map(group => ({
        id: group.id,
        name: group.name,
        createdAt: new Date(group.created_at),
        members: group.group_members
          .map((member: any) => friendsMap[member.friend_id])
          .filter(Boolean) // Only include friends that exist
      }));
    },
    enabled: !!session && friends.length > 0
  });

  // Add group mutation
  const addGroupMutation = useMutation({
    mutationFn: async (newGroup: { name: string; memberIds: string[] }) => {
      if (!session?.user) {
        // Create a local group for non-authenticated users
        return {
          id: Date.now().toString(),
          name: newGroup.name,
          createdAt: new Date(),
          members: friends.filter(friend => newGroup.memberIds.includes(friend.id))
        };
      }

      // Insert the group
      const { data: groupData, error: groupError } = await supabase
        .from('friend_groups')
        .insert({
          user_id: session.user.id,
          name: newGroup.name
        })
        .select()
        .single();
      
      if (groupError) throw groupError;
      
      // Insert the group members
      const groupMembers = newGroup.memberIds.map(memberId => ({
        group_id: groupData.id,
        friend_id: memberId
      }));
      
      const { error: membersError } = await supabase
        .from('group_members')
        .insert(groupMembers);
      
      if (membersError) throw membersError;
      
      // Return the complete group with members
      return {
        id: groupData.id,
        name: groupData.name,
        createdAt: new Date(groupData.created_at),
        members: friends.filter(friend => newGroup.memberIds.includes(friend.id))
      };
    },
    onSuccess: (newGroup) => {
      queryClient.setQueryData(['groups'], (oldGroups: FriendGroup[] = []) => 
        [newGroup, ...oldGroups]
      );
      
      toast({
        title: "Group Created",
        description: `${newGroup.name} has been created with ${newGroup.members.length} friends`
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Group",
        description: error.message || "An error occurred while creating group",
        variant: "destructive"
      });
    }
  });

  return {
    groups,
    isGroupsLoading,
    isLoading,
    selectedGroupId,
    handleSelectGroup: (groupId: string | null) => {
      setSelectedGroupId(groupId);
    },
    handleAddGroup: (group: FriendGroup) => {
      addGroupMutation.mutate({ 
        name: group.name, 
        memberIds: group.members.map(m => m.id) 
      });
    },
    addGroup: (name: string, memberIds: string[]) => {
      addGroupMutation.mutate({ name, memberIds });
    }
  };
};
