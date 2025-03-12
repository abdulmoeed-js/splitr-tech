
import { useState, useEffect } from "react";
import { useSession } from "./useSession";
import { useFriends } from "./useFriends";
import { useExpenseData } from "./useExpenseData";
import { useGroups } from "./useGroups";
import { usePayments } from "./usePayments";
import { useReminders } from "./useReminders";
import { useBalanceCalculation } from "./useBalanceCalculation";
import { usePaymentMethods } from "./usePaymentMethods";
import { PaymentReminder, SettlementPayment } from "@/types/expense";
import { useQueryClient } from "@tanstack/react-query";

export const useExpenses = () => {
  const { session, userName, isSessionLoaded, setSessionLoaded } = useSession();
  const queryClient = useQueryClient();
  const [isLoaded, setIsLoaded] = useState(false);

  const { friends, isFriendsLoading, handleAddFriend, handleRemoveFriend } = useFriends(session, userName);
  const { expenses, isExpensesLoading, handleAddExpense } = useExpenseData(session);
  const { groups, isGroupsLoading, selectedGroupId, handleSelectGroup, handleAddGroup } = useGroups(session, friends);
  const { payments, isPaymentsLoading, handleSettleDebt } = usePayments(session);
  const { reminders, isRemindersLoading, hasUnreadReminders, handleMarkReminderAsRead, handleSettleReminder, createReminder } = useReminders(session, friends);
  const { calculateBalances } = useBalanceCalculation(friends, expenses, payments);
  const { paymentMethods } = usePaymentMethods();

  // Track if the data is loaded
  useEffect(() => {
    const isDataLoaded = !session || (
      !isFriendsLoading && 
      !isExpensesLoading && 
      !isGroupsLoading && 
      !isPaymentsLoading && 
      !isRemindersLoading
    );
    
    if (isDataLoaded) {
      setIsLoaded(true);
    }
  }, [
    session, 
    isFriendsLoading, 
    isExpensesLoading, 
    isGroupsLoading, 
    isPaymentsLoading, 
    isRemindersLoading
  ]);

  // Filter friends based on selected group
  const filteredFriends = selectedGroupId
    ? groups.find(g => g.id === selectedGroupId)?.members || friends
    : friends;

  // Filter expenses based on selected group
  const filteredExpenses = selectedGroupId
    ? expenses.filter(expense => expense.groupId === selectedGroupId)
    : expenses;

  // Create reminders from balances
  useEffect(() => {
    if (!session?.user || expenses.length === 0 || reminders.length > 0) {
      return;
    }

    const balances = calculateBalances();
    const newReminders: PaymentReminder[] = [];
    
    Object.entries(balances).forEach(([fromId, friendBalances]) => {
      Object.entries(friendBalances).forEach(([toId, amount]) => {
        if (amount > 0) {
          // Set due date to 1 month from now
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + 1);
          
          newReminders.push({
            id: '', // Will be set by database
            fromFriendId: fromId,
            toFriendId: toId,
            amount: amount,
            dueDate,
            isRead: false,
            isPaid: false
          });
        }
      });
    });
    
    // Create the reminders in batch
    if (newReminders.length > 0) {
      newReminders.forEach(reminder => {
        createReminder({
          fromFriendId: reminder.fromFriendId,
          toFriendId: reminder.toFriendId,
          amount: reminder.amount,
          dueDate: reminder.dueDate
        });
      });
    }
  }, [session, expenses, reminders.length, createReminder]);

  return {
    isLoaded,
    friends,
    filteredFriends,
    expenses,
    filteredExpenses,
    groups,
    selectedGroupId,
    payments,
    reminders,
    paymentMethods,
    hasUnreadReminders,
    calculateBalances,
    handleAddExpense: (description: string, amount: number, paidBy: string, splits: any[]) => {
      handleAddExpense(description, amount, paidBy, splits, selectedGroupId);
    },
    handleAddFriend,
    handleRemoveFriend,
    handleAddGroup,
    handleSelectGroup,
    handleSettleDebt,
    handleMarkReminderAsRead,
    handleSettleReminder: (reminder: PaymentReminder) => {
      // Create a payment from the reminder
      const payment: SettlementPayment = {
        id: Date.now().toString(),
        fromFriendId: reminder.fromFriendId,
        toFriendId: reminder.toFriendId,
        amount: reminder.amount,
        date: new Date(),
        status: "completed",
        method: "in-app",
        receiptUrl: `receipt-${Date.now()}.pdf` // Simulated receipt URL
      };
      
      handleSettleDebt(payment);
      
      // Mark the reminder as paid
      handleSettleReminder(reminder);
    }
  };
};
