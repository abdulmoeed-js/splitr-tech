
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

// Get friends from database or default friends for non-authenticated users
export const fetchFriends = async (session: Session | null, userName: string) => {
  if (!session?.user) {
    // Return default friends for non-authenticated users
    return [
      { id: "1", name: userName },
      { id: "2", name: "Alice" },
      { id: "3", name: "Bob" },
      { id: "4", name: "Charlie" },
    ] as Friend[];
  }

  // First, ensure the user has a "You" entry
  const userFriendExists = await supabase
    .from('friends')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('name', userName)
    .single();
  
  if (userFriendExists.error && userFriendExists.error.code === 'PGRST116') {
    // "You" friend doesn't exist, create it
    await supabase
      .from('friends')
      .insert({
        user_id: session.user.id,
        name: userName
      });
  }

  // Now fetch all friends
  const { data, error } = await supabase
    .from('friends')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  // Convert database records to Friend objects
  return data.map(friend => ({
    id: friend.id,
    name: friend.name,
    email: friend.email || undefined,
    phone: friend.phone || undefined,
    isInvited: friend.is_invited || false,
    isComplete: friend.is_complete || false
  }));
};
