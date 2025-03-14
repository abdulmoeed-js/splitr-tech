
import { supabase } from "@/integrations/supabase/client";
import { PaymentReminder } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

export const settleReminder = async (
  reminder: PaymentReminder,
  session: Session | null
) => {
  if (!session?.user) return reminder;

  const { error } = await supabase
    .from('payment_reminders')
    .update({ is_paid: true })
    .eq('id', reminder.id)
    .eq('user_id', session.user.id);
  
  if (error) throw error;
  
  // Also create a payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      user_id: session.user.id,
      from_friend_id: reminder.fromFriendId,
      to_friend_id: reminder.toFriendId,
      amount: reminder.amount,
      status: 'completed',
      method: 'in-app'
    });
  
  if (paymentError) throw paymentError;
  
  return reminder;
};
