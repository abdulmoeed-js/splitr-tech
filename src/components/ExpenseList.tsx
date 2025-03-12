
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Receipt, User } from "lucide-react";
import { Expense, Friend } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  friends: Friend[];
}

export const ExpenseList = ({ expenses, friends }: ExpenseListProps) => {
  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense.id} className="p-4 hover:shadow-md transition-shadow slide-up glass-panel">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-secondary rounded-xl">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{expense.description}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(expense.date, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">${expense.amount.toFixed(2)}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <User className="w-3 h-3 mr-1" />
                <span>
                  {friends.find((f) => f.id === expense.paidBy)?.name}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
