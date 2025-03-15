
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
    console.log("Deleting expense splits for expense ID:", expenseId);
    const { error: splitError, data: deletedSplits } = await supabase
      .from('expense_splits')
      .delete()
      .eq('expense_id', expenseId)
      .select();
    
    if (splitError) {
      console.error("Error deleting expense splits:", splitError);
      throw splitError;
    }
    
    console.log("Successfully deleted splits:", deletedSplits);
    
    // Then delete the expense
    console.log("Deleting expense with ID:", expenseId, "for user:", session.user.id);
    const { error: expenseError, data: deletedExpense } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', session.user.id)
      .select();
    
    if (expenseError) {
      console.error("Error deleting expense:", expenseError);
      throw expenseError;
    }
    
    console.log("Successfully deleted expense:", deletedExpense);
    return true;
  } catch (error) {
    console.error("Error in deleteExpense:", error);
    // Return false to indicate failure but don't throw to prevent UI from breaking
    return false;
  }
};
