
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

// Add a new friend to the database
export const addFriend = async (
  session: Session | null, 
  { name, email, phone }: { name: string; email?: string; phone?: string }
) => {
  console.log("Adding friend:", { name, email, phone, isAuthenticated: !!session });
  
  if (!session?.user) {
    console.log("No active session, creating local friend");
    // Generate a local ID for non-authenticated users
    const localFriend = { 
      id: Date.now().toString(), 
      name, 
      email, 
      phone,
      isInvited: false,
      isComplete: !!name 
    };
    console.log("Created local friend:", localFriend);
    return localFriend;
  }

  const isComplete = !!name;
  const isInvited = false;

  try {
    console.log("Inserting friend into database");
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
    
    if (error) {
      console.error("Error adding friend to database:", error);
      throw error;
    }
    
    console.log("Friend added successfully:", data);
    
    const friend = { 
      id: data.id, 
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      isInvited: data.is_invited || false,
      isComplete: data.is_complete || false
    };
    
    console.log("Returning friend:", friend);
    return friend;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
};
