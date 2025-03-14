
import { supabase } from "@/integrations/supabase/client";
import { PaymentReminder } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

export const settleReminder = async (
  reminder: PaymentReminder,
  session: Session | null
) => {
  console.log("Settling reminder:", reminder, "Authenticated:", !!session);
  
  if (!session?.user) {
    console.log("No active session, returning reminder without changes");
    return reminder;
  }

  try {
    console.log("Updating reminder as paid in database");
    const { error } = await supabase
      .from('payment_reminders')
      .update({ is_paid: true })
      .eq('id', reminder.id)
      .eq('user_id', session.user.id);
    
    if (error) {
      console.error("Error marking reminder as paid:", error);
      throw error;
    }
    
    console.log("Creating payment record");
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
    
    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      throw paymentError;
    }
    
    console.log("Reminder settled successfully, payment record created");
    return reminder;
  } catch (error) {
    console.error("Error in settleReminder:", error);
    throw error;
  }
};
