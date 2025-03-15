
import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "@/hooks/useSession";
import { Expense, Split, Friend } from "@/types/expense";
import { useExpenseData } from "@/hooks/useExpenseData";
import { useFriends } from "@/hooks/useFriends";

interface ExpensesContextType {
  expenses: Expense[];
  isExpensesLoading: boolean;
  refreshData: () => Promise<any>;
  handleAddExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => void;
  handleDeleteExpense: (expenseId: string) => Promise<boolean>;
  // Add friends-related properties
  isLoaded: boolean;
  friends: Friend[];
  handleAddFriend: (name: string, email?: string, phone?: string) => void;
  handleUpdateFriend: (friend: Partial<Friend> & { id: string }) => void;
  handleInviteFriend: (email?: string, phone?: string) => void;
  handleRemoveFriend: (friendId: string) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session, userName } = useSession();
  const { 
    expenses, 
    isExpensesLoading,
    refreshData,
    handleAddExpense,
    handleDeleteExpense
  } = useExpenseData(session);

  const {
    friends,
    isFriendsLoading,
    handleAddFriend,
    handleUpdateFriend,
    handleInviteFriend,
    handleRemoveFriend
  } = useFriends(session, userName);

  // Simple loading state that combines all data loading states
  const isLoaded = !isExpensesLoading && !isFriendsLoading;

  const value = {
    expenses,
    isExpensesLoading,
    refreshData,
    handleAddExpense,
    handleDeleteExpense,
    // Add friends-related properties
    isLoaded,
    friends,
    handleAddFriend,
    handleUpdateFriend,
    handleInviteFriend,
    handleRemoveFriend
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = (): ExpensesContextType => {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
};
