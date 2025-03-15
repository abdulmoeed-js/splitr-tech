
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/types/expense";
import { Session } from "@supabase/supabase-js";
import { generateUUID, uuidToFriendId } from "./uuidUtils";

/**
 * Fetches expenses from the database or returns mock data if not authenticated
 */
export const fetchExpenses = async (session: Session | null): Promise<Expense[]> => {
  console.log("Fetching expenses, authenticated:", !!session?.user);
  
  if (!session?.user) {
    console.log("No authenticated user, returning mock expense data");
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
    console.log("Fetching expenses from database for user:", session.user.id);
    
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_splits:expense_splits(*)
      `)
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Supabase error fetching expenses:", error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} expenses from database`);
    
    const mappedExpenses = data.map(exp => {
      // Safely convert UUID to friendId
      let paidBy;
      try {
        paidBy = uuidToFriendId(exp.paid_by);
      } catch (error) {
        console.warn(`Error converting paid_by UUID to friendId: ${exp.paid_by}`, error);
        paidBy = exp.paid_by; // Fallback to using the UUID directly
      }
      
      console.log(`Mapping expense ${exp.id}: amount=${exp.amount}, paidBy=${paidBy}`);
      
      const mappedSplits = (exp.expense_splits || []).map((split: any) => {
        let friendId;
        try {
          friendId = uuidToFriendId(split.friend_id);
        } catch (error) {
          console.warn(`Error converting split friend_id UUID to friendId: ${split.friend_id}`, error);
          friendId = split.friend_id; // Fallback to using the UUID directly
        }
        
        console.log(`- Split: friendId=${friendId}, amount=${split.amount}`);
        
        return {
          friendId,
          amount: Number(split.amount),
          percentage: split.percentage ? Number(split.percentage) : undefined
        };
      });
      
      return {
        id: exp.id,
        description: exp.description,
        amount: Number(exp.amount),
        paidBy,
        date: new Date(exp.date),
        groupId: exp.group_id || undefined,
        splits: mappedSplits
      };
    });
    
    console.log("Returning mapped expenses:", mappedExpenses);
    return mappedExpenses;
  } catch (error) {
    console.error("Error in fetchExpenses:", error);
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
  console.log("Creating local expense:", { description, amount, paidBy, splits, groupId });
  
  const expense = {
    id: generateUUID(),
    description,
    amount,
    paidBy,
    date: new Date(),
    splits,
    groupId
  };
  
  console.log("Created local expense with ID:", expense.id);
  return expense;
};
