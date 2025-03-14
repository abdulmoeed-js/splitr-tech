
import { Card } from "@/components/ui/card";
import { ArrowRight, Receipt } from "lucide-react";
import { PaymentReceipt } from "@/components/settlements/PaymentReceipt";
import { Friend, SettlementPayment } from "@/types/expense";
import { format } from "date-fns";

interface RecentPaymentsProps {
  payments: SettlementPayment[];
  friends: Friend[];
  formatCurrency: (amount: number) => string;
}

export const RecentPayments = ({ payments, friends, formatCurrency }: RecentPaymentsProps) => {
  if (payments.length === 0) {
    return null;
  }

  return (
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
                        {formatCurrency(payment.amount)}
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
  );
};
