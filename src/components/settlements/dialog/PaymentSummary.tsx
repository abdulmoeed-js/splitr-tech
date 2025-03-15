
import { Friend } from "@/types/expense";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";

interface PaymentSummaryProps {
  fromFriend: Friend;
  toFriend: Friend;
  amount: number;
}

export const PaymentSummary = ({ fromFriend, toFriend, amount }: PaymentSummaryProps) => {
  return (
    <div className="space-y-2">
      <Label>Payment Details</Label>
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center gap-2">
          <span>{fromFriend.name}</span>
          <ArrowRight className="h-4 w-4 text-primary" />
          <span>{toFriend.name}</span>
        </div>
        <div className="font-semibold">Rs. {parseFloat(amount.toFixed(2)).toLocaleString('en-PK')}</div>
      </div>
    </div>
  );
};
