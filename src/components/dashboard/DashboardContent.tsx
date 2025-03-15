
import { useState, useEffect } from "react";
import { Friend, FriendGroup, Expense, PaymentReminder, SettlementPayment } from "@/types/expense";
import { Session } from "@supabase/supabase-js";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { RefreshButton } from "@/components/dashboard/RefreshButton";
import { useBalanceCalculation } from "@/hooks/useBalanceCalculation";

interface DashboardContentProps {
  session: Session | null;
  expenses: Expense[];
  friends: Friend[];
  groups: FriendGroup[];
  selectedGroupId: string | null;
  reminders: PaymentReminder[];
  payments: SettlementPayment[];
  isLoading: boolean;
  refreshData: () => Promise<any>;
  handleAddExpense: (description: string, amount: number, paidBy: string, splits: any[], groupId?: string) => void;
  handleDeleteExpense: (expenseId: string) => Promise<boolean>;
  handleMarkReminderAsRead: (reminderId: string) => void;
  handleSettleReminder: (reminder: PaymentReminder) => void;
  settleDebt: (payment: SettlementPayment) => void;
}

export function DashboardContent({
  session,
  expenses,
  friends,
  groups,
  selectedGroupId,
  reminders,
  payments,
  isLoading,
  refreshData,
  handleAddExpense,
  handleDeleteExpense,
  handleMarkReminderAsRead,
  handleSettleReminder,
  settleDebt
}: DashboardContentProps) {
  const { getFilteredExpenses } = useBalanceCalculation();
  const hasUnreadReminders = reminders.some(r => !r.isRead);
  
  // Effect to refresh data when component mounts
  useEffect(() => {
    if (session?.user) {
      console.log("Dashboard component mounted, refreshing data");
      refreshData();
    }
  }, [session?.user, refreshData]);

  // Filter expenses and friends based on selected group
  const filteredExpenses = getFilteredExpenses(expenses, selectedGroupId);
  
  // Create a Map of friend IDs to friend objects
  const friendsMap = new Map<string, Friend>();
  if (Array.isArray(friends)) {
    friends.forEach(friend => {
      if (friend && friend.id) {
        friendsMap.set(String(friend.id), friend);
      }
    });
  }
  
  // Filter out expenses with invalid payers or splits
  const validExpenses = filteredExpenses.filter(expense => {
    // Check if the expense has valid data
    if (!expense || !expense.paidBy || !Array.isArray(expense.splits)) {
      return false;
    }
    
    const hasPayer = friends.some(f => String(f.id) === String(expense.paidBy));
    const validSplits = expense.splits.filter(split => 
      split && split.friendId && friends.some(f => String(f.id) === String(split.friendId))
    );
    
    // Only include expenses with a valid payer and at least one valid split
    return hasPayer && validSplits.length > 0;
  });
  
  const filteredFriends = selectedGroupId
    ? groups.find(g => g.id === selectedGroupId)?.members || []
    : friends;

  // Handle adding a new expense
  const handleAddNewExpense = (description: string, amount: number, paidBy: string, splits: any[]) => {
    handleAddExpense(description, amount, paidBy, splits, selectedGroupId || undefined);
  };

  const hasNoData = !isLoading && expenses.length === 0 && friends.length === 0;

  return (
    <div className="space-y-6">
      {/* Refresh button */}
      <div className="flex justify-end">
        <RefreshButton 
          onRefresh={refreshData}
          session={session}
        />
      </div>
      
      {/* Main content area */}
      <div className="space-y-6">
        {isLoading ? (
          <LoadingState />
        ) : hasNoData ? (
          <EmptyDashboard 
            onAddExpense={handleAddNewExpense}
            friends={friends}
          />
        ) : (
          <MainDashboard
            validExpenses={validExpenses}
            friends={friends}
            filteredFriends={filteredFriends}
            payments={payments}
            reminders={reminders}
            hasUnreadReminders={hasUnreadReminders}
            onAddExpense={handleAddNewExpense}
            onSettleDebt={settleDebt}
            onMarkReminderAsRead={handleMarkReminderAsRead}
            onSettleReminder={handleSettleReminder}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
      </div>
    </div>
  );
}
