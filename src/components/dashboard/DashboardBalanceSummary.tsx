
import { Friend, Expense, SettlementPayment } from "@/types/expense";
import { BalanceSummary } from "@/components/BalanceSummary";
import { AddExpenseDialog } from "@/components/expenses/dialog/AddExpenseDialog";

interface DashboardBalanceSummaryProps {
  expenses: Expense[];
  filteredFriends: Friend[];
  payments: SettlementPayment[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: any[]) => void;
}

export function DashboardBalanceSummary({
  expenses,
  filteredFriends,
  payments,
  onAddExpense
}: DashboardBalanceSummaryProps) {
  // Make sure all friends including "You" are shown in the balance summary
  const allFriends = filteredFriends;
  
  return (
    <>
      {/* Balance summary component */}
      <BalanceSummary
        expenses={expenses}
        friends={allFriends}
        payments={payments}
      />

      {/* Add Expense Button */}
      <div className="flex justify-end">
        <AddExpenseDialog
          onAddExpense={onAddExpense}
          friends={allFriends}
        />
      </div>
    </>
  );
}
