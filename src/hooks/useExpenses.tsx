
import { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { Friend, Expense, Split, FriendGroup, SettlementPayment, PaymentReminder } from '@/types/expense';
import { useSession } from '@/hooks/useSession';
import { useExpenseData } from '@/hooks/useExpenseData';
import { useGroups } from '@/hooks/useGroups';
import { useFriends } from '@/hooks/useFriends';
import { usePayments } from '@/hooks/usePayments';
import { useReminders } from '@/hooks/useReminders';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { PaymentMethod } from '@/types/payment';

type ExpensesContextType = {
  isLoaded: boolean;
  friends: Friend[];
  filteredFriends: Friend[];
  expenses: Expense[];
  filteredExpenses: Expense[];
  groups: FriendGroup[];
  selectedGroupId: string | null;
  payments: SettlementPayment[];
  reminders: PaymentReminder[];
  paymentMethods: PaymentMethod[];
  hasUnreadReminders: boolean;
  handleAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
  handleAddFriend: (name: string, email?: string, phone?: string) => void;
  handleUpdateFriend: (friend: Partial<Friend> & { id: string }) => void;
  handleInviteFriend: (email?: string, phone?: string) => void;
  handleRemoveFriend: (friendId: string) => void;
  handleAddGroup: (name: string, memberIds: string[]) => void;
  handleSelectGroup: (groupId: string | null) => void;
  handleSettleDebt: (payment: SettlementPayment) => void;
  handleMarkReminderAsRead: (reminderId: string) => void;
  handleSettleReminder: (reminder: PaymentReminder) => void;
};

const ExpensesContext = createContext<ExpensesContextType | null>(null);

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  const { session, user, isLoading: isAuthLoading } = useSession();
  const userName = user?.user_metadata?.name || 'You';
  
  const { 
    expenses, 
    isLoading: isExpensesLoading,
    addExpense 
  } = useExpenseData(session);
  
  const { 
    friends, 
    isFriendsLoading,
    handleAddFriend, 
    handleUpdateFriend,
    handleInviteFriend,
    handleRemoveFriend 
  } = useFriends(session, userName);
  
  const {
    groups,
    isLoading: isGroupsLoading,
    addGroup,
  } = useGroups(session, friends);
  
  const {
    payments,
    isLoading: isPaymentsLoading,
    settleDebt
  } = usePayments(session);
  
  const {
    reminders,
    hasUnreadReminders,
    isLoading: isRemindersLoading,
    markReminderAsRead,
    settleReminder
  } = useReminders(session);
  
  const {
    paymentMethods,
    loading: isPaymentMethodsLoading
  } = usePaymentMethods();

  // Filter friends and expenses based on selected group
  const filteredFriends = useMemo(() => {
    if (!selectedGroupId) return friends;
    const selectedGroup = groups.find(g => g.id === selectedGroupId);
    if (!selectedGroup) return friends;
    return friends.filter(f => 
      selectedGroup.members.some(m => m.id === f.id)
    );
  }, [friends, groups, selectedGroupId]);

  const filteredExpenses = useMemo(() => {
    if (!selectedGroupId) return expenses;
    return expenses.filter(e => e.groupId === selectedGroupId);
  }, [expenses, selectedGroupId]);

  useEffect(() => {
    // Set loaded state once all data is loaded
    if (!isAuthLoading && !isExpensesLoading && !isFriendsLoading && 
        !isGroupsLoading && !isPaymentsLoading && !isRemindersLoading && 
        !isPaymentMethodsLoading) {
      setIsLoaded(true);
    }
  }, [
    isAuthLoading, 
    isExpensesLoading, 
    isFriendsLoading, 
    isGroupsLoading, 
    isPaymentsLoading, 
    isRemindersLoading,
    isPaymentMethodsLoading
  ]);

  // Combine all the functionality
  const contextValue = {
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
    handleAddExpense: addExpense,
    handleAddFriend,
    handleUpdateFriend,
    handleInviteFriend,
    handleRemoveFriend,
    handleAddGroup: addGroup,
    handleSelectGroup: setSelectedGroupId,
    handleSettleDebt: settleDebt,
    handleMarkReminderAsRead: markReminderAsRead,
    handleSettleReminder: settleReminder
  };

  return (
    <ExpensesContext.Provider value={contextValue}>
      {children}
    </ExpensesContext.Provider>
  );
};
