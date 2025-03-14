
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Expense, Split } from "@/types/expense";
import { friendIdToUuid } from "./uuidUtils";

/**
 * Creates an expense in the database with proper ID conversion
 */
export const createDatabaseExpense = async (
  session: Session | null,
  description: string,
  amount: number,
  paidBy: string,
  splits: Split[],
  groupId?: string
): Promise<Expense> => {
  if (!session?.user) {
    throw new Error("No active session");
  }

  try {
    console.log("Creating database expense with:", { description, amount, paidBy, splits, groupId });
    
    // For authenticated users
    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        user_id: session.user.id,
        description: description,
        amount: amount,
        paid_by: friendIdToUuid(paidBy),
        group_id: groupId || null
      })
      .select()
      .single();
    
    if (expenseError) {
      console.error("Error creating expense:", expenseError);
      throw expenseError;
    }
    
    // Process splits for database
    const processedSplits = splits.map(split => ({
      expense_id: expenseData.id,
      friend_id: friendIdToUuid(split.friendId),
      amount: split.amount,
      percentage: split.percentage || (split.amount / amount) * 100
    }));
    
    console.log("Creating splits:", processedSplits);
    
    const { error: splitsError } = await supabase
      .from('expense_splits')
      .insert(processedSplits);
    
    if (splitsError) {
      console.error("Error creating splits:", splitsError);
      throw splitsError;
    }
    
    // Return the complete expense with splits
    return {
      id: expenseData.id,
      description: expenseData.description,
      amount: Number(expenseData.amount),
      paidBy: expenseData.paid_by,
      date: new Date(expenseData.date),
      groupId: expenseData.group_id || undefined,
      splits: splits
    };
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};
