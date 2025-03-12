
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Receipt, User, Users } from "lucide-react";
import { Expense, Friend, FriendGroup } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  friends: Friend[];
  groups?: FriendGroup[];
}

export const ExpenseList = ({ expenses, friends, groups = [] }: ExpenseListProps) => {
  // Sort expenses by date, most recent first
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedExpenses.map((expense) => {
        const payer = friends.find(f => f.id === expense.paidBy);
        const group = expense.groupId ? groups.find(g => g.id === expense.groupId) : null;
        
        return (
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
                  
                  {group && (
                    <div className="mt-1">
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" />
                        {group.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">${expense.amount.toFixed(2)}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <User className="w-3 h-3 mr-1" />
                  <span>
                    Paid by {payer?.name}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Split among {expense.splits.length} {expense.splits.length === 1 ? 'person' : 'people'}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
