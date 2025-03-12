
import { supabase } from "@/integrations/supabase/client";
import { PaymentReminder, Friend } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

export const useReminders = (session: Session | null, friends: Friend[]) => {
  const queryClient = useQueryClient();

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

  // Update reminder mutation
  const updateReminderMutation = useMutation({
    mutationFn: async ({ 
      reminderId, 
      updates 
    }: { 
      reminderId: string; 
      updates: { isRead?: boolean; isPaid?: boolean } 
    }) => {
      if (!session?.user) {
        return { id: reminderId, ...updates };
      }

      const updateData: any = {};
      if (updates.isRead !== undefined) updateData.is_read = updates.isRead;
      if (updates.isPaid !== undefined) updateData.is_paid = updates.isPaid;

      const { error } = await supabase
        .from('payment_reminders')
        .update(updateData)
        .eq('id', reminderId)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      return { id: reminderId, ...updates };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['reminders'], (oldReminders: PaymentReminder[] = []) => 
        oldReminders.map(reminder => 
          reminder.id === data.id
            ? { ...reminder, ...data }
            : reminder
        )
      );
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
          due_date: newReminder.dueDate.toISOString()
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
        [...oldReminders, newReminder]
      );
    }
  });

  // Calculate if there are unread reminders
  const hasUnreadReminders = reminders.some(r => !r.isRead);

  return {
    reminders,
    isRemindersLoading,
    hasUnreadReminders,
    handleMarkReminderAsRead: (reminderId: string) => {
      updateReminderMutation.mutate({ reminderId, updates: { isRead: true } });
    },
    handleSettleReminder: (reminder: PaymentReminder) => {
      updateReminderMutation.mutate({ 
        reminderId: reminder.id, 
        updates: { isPaid: true } 
      });
      
      toast({
        title: "Payment Successful",
        description: `You paid ${friends.find(f => f.id === reminder.toFriendId)?.name} $${reminder.amount.toFixed(2)}`
      });
    },
    createReminder: (reminder: { 
      fromFriendId: string; 
      toFriendId: string; 
      amount: number;
      dueDate: Date;
    }) => {
      createReminderMutation.mutate(reminder);
    }
  };
};
