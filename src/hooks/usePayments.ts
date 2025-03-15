
import { supabase } from "@/integrations/supabase/client";
import { SettlementPayment } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";

export const usePayments = (session: Session | null) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch payments
  const { data: payments = [], isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      if (!session?.user) {
        return [] as SettlementPayment[];
      }

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(payment => ({
        id: payment.id,
        fromFriendId: payment.from_friend_id,
        toFriendId: payment.to_friend_id,
        amount: Number(payment.amount),
        date: new Date(payment.date),
        status: payment.status as "pending" | "completed",
        method: payment.method as "in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank" | "stripe" | "paypal",
        paymentMethodId: payment.payment_method_id,
        receiptUrl: payment.receipt_url
      }));
    },
    enabled: !!session
  });

  // Add payment mutation
  const addPaymentMutation = useMutation({
    mutationFn: async (newPayment: { 
      fromFriendId: string; 
      toFriendId: string; 
      amount: number;
      method: "in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank" | "stripe" | "paypal";
      status: "pending" | "completed";
      paymentMethodId?: string;
      receiptUrl?: string;
    }) => {
      if (!session?.user) {
        // Create a local payment for non-authenticated users
        return {
          id: Date.now().toString(),
          fromFriendId: newPayment.fromFriendId,
          toFriendId: newPayment.toFriendId,
          amount: newPayment.amount,
          date: new Date(),
          status: newPayment.status,
          method: newPayment.method,
          paymentMethodId: newPayment.paymentMethodId,
          receiptUrl: newPayment.receiptUrl
        };
      }

      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: session.user.id,
          from_friend_id: newPayment.fromFriendId,
          to_friend_id: newPayment.toFriendId,
          amount: newPayment.amount,
          status: newPayment.status,
          method: newPayment.method,
          payment_method_id: newPayment.paymentMethodId,
          receipt_url: newPayment.receiptUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        fromFriendId: data.from_friend_id,
        toFriendId: data.to_friend_id,
        amount: Number(data.amount),
        date: new Date(data.date),
        status: data.status as "pending" | "completed",
        method: data.method as "in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank" | "stripe" | "paypal",
        paymentMethodId: data.payment_method_id,
        receiptUrl: data.receipt_url
      };
    },
    onSuccess: (newPayment) => {
      queryClient.setQueryData(['payments'], (oldPayments: SettlementPayment[] = []) => 
        [newPayment, ...oldPayments]
      );
      
      // Also update any related reminders
      queryClient.setQueryData(['reminders'], (oldReminders: any[] = []) => 
        oldReminders.map(reminder => 
          reminder.fromFriendId === newPayment.fromFriendId && 
          reminder.toFriendId === newPayment.toFriendId && 
          !reminder.isPaid
            ? { ...reminder, isPaid: true }
            : reminder
        )
      );
    }
  });

  return {
    payments,
    isPaymentsLoading,
    isLoading,
    handleSettleDebt: (payment: SettlementPayment) => {
      addPaymentMutation.mutate({
        fromFriendId: payment.fromFriendId,
        toFriendId: payment.toFriendId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        paymentMethodId: payment.paymentMethodId,
        receiptUrl: payment.receiptUrl
      });
    },
    settleDebt: (payment: SettlementPayment) => {
      addPaymentMutation.mutate({
        fromFriendId: payment.fromFriendId,
        toFriendId: payment.toFriendId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        paymentMethodId: payment.paymentMethodId,
        receiptUrl: payment.receiptUrl
      });
    }
  };
};
