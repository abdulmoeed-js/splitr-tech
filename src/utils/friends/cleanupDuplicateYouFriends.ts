import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const cleanupDuplicateYouFriends = async (session: Session | null, userName: string) => {
  if (!session?.user) {
    console.log("No authenticated user session, skipping cleanup");
    return;
  }

  try {
    // Find all "You" entries - use case-insensitive matching
    console.log(`Looking for all instances of "${userName}" (case-insensitive) for user ${session.user.id}`);
    const { data: allFriends, error: findError } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', session.user.id);
    
    if (findError) {
      console.error("Error finding friends:", findError);
      throw findError;
    }
    
    // Filter for case-insensitive matches to userName
    const youFriends = allFriends?.filter(friend => 
      friend.name.toLowerCase() === userName.toLowerCase()
    ) || [];
    
    if (!youFriends || youFriends.length <= 1) {
      // No duplicates found or no "You" entries at all
      console.log(`Found ${youFriends?.length || 0} "${userName}" entries, no cleanup needed`);
      return;
    }
    
    console.log(`Found ${youFriends.length} entries for "${userName}", keeping only the oldest one`);
    
    // Sort by created_at to find the oldest entry
    youFriends.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    // Keep the oldest entry
    const oldestYouFriendId = youFriends[0].id;
    
    // Delete all other entries
    const { error: deleteError } = await supabase
      .from('friends')
      .delete()
      .eq('user_id', session.user.id)
      .in('id', youFriends.slice(1).map(f => f.id)); // Use 'in' to delete all duplicates at once
    
    if (deleteError) {
      console.error("Error deleting duplicate You friends:", deleteError);
      throw deleteError;
    }
    
    console.log(`Successfully removed ${youFriends.length - 1} duplicate "${userName}" entries`);
  } catch (error) {
    console.error("Error in cleanupDuplicateYouFriends:", error);
    throw error;
  }
};
