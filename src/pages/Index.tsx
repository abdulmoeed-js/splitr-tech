
import { useExpenses } from "@/hooks/useExpenses";
import { useSession } from "@/hooks/useSession";
import { useFriends } from "@/hooks/useFriends";
import { useGroups } from "@/hooks/useGroups";
import { usePayments } from "@/hooks/usePayments";
import { useReminders } from "@/hooks/useReminders";
import { useGroupSelection } from "@/hooks/useGroupSelection";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function Home() {
  const { session, userName } = useSession();
  const { 
    expenses, isExpensesLoading, refreshData: refreshExpenses, 
    handleAddExpense, handleDeleteExpense 
  } = useExpenses();
  
  const { 
    friends, isFriendsLoading, refreshData: refreshFriends, 
    handleAddFriend, handleInviteFriend 
  } = useFriends(session, userName);
  
  const { groups, addGroup } = useGroups(session, friends);
  const { payments, settleDebt } = usePayments(session);
  const { reminders, handleMarkReminderAsRead, handleSettleReminder } = useReminders(session);
  const { selectedGroupId, handleSelectGroup } = useGroupSelection(groups);

  // Combined refresh function for all data
  const refreshAllData = async () => {
    try {
      await Promise.all([
        refreshExpenses(),
        refreshFriends()
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const isLoading = isExpensesLoading || isFriendsLoading;

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <DashboardContent
        session={session}
        expenses={expenses}
        friends={friends}
        groups={groups}
        selectedGroupId={selectedGroupId}
        reminders={reminders}
        payments={payments}
        isLoading={isLoading}
        refreshData={refreshAllData}
        handleAddExpense={handleAddExpense}
        handleDeleteExpense={handleDeleteExpense}
        handleMarkReminderAsRead={handleMarkReminderAsRead}
        handleSettleReminder={handleSettleReminder}
        settleDebt={settleDebt}
      />
    </div>
  );
}
