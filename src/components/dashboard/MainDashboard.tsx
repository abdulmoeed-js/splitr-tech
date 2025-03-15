
import { useState } from "react";
import { Friend, Expense, PaymentReminder, SettlementPayment } from "@/types/expense";
import { BalanceSummary } from "@/components/BalanceSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseDashboard } from "@/components/expenses/ExpenseDashboard";
import { ExpenseTabContent } from "@/components/expenses/ExpenseTabContent";
import { AddExpenseDialog } from "@/components/expenses/dialog/AddExpenseDialog";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";

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
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<PaymentReminder | null>(null);

  // Handle settling up
  const openSettlementDialog = (reminder: PaymentReminder) => {
    setSelectedReminder(reminder);
    setIsSettlementOpen(true);
  };

  const handleSettleUp = (payment: SettlementPayment) => {
    if (selectedReminder) {
      onSettleReminder(selectedReminder);
    }
    onSettleDebt(payment);
    setIsSettlementOpen(false);
    setSelectedReminder(null);
  };

  // This will be used for the ExpenseDashboard component
  const dashboardProps = {
    filteredExpenses: validExpenses,
    friends,
    filteredFriends,
    payments,
    reminders,
    paymentMethods: [],
    hasUnreadReminders,
    onSettleDebt,
    onMarkReminderAsRead,
    onSettleReminder: openSettlementDialog,
    onDeleteExpense
  };

  return (
    <>
      {/* Balance summary without passing balances directly */}
      <BalanceSummary
        expenses={validExpenses}
        friends={filteredFriends}
        payments={payments}
      />

      {/* Add Expense Button */}
      <div className="flex justify-end">
        <AddExpenseDialog
          onAddExpense={onAddExpense}
          friends={filteredFriends}
        />
      </div>

      {/* Main content tabs */}
      <Tabs defaultValue="dashboard" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4">
          <ExpenseDashboard 
            {...dashboardProps}
          />
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <ExpenseTabContent
            expenses={validExpenses}
            friends={filteredFriends}
            reminders={reminders}
            onMarkReminderAsRead={onMarkReminderAsRead}
            onSettleReminder={openSettlementDialog}
            payments={payments}
            onDeleteExpense={onDeleteExpense}
          />
        </TabsContent>
      </Tabs>

      {/* Settlement Dialog */}
      {selectedReminder && (
        <SettlementDialog
          fromFriend={{id: "1", name: "You"}}
          toFriend={selectedReminder?.toFriendId ? friends.find(f => f.id === selectedReminder.toFriendId) || {id: "unknown", name: "Unknown"} : {id: "unknown", name: "Unknown"}}
          amount={selectedReminder?.amount || 0}
          paymentMethods={[]}
          onSettleDebt={handleSettleUp}
          isOpen={isSettlementOpen}
          onOpenChange={setIsSettlementOpen}
        />
      )}
    </>
  );
}
