
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

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
