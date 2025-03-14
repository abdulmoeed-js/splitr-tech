
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Friend } from "@/types/expense";

interface CurrentBalancesProps {
  friends: Friend[];
  balances: Record<string, number>;
  formatCurrency: (amount: number) => string;
}

export const CurrentBalances = ({ friends, balances, formatCurrency }: CurrentBalancesProps) => {
  return (
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
                  {formatCurrency(Math.abs(balances[friend.id]))}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
