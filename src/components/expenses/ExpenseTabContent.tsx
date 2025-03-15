
import { Expense, Friend, PaymentReminder } from "@/types/expense";
import { ExpenseList } from "@/components/ExpenseList";
import { SettlementPayment } from "@/types/expense";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface ExpenseTabContentProps {
  expenses: Expense[];
  friends: Friend[];
  reminders?: PaymentReminder[];
  onMarkReminderAsRead?: (reminderId: string) => void;
  onSettleReminder?: (reminder: PaymentReminder) => void;
  payments?: SettlementPayment[];
  onDeleteExpense?: (expenseId: string) => Promise<boolean> | void;
}

export const ExpenseTabContent = ({ 
  expenses, 
  friends,
  reminders = [],
  onMarkReminderAsRead,
  onSettleReminder,
  payments = [],
  onDeleteExpense
}: ExpenseTabContentProps) => {
  // Add state to track when an expense is being deleted
  const [isDeletingExpense, setIsDeletingExpense] = useState(false);
  
  // Handle expense deletion with loading state
  const handleDeleteExpense = async (expenseId: string): Promise<boolean> => {
    if (!onDeleteExpense) return false;
    
    setIsDeletingExpense(true);
    try {
      const result = await Promise.resolve(onDeleteExpense(expenseId));
      return result === false ? false : true;
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
      return false;
    } finally {
      // Ensure we reset the loading state whether deletion succeeded or failed
      setIsDeletingExpense(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {expenses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No expenses yet. Add your first expense to get started!</p>
        </div>
      ) : (
        <ExpenseList 
          expenses={expenses} 
          friends={friends} 
          onDeleteExpense={onDeleteExpense ? handleDeleteExpense : undefined}
          isDeleting={isDeletingExpense}
        />
      )}
    </div>
  );
};
