
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { ExpenseDashboard } from "@/components/expenses/ExpenseDashboard";
import { BalanceSummary } from "@/components/BalanceSummary";
import { FriendGroupList } from "@/components/groups/FriendGroupList";
import { FriendGroupDialog } from "@/components/groups/FriendGroupDialog";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { FriendsManagement } from "@/components/friends/FriendsManagement";
import { ExpenseTabContent } from "@/components/expenses/ExpenseTabContent";
import { RemindersList } from "@/components/settlements/RemindersList";
import { useExpenses } from "@/hooks/useExpenses";
import { useState } from "react";

export default function Index() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { 
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
    handleAddExpense,
    handleAddFriend,
    handleUpdateFriend,
    handleInviteFriend,
    handleRemoveFriend,
    handleAddGroup,
    handleSelectGroup,
    handleSettleDebt,
    handleMarkReminderAsRead,
    handleSettleReminder
  } = useExpenses();

  // Get selected group name
  const selectedGroupName = selectedGroupId 
    ? groups.find(g => g.id === selectedGroupId)?.name 
    : null;

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-4 glass-panel">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Groups</h2>
              <FriendGroupDialog 
                friends={friends}
                onAddGroup={handleAddGroup}
              />
            </div>
            <FriendGroupList
              groups={groups}
              onSelectGroup={handleSelectGroup}
              selectedGroupId={selectedGroupId}
            />
          </Card>
          
          <div className="block lg:hidden">
            <FriendsManagement 
              friends={filteredFriends}
              onAddFriend={handleAddFriend}
              onUpdateFriend={handleUpdateFriend}
              onInviteFriend={handleInviteFriend}
              onRemoveFriend={handleRemoveFriend}
            />
          </div>
          
          {reminders.length > 0 && (
            <div className="block lg:hidden">
              <Card className="p-4 glass-panel overflow-hidden">
                <h2 className="text-xl font-semibold mb-4">Payment Reminders</h2>
                <RemindersList 
                  reminders={reminders}
                  friends={friends}
                  onMarkAsRead={handleMarkReminderAsRead}
                  onSettleReminder={handleSettleReminder}
                />
              </Card>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <GroupHeader
              selectedGroupName={selectedGroupName}
              onClearSelection={() => handleSelectGroup(null)}
            />
            
            <div className="flex gap-2">
              <AddExpenseDialog 
                friends={filteredFriends}
                onAddExpense={handleAddExpense}
                groupId={selectedGroupId}
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="expenses" className="relative">
                Expenses
                {hasUnreadReminders && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6 mt-6">
              <ExpenseDashboard 
                expenses={filteredExpenses}
                friends={filteredFriends}
              />
              
              <BalanceSummary 
                expenses={filteredExpenses}
                friends={filteredFriends}
                payments={payments}
                paymentMethods={paymentMethods}
                onSettleDebt={handleSettleDebt}
              />
            </TabsContent>
            
            <TabsContent value="expenses" className="mt-6">
              <ExpenseTabContent 
                expenses={filteredExpenses}
                friends={filteredFriends}
                reminders={reminders}
                onMarkReminderAsRead={handleMarkReminderAsRead}
                onSettleReminder={handleSettleReminder}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
