
import { supabase } from "@/integrations/supabase/client";
import { PaymentReminder } from "@/types/expense";
import { Session } from "@supabase/supabase-js";

export const fetchReminders = async (session: Session | null) => {
  if (!session?.user) {
    return [] as PaymentReminder[];
  }

  const { data, error } = await supabase
    .from('payment_reminders')
    .select('*')
    .eq('user_id', session.user.id)
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  
  return data.map(reminder => ({
    id: reminder.id,
    fromFriendId: reminder.from_friend_id,
    toFriendId: reminder.to_friend_id,
    amount: Number(reminder.amount),
    dueDate: new Date(reminder.due_date),
    isRead: reminder.is_read,
    isPaid: reminder.is_paid
  }));
};
