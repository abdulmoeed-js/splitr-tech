
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Friend, Expense } from "@/types/expense";

interface BalanceSummaryProps {
  expenses: Expense[];
  friends: Friend[];
}

export const BalanceSummary = ({ expenses, friends }: BalanceSummaryProps) => {
  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    friends.forEach((friend) => {
      balances[friend.id] = 0;
    });

    expenses.forEach((expense) => {
      // Add amount to payer's balance
      balances[expense.paidBy] += expense.amount;
      
      // Subtract split amounts from each person's balance
      expense.splits.forEach((split) => {
        balances[split.friendId] -= split.amount;
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Current Balances</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {friends.map((friend) => (
          <Card key={friend.id} className="p-4 slide-up">
            <div className="flex items-center justify-between">
              <span className="font-medium">{friend.name}</span>
              <span className={`font-semibold ${balances[friend.id] >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${balances[friend.id].toFixed(2)}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-8">Settlement Suggestions</h2>
      <div className="space-y-2">
        {Object.entries(balances)
          .filter(([_, balance]) => balance < 0)
          .map(([debtorId, debtorBalance]) => {
            const debtor = friends.find((f) => f.id === debtorId);
            const creditor = friends.find(
              (f) => balances[f.id] > 0
            );
            if (debtor && creditor && balances[creditor.id] > 0) {
              return (
                <Card key={debtorId} className="p-4 bg-accent/50 slide-up">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{debtor.name}</span>
                      <ArrowRight className="w-4 h-4" />
                      <span>{creditor.name}</span>
                    </div>
                    <span className="font-medium">
                      ${Math.abs(debtorBalance).toFixed(2)}
                    </span>
                  </div>
                </Card>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
};
