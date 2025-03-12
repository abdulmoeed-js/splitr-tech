
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentMethodTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const PaymentMethodTypeSelect = ({ value, onValueChange }: PaymentMethodTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="methodType">Payment Method Type</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select payment method type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="card">Credit/Debit Card</SelectItem>
          <SelectItem value="easypaisa">EasyPaisa</SelectItem>
          <SelectItem value="jazzcash">JazzCash</SelectItem>
          <SelectItem value="bank">Bank Account</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
