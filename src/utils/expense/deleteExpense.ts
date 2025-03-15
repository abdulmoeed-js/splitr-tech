
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const deleteExpense = async (
  session: Session | null,
  expenseId: string
): Promise<boolean> => {
  console.log("Deleting expense:", expenseId, "Authenticated:", !!session);
  
  if (!session?.user) {
    console.log("No active session, cannot delete expense");
    return false;
  }

  try {
    // First delete the splits
    console.log("Deleting expense splits");
    const { error: splitError } = await supabase
      .from('expense_splits')
      .delete()
      .eq('expense_id', expenseId);
    
    if (splitError) {
      console.error("Error deleting expense splits:", splitError);
      throw splitError;
    }
    
    // Then delete the expense
    console.log("Deleting expense");
    const { error: expenseError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', session.user.id);
    
    if (expenseError) {
      console.error("Error deleting expense:", expenseError);
      throw expenseError;
    }
    
    console.log("Expense deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    return false;
  }
};
