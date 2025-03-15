
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

export const deleteExpense = async (
  session: Session | null,
  expenseId: string
): Promise<boolean> => {
  console.log("Deleting expense:", expenseId, "Authenticated:", !!session);
  
  if (!session?.user) {
    console.log("No active session, cannot delete expense");
    toast({
      title: "Authentication required",
      description: "You must be logged in to delete expenses",
      variant: "destructive"
    });
    return false;
  }

  try {
    // First delete the splits
    console.log("Deleting expense splits for expense ID:", expenseId);
    const { error: splitError } = await supabase
      .from('expense_splits')
      .delete()
      .eq('expense_id', expenseId);
    
    if (splitError) {
      console.error("Error deleting expense splits:", splitError);
      toast({
        title: "Error",
        description: "Failed to delete expense splits: " + splitError.message,
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Successfully deleted splits for expense ID:", expenseId);
    
    // Then delete the expense
    console.log("Deleting expense with ID:", expenseId, "for user:", session.user.id);
    const { error: expenseError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', session.user.id);
    
    if (expenseError) {
      console.error("Error deleting expense:", expenseError);
      toast({
        title: "Error",
        description: "Failed to delete expense: " + expenseError.message,
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Successfully deleted expense:", expenseId);
    toast({
      title: "Success",
      description: "Expense deleted successfully"
    });
    return true;
  } catch (error: any) {
    console.error("Error in deleteExpense:", error);
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred while deleting the expense",
      variant: "destructive"
    });
    return false;
  }
};
