import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

// Get friends from database or empty array for non-authenticated users
export const fetchFriends = async (session: Session | null, userName: string) => {
  if (!session?.user) {
    console.log("No authenticated user session, returning empty friends array");
    return [] as Friend[];
  }

  try {
    // First, fetch all existing friends to check if "You" already exists
    console.log(`Fetching all friends for user ${session.user.id} to check for You entry`);
    const { data: allFriends, error: fetchError } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', session.user.id);
    
    if (fetchError) {
      console.error("Error fetching all friends:", fetchError);
      throw fetchError;
    }
    
    // Check if "You" entry exists - IMPORTANT: do a case-insensitive match to prevent duplicates
    const youFriends = allFriends?.filter(friend => 
      friend.name.toLowerCase() === userName.toLowerCase()
    ) || [];
    
    // If no "You" friend exists, create one
    if (youFriends.length === 0) {
      console.log(`Creating "You" friend entry for user ${session.user.id} with name ${userName}`);
      
      // Create the "You" friend
      const { data: newYouFriend, error: insertError } = await supabase
        .from('friends')
        .insert({
          user_id: session.user.id,
          name: userName, // Use exact userName to preserve case
          is_complete: true
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Error creating You friend:", insertError);
        throw insertError;
      }
    } 
    // If multiple "You" entries exist, keep only the oldest one
    else if (youFriends.length > 1) {
      console.log(`Found ${youFriends.length} entries for "You", cleaning up duplicates`);
      await cleanupDuplicates(session, youFriends);
    }

    // Now fetch all friends again to get the updated list
    console.log(`Fetching friends for user ${session.user.id}`);
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching friends:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No friends found for user");
      return [];
    }
    
    console.log(`Fetched ${data.length} friends from database`);

    // Convert database records to Friend objects
    const friends = data.map(friend => ({
      id: friend.id,
      name: friend.name.toLowerCase() === userName.toLowerCase() ? "You" : friend.name, // Display as "You" for the user
      email: friend.email || undefined,
      phone: friend.phone || undefined,
      isInvited: friend.is_invited || false,
      isComplete: friend.is_complete || false
    }));
    
    console.log("Mapped friends:", friends);
    return friends;
  } catch (error) {
    console.error("Error in fetchFriends:", error);
    throw error; // Throw error rather than returning empty array to trigger error state
  }
};

// Helper function to clean up duplicate "You" entries
const cleanupDuplicates = async (session: Session, youFriends: any[]) => {
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
  
  console.log(`Successfully removed ${youFriends.length - 1} duplicate "You" entries`);
};
