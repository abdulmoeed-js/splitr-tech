
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Expense, Split } from "@/types/expense";
import { Session } from "@supabase/supabase-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export const useExpenseData = (session: Session | null) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch expenses
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

      // Real data fetch from Supabase
      const { data: expensesData, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_splits(*)
        `)
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return expensesData.map((expense: any) => ({
        id: expense.id,
        description: expense.description,
        amount: Number(expense.amount),
        paidBy: expense.paid_by,
        date: new Date(expense.date),
        groupId: expense.group_id,
        splits: expense.expense_splits.map((split: any) => ({
          friendId: split.friend_id,
          amount: Number(split.amount),
          percentage: Number(split.percentage)
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
        // For development without auth
        return {
          id: Date.now().toString(),
          description: newExpense.description,
          amount: newExpense.amount,
          paidBy: newExpense.paidBy,
          date: new Date(),
          groupId: newExpense.groupId,
          splits: newExpense.splits
        };
      }

      // Insert expense
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          user_id: session.user.id,
          description: newExpense.description,
          amount: newExpense.amount,
          paid_by: newExpense.paidBy,
          group_id: newExpense.groupId
        })
        .select()
        .single();
      
      if (expenseError) throw expenseError;
      
      // Insert splits
      const splitsToInsert = newExpense.splits.map(split => ({
        expense_id: expenseData.id,
        friend_id: split.friendId,
        amount: split.amount,
        percentage: split.percentage || (split.amount / newExpense.amount) * 100
      }));
      
      const { error: splitsError } = await supabase
        .from('expense_splits')
        .insert(splitsToInsert);
      
      if (splitsError) throw splitsError;
      
      return {
        id: expenseData.id,
        description: expenseData.description,
        amount: Number(expenseData.amount),
        paidBy: expenseData.paid_by,
        date: new Date(expenseData.date),
        groupId: expenseData.group_id,
        splits: newExpense.splits
      };
    },
    onSuccess: (newExpense) => {
      queryClient.setQueryData(['expenses'], (oldExpenses: Expense[] = []) => 
        [newExpense, ...oldExpenses]
      );
      
      toast({
        title: "Expense Added",
        description: `${newExpense.description} for ${newExpense.amount} has been added`
      });
    },
    onError: (error) => {
      toast({
        title: "Error Adding Expense",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  });

  return {
    expenses,
    isExpensesLoading,
    isLoading, 
    addExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => {
      return addExpenseMutation.mutate({ description, amount, paidBy, splits, groupId });
    }
  };
};
