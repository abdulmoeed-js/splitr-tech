
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const markReminderAsRead = async (
  reminderId: string, 
  session: Session | null
) => {
  if (!session?.user) return reminderId;

  const { error } = await supabase
    .from('payment_reminders')
    .update({ is_read: true })
    .eq('id', reminderId)
    .eq('user_id', session.user.id);
  
  if (error) throw error;
  
  return reminderId;
};
