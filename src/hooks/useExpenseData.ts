
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Expense, Split } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

export const useExpenseData = (session: Session | null) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch expenses from Supabase
  const { data: expenses = [], isLoading: isExpensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      if (!session?.user) {
        // Return mock data for development without auth
        return [
          {
            id: "1",
            description: "Dinner",
            amount: 100,
            paidBy: "1", // You
            date: new Date(),
            splits: [
              { friendId: "1", amount: 50 },
              { friendId: "2", amount: 50 }
            ]
          },
          {
            id: "2",
            description: "Movie tickets",
            amount: 60,
            paidBy: "2", // Alice
            date: new Date(Date.now() - 86400000),
            splits: [
              { friendId: "1", amount: 20 },
              { friendId: "2", amount: 20 },
              { friendId: "3", amount: 20 }
            ]
          }
        ] as Expense[];
      }

      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_splits:expense_splits(*)
        `)
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(exp => ({
        id: exp.id,
        description: exp.description,
        amount: Number(exp.amount),
        paidBy: exp.paid_by,
        date: new Date(exp.date),
        groupId: exp.group_id || undefined,
        splits: exp.expense_splits.map((split: any) => ({
          friendId: split.friend_id,
          amount: Number(split.amount),
          percentage: split.percentage ? Number(split.percentage) : undefined
        }))
      }));
    },
    enabled: !!session
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
      if (!session?.user) {
        // Create a local expense for non-authenticated users
        return {
          id: Date.now().toString(),
          description: newExpense.description,
          amount: newExpense.amount,
          paidBy: newExpense.paidBy,
          date: new Date(),
          splits: newExpense.splits,
          groupId: newExpense.groupId
        };
      }

      try {
        // For authenticated users
        // No need to validate UUID format for paidBy, the API will handle this
        const { data: expenseData, error: expenseError } = await supabase
          .from('expenses')
          .insert({
            user_id: session.user.id,
            description: newExpense.description,
            amount: newExpense.amount,
            paid_by: newExpense.paidBy,
            group_id: newExpense.groupId || null
          })
          .select()
          .single();
        
        if (expenseError) throw expenseError;
        
        // Process all splits without checking UUID format
        const splits = newExpense.splits.map(split => ({
          expense_id: expenseData.id,
          friend_id: split.friendId,
          amount: split.amount,
          percentage: split.percentage || (split.amount / newExpense.amount) * 100
        }));
        
        const { error: splitsError } = await supabase
          .from('expense_splits')
          .insert(splits);
        
        if (splitsError) throw splitsError;
        
        // Return the complete expense with splits
        return {
          id: expenseData.id,
          description: expenseData.description,
          amount: Number(expenseData.amount),
          paidBy: expenseData.paid_by,
          date: new Date(expenseData.date),
          groupId: expenseData.group_id || undefined,
          splits: newExpense.splits
        };
      } catch (error) {
        console.error("Error adding expense:", error);
        throw error;
      }
    },
    onSuccess: (newExpense) => {
      queryClient.setQueryData(['expenses'], (oldExpenses: Expense[] = []) => 
        [newExpense, ...oldExpenses]
      );
      
      toast({
        title: "Expense Added",
        description: `$${newExpense.amount.toFixed(2)} for ${newExpense.description}`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Expense",
        description: error.message || "An error occurred while adding expense",
        variant: "destructive"
      });
    }
  });

  return {
    expenses,
    isExpensesLoading,
    isLoading,
    handleAddExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => {
      addExpenseMutation.mutate({ description, amount, paidBy, splits, groupId });
    },
    // For backward compatibility
    addExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => {
      return addExpenseMutation.mutate({ description, amount, paidBy, splits, groupId });
    }
  };
};

// Helper function to validate UUID format (kept for reference, but not used in validation now)
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
