
import { ExpenseList } from "@/components/ExpenseList";
import { Expense, Friend } from "@/types/expense";

interface ExpenseTabContentProps {
  expenses: Expense[];
  friends: Friend[];
}

export const ExpenseTabContent = ({ expenses, friends }: ExpenseTabContentProps) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 glass-panel">
        No expenses yet. Add your first expense!
      </div>
    );
  }

  return <ExpenseList expenses={expenses} friends={friends} />;
};
