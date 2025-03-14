
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ExpenseDescriptionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export function ExpenseDescription({ 
  description, 
  onDescriptionChange 
}: ExpenseDescriptionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Input
        id="description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Expense description"
        required
      />
    </div>
  );
}
