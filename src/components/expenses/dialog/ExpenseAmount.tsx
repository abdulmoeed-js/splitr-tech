
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ExpenseAmountProps {
  amount: string;
  onAmountChange: (value: string) => void;
}

export function ExpenseAmount({ amount, onAmountChange }: ExpenseAmountProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount</Label>
      <Input
        id="amount"
        type="text"
        inputMode="decimal"
        value={amount}
        onChange={handleAmountChange}
        placeholder="0.00"
        min="0"
        step="0.01"
        required
      />
    </div>
  );
}
