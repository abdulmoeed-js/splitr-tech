
import { Card } from "@/components/ui/card";
import { ArrowRight, Wallet, TrendingUp, TrendingDown } from "lucide-react";
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Current Balances
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {friends.map((friend) => (
            <Card key={friend.id} className="p-4 balance-card glass-panel">
              <div className="flex items-center justify-between">
                <span className="font-medium">{friend.name}</span>
                <div className="flex items-center gap-2">
                  {balances[friend.id] >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-semibold ${balances[friend.id] >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${Math.abs(balances[friend.id]).toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Settlement Plan</h2>
        <div className="space-y-3">
          {Object.entries(balances)
            .filter(([_, balance]) => balance < 0)
            .map(([debtorId, debtorBalance]) => {
              const debtor = friends.find((f) => f.id === debtorId);
              const creditor = friends.find(
                (f) => balances[f.id] > 0
              );
              if (debtor && creditor && balances[creditor.id] > 0) {
                return (
                  <Card key={debtorId} className="p-4 glass-panel bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{debtor.name}</span>
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <span className="font-medium">{creditor.name}</span>
                      </div>
                      <span className="font-semibold text-primary">
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
    </div>
  );
};
