
import { useState } from "react";
import { Expense, Split } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { fetchExpenses } from "@/utils/expense/expenseQueries";
import { createLocalExpense } from "@/utils/expense/expenseQueries";
import { createDatabaseExpense } from "@/utils/expense/expenseMutations";
import { deleteExpense } from "@/utils/expense/deleteExpense";

export const useExpenseData = (session: Session | null) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingExpense, setIsDeletingExpense] = useState(false);

  // Fetch expenses from Supabase
  const { data: expenses = [], isLoading: isExpensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => fetchExpenses(session),
    enabled: true, // Always enabled, returns mock data when not authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Add error handling
    meta: {
      onError: (error: any) => {
        console.error("Error fetching expenses:", error);
        toast({
          title: "Failed to load expenses",
          description: error.message || "An error occurred while loading expenses",
          variant: "destructive"
        });
      }
    }
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: { 
      description: string; 
      amount: number; 
      paidBy: string; 
      splits: Split[];
      groupId?: string;
    }) => {
      try {
        // Ensure IDs are strings
        const processedPaidBy = String(newExpense.paidBy);
        
        // Ensure split friendIds are strings
        const processedSplits = newExpense.splits.map(split => ({
          ...split,
          friendId: String(split.friendId)
        }));
        
        // Use correct function based on authentication state
        if (!session?.user) {
          // Create a local expense for non-authenticated users
          return createLocalExpense(
            newExpense.description,
            newExpense.amount,
            processedPaidBy,
            processedSplits,
            newExpense.groupId
          );
        }

        // For authenticated users
        return createDatabaseExpense(
          session,
          newExpense.description,
          newExpense.amount,
          processedPaidBy,
          processedSplits,
          newExpense.groupId
        );
      } catch (error) {
        console.error("Error in mutation function:", error);
        throw error;
      }
    },
    onSuccess: (newExpense) => {
      console.log("Successfully added expense:", newExpense);
      
      // Update local cache
      queryClient.setQueryData(['expenses'], (oldExpenses: Expense[] = []) => {
        console.log("Updating expenses cache with new expense");
        return [newExpense, ...oldExpenses];
      });
      
      // Explicitly invalidate the expenses query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      
      toast({
        title: "Expense Added",
        description: `Rs. ${newExpense.amount.toFixed(2)} for ${newExpense.description}`
      });
    },
    onError: (error: any) => {
      console.error("Error in mutation:", error);
      toast({
        title: "Failed to Add Expense",
        description: error.message || "An error occurred while adding expense",
        variant: "destructive"
      });
    }
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      console.log("Starting delete expense mutation for ID:", expenseId);
      setIsDeletingExpense(true);
      
      try {
        // Optimistically update the UI first
        const previousExpenses = queryClient.getQueryData<Expense[]>(['expenses']) || [];
        
        queryClient.setQueryData(['expenses'], (oldExpenses: Expense[] = []) => {
          console.log("Optimistically removing expense from cache");
          return oldExpenses.filter(expense => expense.id !== expenseId);
        });
        
        const result = await deleteExpense(session, expenseId);
        
        if (!result) {
          // If deletion failed, revert the optimistic update
          console.log("Delete operation failed, reverting optimistic update");
          queryClient.setQueryData(['expenses'], previousExpenses);
          return false;
        }
        
        console.log("Delete operation succeeded");
        return true;
      } catch (error) {
        console.error("Error in deleteExpenseMutation:", error);
        // Return false instead of throwing to prevent UI from breaking
        return false;
      } finally {
        setIsDeletingExpense(false);
      }
    },
    onSuccess: (result) => {
      if (result) {
        console.log("Successfully deleted expense");
        
        // Explicitly invalidate the expenses query to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ['expenses'] });
        
        toast({
          title: "Expense Deleted",
          description: "The expense has been deleted successfully"
        });
      } else {
        console.log("Expense deletion was not successful");
        toast({
          title: "Failed to Delete Expense",
          description: "The expense could not be deleted. Please try again.",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      console.error("Error in delete mutation:", error);
      toast({
        title: "Failed to Delete Expense",
        description: error.message || "An error occurred while deleting the expense",
        variant: "destructive"
      });
    }
  });

  return {
    expenses,
    isExpensesLoading,
    isLoading,
    isDeletingExpense,
    handleAddExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => {
      console.log("handleAddExpense called with:", { description, amount, paidBy, splits, groupId });
      
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
      try {
        return await deleteExpenseMutation.mutateAsync(expenseId);
      } catch (error) {
        console.error("Error in handleDeleteExpense:", error);
        return false;
      }
    },
    // For backward compatibility
    addExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => {
      return addExpenseMutation.mutate({ description, amount, paidBy, splits, groupId });
    }
  };
};
