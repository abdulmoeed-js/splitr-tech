
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { checkFriendHasExpenses } from "./checkFriendHasExpenses";

// Remove a friend
export const removeFriend = async (
  session: Session | null,
  friendId: string
) => {
  if (!session?.user) {
    // For non-authenticated users, just return the ID to update client-side state
    return friendId;
  }

  try {
    // First check if the friend has any expenses
    const hasExpenses = await checkFriendHasExpenses(session, friendId);
    
    if (hasExpenses) {
      throw new Error("Cannot delete a friend who has expenses. Please delete all related expenses first.");
    }
    
    // Also check if the friend is in any group
    const { data: groupMembers, error: groupError } = await supabase
      .from('group_members')
      .select('id')
      .eq('friend_id', friendId)
      .limit(1);
    
    if (groupError) throw groupError;
    
    if (groupMembers && groupMembers.length > 0) {
      throw new Error("Cannot delete a friend who is part of a group. Please remove them from all groups first.");
    }
    
    // Now we can safely delete the friend
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendId)
      .eq('user_id', session.user.id);
    
    if (error) throw error;
    
    return friendId;
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};
