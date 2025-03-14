import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useSession } from "@/hooks/useSession";
import { useFriends } from "@/hooks/useFriends";
import { useGroups } from "@/hooks/useGroups";
import { usePayments } from "@/hooks/usePayments";
import { useReminders } from "@/hooks/useReminders";
import { useBalanceCalculation } from "@/hooks/useBalanceCalculation";
import { Friend, FriendGroup, Expense, PaymentReminder, SettlementPayment } from "@/types/expense";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceSummary } from "@/components/BalanceSummary";
import { ExpenseDashboard } from "@/components/expenses/ExpenseDashboard";
import { ExpenseTabContent } from "@/components/expenses/ExpenseTabContent";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";

export default function Home() {
  const { session, userName } = useSession();
  const { expenses, handleAddExpense } = useExpenses();
  const { friends, handleAddFriend, handleInviteFriend } = useFriends(session, userName);
  const { groups, addGroup } = useGroups(session, friends);
  const { payments, settleDebt } = usePayments(session);
  const { reminders, handleMarkReminderAsRead, handleSettleReminder } = useReminders(session);
  const { calculateBalances, getFilteredExpenses } = useBalanceCalculation();

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<PaymentReminder | null>(null);

  // Filter expenses and friends based on selected group
  const filteredExpenses = getFilteredExpenses(expenses, selectedGroupId);
  const filteredFriends = selectedGroupId
    ? groups.find(g => g.id === selectedGroupId)?.members || []
    : friends;

  // Calculate balances for the current view
  const balances = calculateBalances(filteredExpenses, filteredFriends);

  // Handle adding a new expense
  const handleAddNewExpense = (description: string, amount: number, paidBy: string, splits: any[]) => {
    handleAddExpense(description, amount, paidBy, splits, selectedGroupId || undefined);
    setIsAddExpenseOpen(false);
  };

  // Handle settling up
  const openSettlementDialog = (reminder: PaymentReminder) => {
    setSelectedReminder(reminder);
    setIsSettlementOpen(true);
  };

  const handleSettleUp = (payment: SettlementPayment) => {
    if (selectedReminder) {
      handleSettleReminder(selectedReminder);
    }
    settleDebt(payment);
    setIsSettlementOpen(false);
    setSelectedReminder(null);
  };

  const selectedGroup = selectedGroupId
    ? groups.find(g => g.id === selectedGroupId)
    : null;

  // Modify component props to fit expected types
  const hasUnreadReminders = reminders.some(r => !r.isRead);
  
  // This will be used for the ExpenseDashboard component
  const dashboardProps = {
    filteredExpenses,
    friends,
    filteredFriends,
    payments,
    reminders,
    paymentMethods: [],
    hasUnreadReminders,
    onSettleDebt: settleDebt,
    onMarkReminderAsRead: handleMarkReminderAsRead,
    onSettleReminder: openSettlementDialog
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="space-y-6">
        {/* Main content area */}
        <div className="space-y-6">
          {/* Balance summary without passing balances directly */}
          <BalanceSummary
            expenses={filteredExpenses}
            friends={filteredFriends}
            payments={payments}
          />

          {/* Add Expense Button */}
          <div className="flex justify-end">
            <AddExpenseDialog
              onAddExpense={handleAddNewExpense}
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
                expenses={filteredExpenses}
                friends={filteredFriends}
                reminders={reminders}
                onMarkReminderAsRead={handleMarkReminderAsRead}
                onSettleReminder={openSettlementDialog}
                payments={payments}
              />
            </TabsContent>
          </Tabs>
          
          {/* Settlement Dialog */}
          <SettlementDialog
            fromFriend={{id: "1", name: "You"}}
            toFriend={selectedReminder?.toFriendId ? friends.find(f => f.id === selectedReminder.toFriendId) || {id: "unknown", name: "Unknown"} : {id: "unknown", name: "Unknown"}}
            amount={selectedReminder?.amount || 0}
            paymentMethods={[]}
            onSettleDebt={handleSettleUp}
          />
        </div>
      </div>
    </div>
  );
}
