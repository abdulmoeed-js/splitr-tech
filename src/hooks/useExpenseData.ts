
import { useState } from "react";
import { Split } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { useExpensesQuery } from "./expense/useExpensesQuery";
import { useAddExpenseMutation } from "./expense/useAddExpenseMutation";
import { useDeleteExpenseMutation } from "./expense/useDeleteExpenseMutation";

export const useExpenseData = (session: Session | null) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Use our modular hooks
  const { 
    data: expenses = [], 
    isLoading: isExpensesLoading,
    error: expensesError,
    refetch: refetchExpenses
  } = useExpensesQuery(session);
  
  const addExpenseMutation = useAddExpenseMutation(session);
  
  const { 
    deleteExpenseMutation, 
    isDeletingExpense 
  } = useDeleteExpenseMutation(session);

  // Add manual refresh function
  const refreshData = () => {
    if (session?.user) {
      console.log("Manually refreshing expense data");
      return refetchExpenses();
    }
    return Promise.resolve();
  };

  return {
    expenses,
    isExpensesLoading,
    expensesError,
    isLoading,
    isDeletingExpense,
    refreshData,
    handleAddExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => {
      console.log("handleAddExpense called with:", { description, amount, paidBy, splits, groupId });
      
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to add expenses",
          variant: "destructive"
        });
        return;
      }
      
      // Make sure paidBy is a string
      const processedPaidBy = String(paidBy);
      
      // Make sure splits have friendId as strings
      const processedSplits = splits.map(split => ({
        ...split,
        friendId: String(split.friendId)
      }));
      
      addExpenseMutation.mutate({ 
        description, 
        amount, 
        paidBy: processedPaidBy, 
        splits: processedSplits, 
        groupId 
      });
    },
    handleDeleteExpense: async (expenseId: string): Promise<boolean> => {
      console.log("handleDeleteExpense called with:", expenseId);
      
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to delete expenses",
          variant: "destructive"
        });
        return false;
      }
      
      try {
        return await deleteExpenseMutation.mutateAsync(expenseId);
      } catch (error) {
        console.error("Error in handleDeleteExpense:", error);
        return false;
      }
    },
    // For backward compatibility
    addExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => {
      if (!session?.user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to add expenses",
          variant: "destructive"
        });
        return;
      }
      return addExpenseMutation.mutate({ description, amount, paidBy, splits, groupId });
    }
  };
};
