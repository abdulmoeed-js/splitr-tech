
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettlementAmountProps {
  settlementAmount: string;
  setSettlementAmount: Dispatch<SetStateAction<string>>;
  maxAmount: number;
}

export const SettlementAmount = ({
  settlementAmount,
  setSettlementAmount,
  maxAmount
}: SettlementAmountProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount to Pay (PKR)</Label>
      <Input
        id="amount"
        type="number"
        value={settlementAmount}
        onChange={(e) => setSettlementAmount(e.target.value)}
        step="0.01"
        min="0.01"
        max={maxAmount.toString()}
        required
      />
    </div>
  );
};
