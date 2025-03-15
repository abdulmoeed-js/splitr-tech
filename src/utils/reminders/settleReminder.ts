
import { supabase } from "@/integrations/supabase/client";
import { PaymentReminder } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

export const settleReminder = async (
  reminder: PaymentReminder,
  session: Session | null
) => {
  if (!session?.user) {
    // For local mode just return the reminder with isPaid set to true
    return {
      ...reminder,
      isPaid: true
    };
  }

  // Update the reminder in the database
  const { error } = await supabase
    .from('payment_reminders')
    .update({ is_paid: true })
    .eq('id', reminder.id)
    .eq('user_id', session.user.id);
  
  if (error) throw error;
  
  // Also create a payment record for this settlement
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      user_id: session.user.id,
      from_friend_id: reminder.fromFriendId,
      to_friend_id: reminder.toFriendId,
      amount: reminder.amount,
      date: new Date().toISOString(),
      status: 'completed',
      method: 'in-app',
      payment_reminder_id: reminder.id
    });
  
  if (paymentError) throw paymentError;
  
  // Return the updated reminder
  return {
    ...reminder,
    isPaid: true
  };
};
