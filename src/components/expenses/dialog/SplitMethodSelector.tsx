
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
  // Make sure the value is one of the allowed values
  const validValue = ["equal", "custom", "percentage"].includes(value) ? value : "equal";

  const handleValueChange = (newValue: string) => {
    if (["equal", "custom", "percentage"].includes(newValue)) {
      onChange(newValue as "equal" | "custom" | "percentage");
    }
  };

  return (
    <div className="space-y-2">
      <Label>Split Method</Label>
      <RadioGroup 
        value={validValue} 
        onValueChange={handleValueChange}
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
