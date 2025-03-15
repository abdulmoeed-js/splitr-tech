
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
import { AddExpenseDialog } from "@/components/expenses/dialog/AddExpenseDialog";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";

export default function Home() {
  const { session, userName } = useSession();
  const { expenses, handleAddExpense, handleDeleteExpense } = useExpenses();
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
  
  // Create a Map of friend IDs to friend objects properly
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
    filteredExpenses: validExpenses,
    friends,
    filteredFriends,
    payments,
    reminders,
    paymentMethods: [],
    hasUnreadReminders,
    onSettleDebt: settleDebt,
    onMarkReminderAsRead: handleMarkReminderAsRead,
    onSettleReminder: openSettlementDialog,
    onDeleteExpense: handleDeleteExpense
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="space-y-6">
        {/* Main content area */}
        <div className="space-y-6">
          {/* Balance summary without passing balances directly */}
          <BalanceSummary
            expenses={validExpenses}
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
                expenses={validExpenses}
                friends={filteredFriends}
                reminders={reminders}
                onMarkReminderAsRead={handleMarkReminderAsRead}
                onSettleReminder={openSettlementDialog}
                payments={payments}
                onDeleteExpense={handleDeleteExpense}
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
        </div>
      </div>
    </div>
  );
}
