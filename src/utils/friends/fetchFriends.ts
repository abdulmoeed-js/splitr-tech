
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
    // First, ensure the user has a "You" entry
    const userFriendExists = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('name', userName)
      .single();
    
    if (userFriendExists.error && userFriendExists.error.code === 'PGRST116') {
      // "You" friend doesn't exist, create it
      console.log(`Creating "You" friend entry for user ${session.user.id} with name ${userName}`);
      await supabase
        .from('friends')
        .insert({
          user_id: session.user.id,
          name: userName,
          is_complete: true
        });
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
