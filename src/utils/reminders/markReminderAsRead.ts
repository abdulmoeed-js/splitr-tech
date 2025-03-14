
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const markReminderAsRead = async (
  reminderId: string, 
  session: Session | null
) => {
  console.log("Marking reminder as read:", reminderId, "Authenticated:", !!session);
  
  if (!session?.user) {
    console.log("No active session, returning ID without changes");
    return reminderId;
  }

  try {
    console.log("Updating reminder in database");
    const { error } = await supabase
      .from('payment_reminders')
      .update({ is_read: true })
      .eq('id', reminderId)
      .eq('user_id', session.user.id);
    
    if (error) {
      console.error("Error marking reminder as read:", error);
      throw error;
    }
    
    console.log("Reminder marked as read successfully");
    return reminderId;
  } catch (error) {
    console.error("Error in markReminderAsRead:", error);
    throw error;
  }
};
