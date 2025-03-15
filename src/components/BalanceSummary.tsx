
import { Friend, Expense, SettlementPayment } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";
import { CurrentBalances } from "@/components/balance/CurrentBalances";
import { BalanceChart } from "@/components/balance/BalanceChart";
import { SettlementPlan } from "@/components/balance/SettlementPlan";
import { RecentPayments } from "@/components/balance/RecentPayments";
import { calculateBalances, calculateDebts, formatCurrency } from "@/components/balance/BalanceCalculator";

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
  // Calculate balances and debts
  const balances = calculateBalances(expenses, friends, payments);
  const debts = calculateDebts(balances);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceChart 
          friends={friends}
          balances={balances}
          formatCurrency={formatCurrency}
        />
        
        <CurrentBalances 
          friends={friends} 
          balances={balances} 
          formatCurrency={formatCurrency} 
        />
      </div>

      <SettlementPlan 
        debts={debts} 
        friends={friends} 
        paymentMethods={paymentMethods} 
        onSettleDebt={onSettleDebt}
        formatCurrency={formatCurrency}
      />

      {payments.length > 0 && (
        <RecentPayments 
          payments={payments} 
          friends={friends} 
          formatCurrency={formatCurrency} 
        />
      )}
    </div>
  );
};
