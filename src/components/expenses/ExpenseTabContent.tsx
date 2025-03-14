
import { ExpenseList } from "@/components/ExpenseList";
import { Expense, Friend, PaymentReminder, SettlementPayment } from "@/types/expense";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpenseTabContentProps {
  expenses: Expense[];
  friends: Friend[];
  reminders?: PaymentReminder[];
  onMarkReminderAsRead?: (reminderId: string) => void;
  onSettleReminder?: (reminder: PaymentReminder) => void;
  payments?: SettlementPayment[];
  onRefresh?: () => void;
}

export const ExpenseTabContent = ({ 
  expenses, 
  friends, 
  reminders = [],
  onMarkReminderAsRead,
  onSettleReminder,
  payments = [],
  onRefresh
}: ExpenseTabContentProps) => {
  console.log("ExpenseTabContent rendering:", { 
    expensesCount: expenses?.length || 0,
    friendsCount: friends?.length || 0,
    remindersCount: reminders?.length || 0,
    paymentsCount: payments?.length || 0,
    hasRefreshCallback: !!onRefresh
  });
  
  // Log first few expenses for debugging
  if (expenses && expenses.length > 0) {
    console.log("First expense sample:", expenses[0]);
  }
  
  // Defensive check to ensure expenses is an array
  const hasExpenses = Array.isArray(expenses) && expenses.length > 0;
  
  if (!hasExpenses) {
    console.log("No expenses to display, showing empty state");
    return (
      <div className="text-center text-muted-foreground py-12 glass-panel rounded-lg">
        <p className="mb-4">No expenses yet. Add your first expense!</p>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log("Refresh button clicked");
              onRefresh();
            }} 
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>
    );
  }

  // Ensure friends array is defined
  const validFriends = Array.isArray(friends) ? friends : [];
  console.log("Rendering ExpenseList with valid friends:", validFriends.length);

  return <ExpenseList expenses={expenses} friends={validFriends} />;
};
