
import { supabase } from "@/integrations/supabase/client";
import { PaymentReminder } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";

export const useReminders = (session: Session | null) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reminders
  const { data: reminders = [], isLoading: isRemindersLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
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
    },
    enabled: !!session
  });

  // Calculate if there are any unread reminders
  const hasUnreadReminders = reminders.some(reminder => !reminder.isRead);

  // Mark reminder as read mutation
  const markReminderAsReadMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      if (!session?.user) return reminderId;

      const { error } = await supabase
        .from('payment_reminders')
        .update({ is_read: true })
        .eq('id', reminderId)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      return reminderId;
    },
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

  // Settle reminder mutation
  const settleReminderMutation = useMutation({
    mutationFn: async (reminder: PaymentReminder) => {
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
    },
    onSuccess: (reminder) => {
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

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: async (newReminder: { 
      fromFriendId: string; 
      toFriendId: string; 
      amount: number;
      dueDate: Date;
    }) => {
      if (!session?.user) {
        return {
          id: Date.now().toString(),
          fromFriendId: newReminder.fromFriendId,
          toFriendId: newReminder.toFriendId,
          amount: newReminder.amount,
          dueDate: newReminder.dueDate,
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
        isRead: data.is_read,
        isPaid: data.is_paid
      };
    },
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

  return {
    reminders,
    isRemindersLoading,
    isLoading,
    hasUnreadReminders,
    handleMarkReminderAsRead: (reminderId: string) => {
      markReminderAsReadMutation.mutate(reminderId);
    },
    handleSettleReminder: (reminder: PaymentReminder) => {
      settleReminderMutation.mutate(reminder);
    },
    createReminder: (reminderData: { 
      fromFriendId: string; 
      toFriendId: string; 
      amount: number;
      dueDate: Date;
    }) => {
      createReminderMutation.mutate(reminderData);
    },
    markReminderAsRead: (reminderId: string) => {
      markReminderAsReadMutation.mutate(reminderId);
    },
    settleReminder: (reminder: PaymentReminder) => {
      settleReminderMutation.mutate(reminder);
    }
  };
};
