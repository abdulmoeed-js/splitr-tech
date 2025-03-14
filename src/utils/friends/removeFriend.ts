
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Remove a friend
export const removeFriend = async (
  session: Session | null,
  friendId: string
) => {
  if (session?.user) {
    // Remove friend from database
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendId)
      .eq('user_id', session.user.id);
    
    if (error) throw error;
  }

  return friendId;
};
