
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Check if a friend has any associated expenses
export const checkFriendHasExpenses = async (
  session: Session | null,
  friendId: string
): Promise<boolean> => {
  if (!session?.user) {
    // For development mode, just allow removal
    return false;
  }

  try {
    // Check if this friend is involved in any expenses
    const { data: expenseSplits, error: splitsError } = await supabase
      .from('expense_splits')
      .select('id')
      .eq('friend_id', friendId)
      .limit(1);
    
    if (splitsError) throw splitsError;
    
    // If we found splits, the friend has expenses
    if (expenseSplits && expenseSplits.length > 0) {
      return true;
    }
    
    // Check if this friend paid for any expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id')
      .eq('paid_by', friendId)
      .limit(1);
    
    if (expensesError) throw expensesError;
    
    // If we found expenses, the friend has expenses
    if (expenses && expenses.length > 0) {
      return true;
    }
    
    // Check if this friend is involved in any payment reminders
    const { data: reminders, error: remindersError } = await supabase
      .from('payment_reminders')
      .select('id')
      .or(`from_friend_id.eq.${friendId},to_friend_id.eq.${friendId}`)
      .limit(1);
    
    if (remindersError) throw remindersError;
    
    // If we found reminders, the friend has reminders
    if (reminders && reminders.length > 0) {
      return true;
    }
    
    // Check if this friend is involved in any payments
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('id')
      .or(`from_friend_id.eq.${friendId},to_friend_id.eq.${friendId}`)
      .limit(1);
    
    if (paymentsError) throw paymentsError;
    
    // If we found payments, the friend has payments
    if (payments && payments.length > 0) {
      return true;
    }
    
    // If we made it this far, the friend doesn't have any expenses or payments
    return false;
  } catch (error) {
    console.error("Error checking if friend has expenses:", error);
    // Default to true to prevent accidental removal
    return true;
  }
};
