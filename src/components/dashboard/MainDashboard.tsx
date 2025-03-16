
import { Friend, Expense, PaymentReminder, SettlementPayment } from "@/types/expense";
import { DashboardBalanceSummary } from "@/components/dashboard/DashboardBalanceSummary";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { SettlementDialogWrapper } from "@/components/dashboard/SettlementDialogWrapper";
import { useSettlementDialogState } from "@/hooks/useSettlementDialogState";

interface MainDashboardProps {
  validExpenses: Expense[];
  friends: Friend[];
  filteredFriends: Friend[];
  payments: SettlementPayment[];
  reminders: PaymentReminder[];
  hasUnreadReminders: boolean;
  onAddExpense: (description: string, amount: number, paidBy: string, splits: any[]) => void;
  onSettleDebt: (payment: SettlementPayment) => void;
  onMarkReminderAsRead: (reminderId: string) => void;
  onSettleReminder: (reminder: PaymentReminder) => void;
  onDeleteExpense: (expenseId: string) => Promise<boolean>;
}

export function MainDashboard({
  validExpenses,
  friends,
  filteredFriends,
  payments,
  reminders,
  hasUnreadReminders,
  onAddExpense,
  onSettleDebt,
  onMarkReminderAsRead,
  onSettleReminder,
  onDeleteExpense
}: MainDashboardProps) {
  // Use our custom hook to manage settlement dialog state
  const {
    isSettlementOpen,
    setIsSettlementOpen,
    selectedReminder,
    setSelectedReminder,
    openSettlementDialog
  } = useSettlementDialogState();

  return (
    <>
      {/* Balance summary and add expense button */}
      <DashboardBalanceSummary
        expenses={validExpenses}
        filteredFriends={filteredFriends}
        payments={payments}
        onAddExpense={onAddExpense}
      />

      {/* Main content tabs */}
      <DashboardTabs
        expenses={validExpenses}
        friends={friends}
        filteredFriends={filteredFriends}
        payments={payments}
        reminders={reminders}
        hasUnreadReminders={hasUnreadReminders}
        onSettleDebt={onSettleDebt}
        onMarkReminderAsRead={onMarkReminderAsRead}
        onSettleReminder={openSettlementDialog}
        onDeleteExpense={onDeleteExpense}
      />

      {/* Settlement Dialog */}
      <SettlementDialogWrapper
        friends={friends}
        expenses={validExpenses}  // Add the missing expenses prop
        payments={payments}      // Add the missing payments prop
        selectedReminder={selectedReminder}
        onSettleReminder={onSettleReminder}
        onSettleDebt={onSettleDebt}
        isSettlementOpen={isSettlementOpen}
        setIsSettlementOpen={setIsSettlementOpen}
        setSelectedReminder={setSelectedReminder}
      />
    </>
  );
}
