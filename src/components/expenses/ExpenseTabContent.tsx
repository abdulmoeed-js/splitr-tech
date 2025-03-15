
import { Expense, Friend, PaymentReminder } from "@/types/expense";
import { ExpenseList } from "@/components/ExpenseList";
import { SettlementPayment } from "@/types/expense";

interface ExpenseTabContentProps {
  expenses: Expense[];
  friends: Friend[];
  reminders?: PaymentReminder[];
  onMarkReminderAsRead?: (reminderId: string) => void;
  onSettleReminder?: (reminder: PaymentReminder) => void;
  payments?: SettlementPayment[];
  onDeleteExpense?: (expenseId: string) => void;
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
          onDeleteExpense={onDeleteExpense}
        />
      )}
    </div>
  );
};
