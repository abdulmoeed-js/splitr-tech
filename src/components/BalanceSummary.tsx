
import { Card } from "@/components/ui/card";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";
import { PaymentReceipt } from "@/components/settlements/PaymentReceipt";
import { ArrowRight, Wallet, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { Friend, Expense, SettlementPayment } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";
import { format } from "date-fns";

interface BalanceSummaryProps {
  expenses: Expense[];
  friends: Friend[];
  payments?: SettlementPayment[];
  paymentMethods?: PaymentMethod[];
  onSettleDebt?: (payment: SettlementPayment) => void;
}

export const BalanceSummary = ({ 
  expenses, 
  friends,
  payments = [],
  paymentMethods = [],
  onSettleDebt
}: BalanceSummaryProps) => {
  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    friends.forEach((friend) => {
      balances[friend.id] = 0;
    });

    // Process expenses
    expenses.forEach((expense) => {
      // Add amount to payer's balance
      balances[expense.paidBy] += expense.amount;
      
      // Subtract split amounts from each person's balance
      expense.splits.forEach((split) => {
        balances[split.friendId] -= split.amount;
      });
    });
    
    // Process payments
    payments.forEach((payment) => {
      if (payment.status === "completed") {
        // From friend pays money (negative balance)
        balances[payment.fromFriendId] -= payment.amount;
        
        // To friend receives money (positive balance)
        balances[payment.toFriendId] += payment.amount;
      }
    });

    return balances;
  };

  const balances = calculateBalances();

  // Calculate who owes whom
  const calculateDebts = () => {
    const debts: { fromId: string; toId: string; amount: number }[] = [];
    
    // Create a copy of balances to work with
    const workingBalances = { ...balances };
    
    // Find people with negative balance (who owe money)
    const debtors = Object.entries(workingBalances)
      .filter(([_, balance]) => balance < 0)
      .sort(([_, a], [__, b]) => a - b); // Sort by amount, most negative first
    
    // Find people with positive balance (who are owed money)
    const creditors = Object.entries(workingBalances)
      .filter(([_, balance]) => balance > 0)
      .sort(([_, a], [__, b]) => b - a); // Sort by amount, most positive first
    
    // Match debtors with creditors
    while (debtors.length > 0 && creditors.length > 0) {
      const [debtorId, debtorBalance] = debtors[0];
      const [creditorId, creditorBalance] = creditors[0];
      
      // Calculate the amount to transfer
      const transferAmount = Math.min(Math.abs(debtorBalance), creditorBalance);
      
      if (transferAmount > 0) {
        // Add to debts
        debts.push({
          fromId: debtorId,
          toId: creditorId,
          amount: transferAmount
        });
        
        // Update balances
        workingBalances[debtorId] += transferAmount;
        workingBalances[creditorId] -= transferAmount;
        
        // Remove if balance is zero or update the arrays
        if (workingBalances[debtorId] >= -0.01) { // Account for floating point errors
          debtors.shift();
        } else {
          debtors[0] = [debtorId, workingBalances[debtorId]];
        }
        
        if (workingBalances[creditorId] <= 0.01) { // Account for floating point errors
          creditors.shift();
        } else {
          creditors[0] = [creditorId, workingBalances[creditorId]];
        }
      }
    }
    
    return debts;
  };

  const debts = calculateDebts();

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
        {debts.length === 0 ? (
          <Card className="p-6 text-center glass-panel">
            <p className="text-muted-foreground">All balances are settled! 🎉</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {debts.map((debt, index) => {
              const debtor = friends.find((f) => f.id === debt.fromId);
              const creditor = friends.find((f) => f.id === debt.toId);
              
              if (debtor && creditor) {
                return (
                  <Card key={index} className="p-4 glass-panel bg-secondary/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{debtor.name}</span>
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <span className="font-medium">{creditor.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">
                          ${debt.amount.toFixed(2)}
                        </span>
                        
                        {/* Only show settle up button if the current user is the debtor */}
                        {onSettleDebt && debtor.id === "1" && (
                          <SettlementDialog 
                            fromFriend={debtor}
                            toFriend={creditor}
                            amount={debt.amount}
                            paymentMethods={paymentMethods}
                            onSettleDebt={onSettleDebt}
                          />
                        )}
                      </div>
                    </div>
                  </Card>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {payments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Recent Payments
          </h2>
          <div className="space-y-3">
            {payments
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((payment) => {
                const fromFriend = friends.find((f) => f.id === payment.fromFriendId);
                const toFriend = friends.find((f) => f.id === payment.toFriendId);
                
                if (fromFriend && toFriend) {
                  return (
                    <Card key={payment.id} className="p-4 glass-panel">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{fromFriend.name}</span>
                            <ArrowRight className="w-4 h-4 text-primary" />
                            <span className="font-medium">{toFriend.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(payment.date, "MMM d, yyyy")} • {payment.method}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">
                            ${payment.amount.toFixed(2)}
                          </span>
                          <PaymentReceipt payment={payment} friends={friends} />
                        </div>
                      </div>
                    </Card>
                  );
                }
                return null;
              })}
          </div>
        </div>
      )}
    </div>
  );
};
