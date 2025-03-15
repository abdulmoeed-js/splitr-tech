
import { supabase } from "@/integrations/supabase/client";
import { PaymentReminder } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

export const settleReminder = async (
  session: Session | null,
  reminder: PaymentReminder
): Promise<boolean> => {
  if (!session?.user) {
    return false;
  }

  const { error } = await supabase
    .from('payment_reminders')
    .update({
      is_paid: true,
      is_read: true
    })
    .eq('id', reminder.id)
    .eq('user_id', session.user.id);
  
  if (error) throw error;
  
  return true;
};
