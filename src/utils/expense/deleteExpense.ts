
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
    // First check if the expense exists and belongs to the user
    const { data: expense, error: checkError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', expenseId)
      .eq('user_id', session.user.id)
      .single();
    
    if (checkError || !expense) {
      console.error("Error checking expense or expense not found:", checkError);
      toast({
        title: "Error",
        description: "Expense not found or you don't have permission to delete it",
        variant: "destructive"
      });
      return false;
    }
    
    // Then delete the splits
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
    console.log("Deleting expense with ID:", expenseId);
    const { error: expenseError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);
    
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
