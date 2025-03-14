
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
