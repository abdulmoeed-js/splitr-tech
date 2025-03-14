
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Check if a friend has associated expenses
export const checkFriendHasExpenses = async (
  session: Session | null,
  friendId: string
) => {
  if (!session?.user) {
    return false;
  }

  // Check if friend is payer or has splits in any expense
  const { data: paidByData } = await supabase
    .from('expenses')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('paid_by', friendId)
    .limit(1);
  
  if (paidByData && paidByData.length > 0) return true;
  
  const { data: splitData } = await supabase
    .from('expense_splits')
    .select('id')
    .eq('friend_id', friendId)
    .limit(1);
  
  return splitData && splitData.length > 0;
};
