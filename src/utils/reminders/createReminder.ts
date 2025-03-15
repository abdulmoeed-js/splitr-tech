
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export type NewReminderData = {
  fromFriendId: string;
  toFriendId: string;
  amount: number;
  dueDate: Date;
};

export const createReminder = async (
  newReminder: NewReminderData,
  session: Session | null
) => {
  const currentDate = new Date();
  
  if (!session?.user) {
    return {
      id: Date.now().toString(),
      fromFriendId: newReminder.fromFriendId,
      toFriendId: newReminder.toFriendId,
      amount: newReminder.amount,
      dueDate: newReminder.dueDate,
      createdAt: currentDate,
      isRead: false,
      isPaid: false
    };
  }

  const { data, error } = await supabase
    .from('payment_reminders')
    .insert({
      user_id: session.user.id,
      from_friend_id: newReminder.fromFriendId,
      to_friend_id: newReminder.toFriendId,
      amount: newReminder.amount,
      due_date: newReminder.dueDate.toISOString(),
      created_at: currentDate.toISOString(),
      is_read: false,
      is_paid: false
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    fromFriendId: data.from_friend_id,
    toFriendId: data.to_friend_id,
    amount: Number(data.amount),
    dueDate: new Date(data.due_date),
    createdAt: new Date(data.created_at),
    isRead: data.is_read,
    isPaid: data.is_paid,
    message: data.message
  };
};
