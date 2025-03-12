
import { AuthWrapper } from "@/components/AuthWrapper";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { ExpenseDashboard } from "@/components/expenses/ExpenseDashboard";
import { useExpenses } from "@/hooks/useExpenses";

const Index = () => {
  const {
    isLoaded,
    friends,
    filteredFriends,
    filteredExpenses,
    groups,
    selectedGroupId,
    payments,
    reminders,
    paymentMethods,
    hasUnreadReminders,
    handleAddExpense,
    handleAddFriend,
    handleAddGroup,
    handleSelectGroup,
    handleSettleDebt,
    handleMarkReminderAsRead,
    handleSettleReminder
  } = useExpenses();

  return (
    <div className="container max-w-2xl py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Split Buddy
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Track expenses and settle up with friends
      </p>
      
      {!isLoaded ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <GroupHeader 
            groups={groups}
            friends={friends}
            selectedGroupId={selectedGroupId}
            onAddGroup={handleAddGroup}
            onSelectGroup={handleSelectGroup}
          />
          
          <ExpenseDashboard 
            expenses={filteredExpenses}
            filteredExpenses={filteredExpenses}
            friends={friends}
            filteredFriends={filteredFriends}
            payments={payments}
            reminders={reminders}
            paymentMethods={paymentMethods}
            hasUnreadReminders={hasUnreadReminders}
            onSettleDebt={handleSettleDebt}
            onMarkReminderAsRead={handleMarkReminderAsRead}
            onSettleReminder={handleSettleReminder}
          />

          <AddExpenseDialog 
            friends={filteredFriends} 
            onAddExpense={handleAddExpense} 
            onAddFriend={handleAddFriend} 
          />
        </>
      )}
    </div>
  );
};

export default Index;
