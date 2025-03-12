
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Expense, Split } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

export const useExpenseData = (session: Session | null) => {
  const queryClient = useQueryClient();

  // Fetch expenses from Supabase
  const { data: expenses = [], isLoading: isExpensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      if (!session?.user) {
        return [] as Expense[]; // Empty expenses for non-authenticated users
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

      // Insert the expense
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
      
      // Insert the splits
      const splits = newExpense.splits.map(split => ({
        expense_id: expenseData.id,
        friend_id: split.friendId,
        amount: split.amount,
        percentage: split.percentage || null
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
    },
    onSuccess: (newExpense) => {
      queryClient.setQueryData(['expenses'], (oldExpenses: Expense[] = []) => 
        [newExpense, ...oldExpenses]
      );
      
      toast({
        title: "Expense Added",
        description: `$${newExpense.amount.toFixed(2)} for ${newExpense.description}`,
      });
    },
    onError: (error) => {
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
    handleAddExpense: (description: string, amount: number, paidBy: string, splits: Split[], groupId?: string) => {
      addExpenseMutation.mutate({ description, amount, paidBy, splits, groupId });
    }
  };
};
