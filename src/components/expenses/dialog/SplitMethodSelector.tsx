
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SplitMethodSelectorProps {
  value: "equal" | "custom" | "percentage";
  onChange: (value: "equal" | "custom" | "percentage") => void;
}

export function SplitMethodSelector({ 
  value,
  onChange 
}: SplitMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Split Method</Label>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as "equal" | "custom" | "percentage")}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="equal" id="equal" />
          <Label htmlFor="equal">Equal Split</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom">Custom Amounts</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="percentage" id="percentage" />
          <Label htmlFor="percentage">Percentage Split</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
