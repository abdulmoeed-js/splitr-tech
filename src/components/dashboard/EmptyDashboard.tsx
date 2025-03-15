
import { AddExpenseDialog } from "@/components/expenses/dialog/AddExpenseDialog";
import { Friend, Split } from "@/types/expense";

interface EmptyDashboardProps {
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
  friends: Friend[];
}

export function EmptyDashboard({ onAddExpense, friends }: EmptyDashboardProps) {
  return (
    <div className="text-center p-8 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Welcome to SplitWise</h2>
      <p className="mb-6 text-muted-foreground">
        Start by adding friends and expenses to track your shared spending
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <AddExpenseDialog
          onAddExpense={onAddExpense}
          friends={friends}
        />
      </div>
    </div>
  );
}
