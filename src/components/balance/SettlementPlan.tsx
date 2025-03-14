
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";
import { Friend, SettlementPayment } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";

interface Debt {
  fromId: string;
  toId: string;
  amount: number;
}

interface SettlementPlanProps {
  debts: Debt[];
  friends: Friend[];
  paymentMethods: PaymentMethod[];
  onSettleDebt?: (payment: SettlementPayment) => void;
  formatCurrency: (amount: number) => string;
}

export const SettlementPlan = ({ 
  debts, 
  friends, 
  paymentMethods, 
  onSettleDebt,
  formatCurrency 
}: SettlementPlanProps) => {
  return (
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
                        {formatCurrency(debt.amount)}
                      </span>
                      
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
  );
};
