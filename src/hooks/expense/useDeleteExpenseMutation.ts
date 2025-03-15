
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { Expense } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { deleteExpense } from "@/utils/expense/deleteExpense";
import { useState } from "react";

export const useDeleteExpenseMutation = (session: Session | null) => {
  const queryClient = useQueryClient();
  const [isDeletingExpense, setIsDeletingExpense] = useState(false);

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      if (!session?.user) {
        throw new Error("You must be logged in to delete expenses");
      }

      console.log("Starting delete expense mutation for ID:", expenseId);
      setIsDeletingExpense(true);
      
      try {
        // Optimistically update the UI first
        const previousExpenses = queryClient.getQueryData<Expense[]>(['expenses', session?.user?.id]) || [];
        
        queryClient.setQueryData(['expenses', session?.user?.id], (oldExpenses: Expense[] = []) => {
          console.log("Optimistically removing expense from cache");
          return oldExpenses.filter(expense => expense.id !== expenseId);
        });
        
        const result = await deleteExpense(session, expenseId);
        
        if (!result) {
          // If deletion failed, revert the optimistic update
          console.log("Delete operation failed, reverting optimistic update");
          queryClient.setQueryData(['expenses', session?.user?.id], previousExpenses);
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
        queryClient.invalidateQueries({ queryKey: ['expenses', session?.user?.id] });
        
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
    deleteExpenseMutation,
    isDeletingExpense
  };
};
