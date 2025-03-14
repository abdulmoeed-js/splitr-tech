
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ExpenseAmountProps {
  amount: string;
  onAmountChange: (value: string) => void;
}

export function ExpenseAmount({ amount, onAmountChange }: ExpenseAmountProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <Input
        id="amount"
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        placeholder="0.00"
        required
      />
    </div>
  );
}
