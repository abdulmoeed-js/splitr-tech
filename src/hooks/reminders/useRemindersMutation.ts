
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { PaymentReminder } from "@/types/expense";
import { Session } from "@supabase/supabase-js";
import { markReminderAsRead, settleReminder, createReminder, NewReminderData } from "@/utils/reminders";

// Hook for mark as read mutation
export const useMarkReminderAsReadMutation = (session: Session | null) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reminderId: string) => markReminderAsRead(reminderId, session),
    onSuccess: (reminderId) => {
      queryClient.setQueryData(['reminders'], (oldReminders: PaymentReminder[] = []) => 
        oldReminders.map(reminder => 
          reminder.id === reminderId
            ? { ...reminder, isRead: true }
            : reminder
        )
      );
    }
  });
};

// Hook for settle reminder mutation
export const useSettleReminderMutation = (session: Session | null) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reminder: PaymentReminder) => settleReminder(session, reminder),
    onSuccess: (success, reminder) => {
      if (!success) return;
      
      // Update reminders list
      queryClient.setQueryData(['reminders'], (oldReminders: PaymentReminder[] = []) => 
        oldReminders.map(r => 
          r.id === reminder.id
            ? { ...r, isPaid: true }
            : r
        )
      );
      
      // Invalidate payments to fetch the new payment
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      
      toast({
        title: "Payment Completed",
        description: `The payment of ${reminder.amount} has been made`
      });
    }
  });
};

// Hook for create reminder mutation
export const useCreateReminderMutation = (session: Session | null) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newReminder: NewReminderData) => createReminder(newReminder, session),
    onSuccess: (newReminder) => {
      queryClient.setQueryData(['reminders'], (oldReminders: PaymentReminder[] = []) => 
        [newReminder, ...oldReminders]
      );
      
      toast({
        title: "Reminder Created",
        description: `Payment reminder for ${newReminder.amount} has been created`
      });
    }
  });
};
