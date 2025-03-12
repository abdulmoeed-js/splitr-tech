
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

// Add a new friend to the database
export const addFriend = async (
  session: Session | null, 
  { name, email, phone }: { name: string; email?: string; phone?: string }
) => {
  if (!session?.user) {
    // Generate a local ID for non-authenticated users
    return { 
      id: Date.now().toString(), 
      name, 
      email, 
      phone,
      isInvited: false,
      isComplete: !!name 
    };
  }

  const isComplete = !!name;
  const isInvited = false;

  const { data, error } = await supabase
    .from('friends')
    .insert({
      user_id: session.user.id,
      name: name || "",
      email,
      phone,
      is_invited: isInvited,
      is_complete: isComplete
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return { 
    id: data.id, 
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    isInvited: data.is_invited || false,
    isComplete: data.is_complete || false
  };
};

// Update an existing friend
export const updateFriend = async (
  session: Session | null,
  friend: Partial<Friend> & { id: string }
) => {
  if (!session?.user) {
    return friend;
  }

  const { id, ...updateData } = friend;
  const isComplete = !!friend.name;

  const { data, error } = await supabase
    .from('friends')
    .update({
      name: friend.name,
      email: friend.email,
      phone: friend.phone,
      is_invited: friend.isInvited,
      is_complete: isComplete
    })
    .eq('id', id)
    .eq('user_id', session.user.id)
    .select()
    .single();
  
  if (error) throw error;
  
  return { 
    id: data.id, 
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    isInvited: data.is_invited || false,
    isComplete: data.is_complete || false
  };
};

// Invite a friend via email or phone
export const inviteFriend = async (
  session: Session | null, 
  { email, phone }: { email?: string; phone?: string }
) => {
  if (!email && !phone) {
    throw new Error("Either email or phone is required to invite a friend");
  }

  const invitedName = email ? email.split('@')[0] : phone;

  if (!session?.user) {
    // For non-authenticated users, just create a local friend
    return { 
      id: Date.now().toString(), 
      name: invitedName || "Invited Friend",
      email, 
      phone,
      isInvited: true,
      isComplete: false
    };
  }

  // Create a new friend with invited status
  const { data, error } = await supabase
    .from('friends')
    .insert({
      user_id: session.user.id,
      name: invitedName || "Invited Friend",
      email,
      phone,
      is_invited: true,
      is_complete: false
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return { 
    id: data.id, 
    name: data.name,
    email: data.email || undefined,
    phone: data.phone || undefined,
    isInvited: data.is_invited,
    isComplete: data.is_complete
  };
};

// Check if a friend has associated expenses
export const checkFriendHasExpenses = async (
  session: Session | null,
  friendId: string
) => {
  if (!session?.user) {
    return false;
  }

  // Check if friend is payer or has splits in any expense
  const { data: paidByData } = await supabase
    .from('expenses')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('paid_by', friendId)
    .limit(1);
  
  if (paidByData && paidByData.length > 0) return true;
  
  const { data: splitData } = await supabase
    .from('expense_splits')
    .select('id')
    .eq('friend_id', friendId)
    .limit(1);
  
  return splitData && splitData.length > 0;
};

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
