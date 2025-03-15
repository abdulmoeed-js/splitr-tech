
import { supabase } from "@/integrations/supabase/client";
import { FriendGroup, Friend } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

export const addFriendGroup = async (
  session: Session | null,
  name: string,
  memberIds: string[],
  friends: Friend[]
): Promise<FriendGroup> => {
  console.log("Adding friend group:", { name, memberIds, isAuthenticated: !!session });
  
  if (!session?.user) {
    // For non-authenticated users, create a local group
    const localGroup: FriendGroup = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      members: friends.filter(friend => memberIds.includes(friend.id))
    };
    
    console.log("Created local group:", localGroup);
    return localGroup;
  }

  try {
    // Insert the group
    const { data: groupData, error: groupError } = await supabase
      .from('friend_groups')
      .insert({
        user_id: session.user.id,
        name
      })
      .select()
      .single();
    
    if (groupError) {
      console.error("Error creating friend group:", groupError);
      throw groupError;
    }
    
    // Prepare group members data
    const groupMembers = memberIds.map(memberId => ({
      group_id: groupData.id,
      friend_id: memberId
    }));
    
    // Insert group members
    const { error: membersError } = await supabase
      .from('group_members')
      .insert(groupMembers);
    
    if (membersError) {
      console.error("Error adding group members:", membersError);
      throw membersError;
    }
    
    // Return the complete group with members
    const group: FriendGroup = {
      id: groupData.id,
      name: groupData.name,
      createdAt: new Date(groupData.created_at),
      members: friends.filter(friend => memberIds.includes(friend.id))
    };
    
    console.log("Successfully created friend group:", group);
    return group;
  } catch (error) {
    console.error("Error in addFriendGroup:", error);
    throw error;
  }
};
