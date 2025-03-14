
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
  console.log("Creating database expense:", { description, amount, paidBy, splits, groupId });
  
  if (!session?.user) {
    console.error("No active session, cannot create database expense");
    throw new Error("No active session");
  }

  try {
    const convertedPaidBy = friendIdToUuid(paidBy);
    console.log("Converted paidBy to UUID format:", { original: paidBy, converted: convertedPaidBy });
    
    // For authenticated users
    console.log("Inserting expense into database");
    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        user_id: session.user.id,
        description: description,
        amount: amount,
        paid_by: convertedPaidBy,
        group_id: groupId || null
      })
      .select()
      .single();
    
    if (expenseError) {
      console.error("Error creating expense:", expenseError);
      throw expenseError;
    }
    
    console.log("Expense created successfully:", expenseData);
    
    // Process splits for database
    const processedSplits = splits.map(split => {
      const convertedFriendId = friendIdToUuid(split.friendId);
      console.log("Converting split friendId:", { 
        original: split.friendId, 
        converted: convertedFriendId, 
        amount: split.amount 
      });
      
      return {
        expense_id: expenseData.id,
        friend_id: convertedFriendId,
        amount: split.amount,
        percentage: split.percentage || (split.amount / amount) * 100
      };
    });
    
    console.log("Inserting splits:", processedSplits);
    
    const { error: splitsError } = await supabase
      .from('expense_splits')
      .insert(processedSplits);
    
    if (splitsError) {
      console.error("Error creating splits:", splitsError);
      throw splitsError;
    }
    
    console.log("Splits created successfully");
    
    // Return the complete expense with splits for client-side usage
    const clientSplits = splits.map(split => {
      console.log("Mapping split for client:", split);
      return {
        friendId: split.friendId, // Keep original IDs for client-side consistency
        amount: Number(split.amount),
        percentage: split.percentage
      };
    });
    
    const finalExpense = {
      id: expenseData.id,
      description: expenseData.description,
      amount: Number(expenseData.amount),
      paidBy: paidBy, // Keep original ID for client-side consistency
      date: new Date(expenseData.date),
      groupId: expenseData.group_id || undefined,
      splits: clientSplits
    };
    
    console.log("Returning final expense:", finalExpense);
    return finalExpense;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};
