
import { useState } from "react";
import { PaymentReminder } from "@/types/expense";
import { Session } from "@supabase/supabase-js";
import { useRemindersQuery } from "./useRemindersQuery";
import { 
  useMarkReminderAsReadMutation, 
  useSettleReminderMutation,
  useCreateReminderMutation 
} from "./useRemindersMutation";
import { NewReminderData } from "@/utils/reminders";

export const useReminders = (session: Session | null) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch reminders
  const { data: reminders = [], isLoading: isRemindersLoading } = useRemindersQuery(session);
  
  // Calculate if there are any unread reminders
  const hasUnreadReminders = reminders.some(reminder => !reminder.isRead);
  
  // Get mutations
  const markReminderAsReadMutation = useMarkReminderAsReadMutation(session);
  const settleReminderMutation = useSettleReminderMutation(session);
  const createReminderMutation = useCreateReminderMutation(session);

  return {
    reminders,
    isRemindersLoading,
    isLoading,
    hasUnreadReminders,
    // Maintained for backward compatibility
    handleMarkReminderAsRead: (reminderId: string) => {
      markReminderAsReadMutation.mutate(reminderId);
    },
    handleSettleReminder: (reminder: PaymentReminder) => {
      settleReminderMutation.mutate(reminder);
    },
    createReminder: (reminderData: NewReminderData) => {
      createReminderMutation.mutate(reminderData);
    },
    // Also expose these for consistency with other hooks
    markReminderAsRead: (reminderId: string) => {
      markReminderAsReadMutation.mutate(reminderId);
    },
    settleReminder: (reminder: PaymentReminder) => {
      settleReminderMutation.mutate(reminder);
    }
  };
};
