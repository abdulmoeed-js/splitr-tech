
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Remove a friend
export const removeFriend = async (
  session: Session | null,
  friendId: string
) => {
  if (session?.user) {
    // For authenticated users
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendId)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Error removing friend:", error);
      throw error;
    }
  }

  // For non-authenticated users, just return the ID to update client-side state
  return friendId;
};
