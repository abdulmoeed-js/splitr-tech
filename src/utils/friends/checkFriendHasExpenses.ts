
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Check if a friend has any expenses (either as payer or participant in a split)
export const checkFriendHasExpenses = async (
  session: Session | null,
  friendId: string
): Promise<boolean> => {
  if (!session?.user) {
    return false;
  }

  try {
    // Check if friend is in any expense as payer
    const { data: paidExpenses, error: paidError } = await supabase
      .from('expenses')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('paid_by', friendId)
      .limit(1);
    
    if (paidError) throw paidError;
    
    if (paidExpenses && paidExpenses.length > 0) {
      return true;
    }
    
    // Check if friend is in any expense split
    const { data: splitExpenses, error: splitError } = await supabase
      .from('expense_splits')
      .select('id')
      .eq('friend_id', friendId)
      .limit(1);
    
    if (splitError) throw splitError;
    
    return splitExpenses && splitExpenses.length > 0;
  } catch (error) {
    console.error("Error checking if friend has expenses:", error);
    return false; // Assume no expenses in case of error to be safe
  }
};
