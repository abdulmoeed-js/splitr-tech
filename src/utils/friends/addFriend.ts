
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

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
