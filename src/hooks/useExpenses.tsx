
import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "@/hooks/useSession";
import { Expense, Split } from "@/types/expense";
import { useExpenseData } from "@/hooks/useExpenseData";

interface ExpensesContextType {
  expenses: Expense[];
  isExpensesLoading: boolean;
  handleAddExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session } = useSession();
  const { 
    expenses, 
    isExpensesLoading,
    addExpense: handleAddExpense
  } = useExpenseData(session);

  const value = {
    expenses,
    isExpensesLoading,
    handleAddExpense
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
