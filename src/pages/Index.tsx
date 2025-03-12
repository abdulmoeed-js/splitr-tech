
import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useSession } from "@/hooks/useSession";
import { useFriends } from "@/hooks/useFriends";
import { useGroups } from "@/hooks/useGroups";
import { usePayments } from "@/hooks/usePayments";
import { useReminders } from "@/hooks/useReminders";
import { useBalanceCalculation } from "@/hooks/useBalanceCalculation";
import { Friend, FriendGroup, Expense, PaymentReminder } from "@/types/expense";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceSummary } from "@/components/BalanceSummary";
import { ExpenseDashboard } from "@/components/expenses/ExpenseDashboard";
import { ExpenseTabContent } from "@/components/expenses/ExpenseTabContent";
import { FriendGroupList } from "@/components/groups/FriendGroupList";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";

export default function Home() {
  const { session, userName } = useSession();
  const { expenses, handleAddExpense } = useExpenses();
  const { friends } = useFriends(session, userName);
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

  const handleSettleUp = (paymentMethod: string, amount: number) => {
    if (selectedReminder) {
      handleSettleReminder(selectedReminder.id);
    }
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
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Left sidebar - Group selection */}
        <div className="md:col-span-1">
          <h2 className="mb-4 text-xl font-semibold">Friend Groups</h2>
          <FriendGroupList
            groups={groups}
            onSelectGroup={setSelectedGroupId}
            selectedGroupId={selectedGroupId}
          />
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          {/* Group header with actions */}
          <GroupHeader
            selectedGroupId={selectedGroupId}
            onClearSelection={() => setSelectedGroupId(null)}
            handleCreateGroup={addGroup}
            friends={friends}
            groups={groups}
          />

          {/* Balance summary without passing balances directly */}
          <BalanceSummary
            expenses={filteredExpenses}
            friends={filteredFriends}
            payments={payments}
          />

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
              />
            </TabsContent>
          </Tabs>
          
          {/* Dialogs */}
          <AddExpenseDialog
            onAddExpense={handleAddNewExpense}
            friends={filteredFriends}
          />
          
          <SettlementDialog
            onSettle={handleSettleUp}
            reminder={selectedReminder}
          />
        </div>
      </div>
    </div>
  );
}
