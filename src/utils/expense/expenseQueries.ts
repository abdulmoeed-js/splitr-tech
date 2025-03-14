
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/types/expense";
import { Session } from "@supabase/supabase-js";
import { generateUUID } from "./uuidUtils";

/**
 * Fetches expenses from the database or returns mock data if not authenticated
 */
export const fetchExpenses = async (session: Session | null): Promise<Expense[]> => {
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

  try {
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
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
};

/**
 * Creates a local expense (used when not authenticated)
 */
export const createLocalExpense = (
  description: string,
  amount: number,
  paidBy: string,
  splits: Array<{ friendId: string; amount: number; percentage?: number }>,
  groupId?: string
): Expense => {
  console.log("Creating local expense with:", { description, amount, paidBy, splits, groupId });
  return {
    id: generateUUID(),
    description,
    amount,
    paidBy,
    date: new Date(),
    splits,
    groupId
  };
};
