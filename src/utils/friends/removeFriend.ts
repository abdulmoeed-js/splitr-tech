
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Remove a friend
export const removeFriend = async (
  session: Session | null,
  friendId: string
) => {
  if (session?.user) {
    // For authenticated users with UUID format IDs in the database
    try {
      // Only attempt to delete if it looks like a UUID
      if (isValidUUID(friendId)) {
        const { error } = await supabase
          .from('friends')
          .delete()
          .eq('id', friendId)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
      } else {
        console.error("Invalid UUID format for friendId:", friendId);
        // For development mode, just return the ID without database operations
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  }

  // For non-authenticated users, just return the ID to update client-side state
  return friendId;
};

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
