
import { Dispatch, SetStateAction, useEffect } from "react";
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
  // Set the settlement amount to the maximum amount when the component mounts or maxAmount changes
  useEffect(() => {
    if (maxAmount > 0) {
      setSettlementAmount(maxAmount.toFixed(2));
    }
  }, [maxAmount, setSettlementAmount]);

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
