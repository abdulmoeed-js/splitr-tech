
import { ExpenseList } from "@/components/ExpenseList";
import { Expense, Friend, PaymentReminder, SettlementPayment } from "@/types/expense";

interface ExpenseTabContentProps {
  expenses: Expense[];
  friends: Friend[];
  reminders?: PaymentReminder[];
  onMarkReminderAsRead?: (reminderId: string) => void;
  onSettleReminder?: (reminder: PaymentReminder) => void;
  payments?: SettlementPayment[];
}

export const ExpenseTabContent = ({ 
  expenses, 
  friends, 
  reminders = [],
  onMarkReminderAsRead,
  onSettleReminder,
  payments = []
}: ExpenseTabContentProps) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 glass-panel">
        No expenses yet. Add your first expense!
      </div>
    );
  }

  return <ExpenseList expenses={expenses} friends={friends} />;
};
