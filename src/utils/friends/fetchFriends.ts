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
    // First, check if the "You" entry exists
    const { data: existingYouFriend, error: checkError } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('name', userName)
      .limit(1);
    
    if (checkError) {
      console.error("Error checking for You friend:", checkError);
      throw checkError;
    }
    
    // If "You" friend doesn't exist or there are multiple entries, clean up and create a new one
    if (!existingYouFriend || existingYouFriend.length === 0) {
      console.log(`Creating "You" friend entry for user ${session.user.id} with name ${userName}`);
      
      // Create the "You" friend
      const { data: newYouFriend, error: insertError } = await supabase
        .from('friends')
        .insert({
          user_id: session.user.id,
          name: userName,
          is_complete: true
        })
        .select()
        .single();
      
      if (insertError) {
        console.error("Error creating You friend:", insertError);
        throw insertError;
      }
    }
    else if (existingYouFriend.length > 1) {
      // This should not happen due to the LIMIT 1, but let's leave this check for safety
      console.log("Multiple 'You' entries found, cleaning up duplicates");
      
      // Keep the first one and delete the rest
      const firstYouFriendId = existingYouFriend[0].id;
      
      // Delete all other "You" entries
      const { error: deleteError } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', session.user.id)
        .eq('name', userName)
        .neq('id', firstYouFriendId);
      
      if (deleteError) {
        console.error("Error deleting duplicate You friends:", deleteError);
        throw deleteError;
      }
    }

    // Now fetch all friends
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
      name: friend.name,
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
