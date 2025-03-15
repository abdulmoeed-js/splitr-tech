
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { Expense, Split } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { createDatabaseExpense } from "@/utils/expense/expenseMutations";

export const useAddExpenseMutation = (session: Session | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newExpense: { 
      description: string; 
      amount: number; 
      paidBy: string; 
      splits: Split[];
      groupId?: string;
    }) => {
      if (!session?.user) {
        throw new Error("You must be logged in to add expenses");
      }

      try {
        // Ensure IDs are strings
        const processedPaidBy = String(newExpense.paidBy);
        
        // Ensure split friendIds are strings
        const processedSplits = newExpense.splits.map(split => ({
          ...split,
          friendId: String(split.friendId)
        }));
        
        // Create expense in database
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
      queryClient.setQueryData(['expenses', session?.user?.id], (oldExpenses: Expense[] = []) => {
        console.log("Updating expenses cache with new expense");
        return [newExpense, ...oldExpenses];
      });
      
      // Explicitly invalidate the expenses query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['expenses', session?.user?.id] });
      
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
};
