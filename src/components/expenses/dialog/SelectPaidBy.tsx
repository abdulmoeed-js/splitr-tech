
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Friend } from "@/types/expense";

interface SelectPaidByProps {
  friends: Friend[];
  value: string;
  onChange: (value: string) => void;
}

export function SelectPaidBy({ friends, value, onChange }: SelectPaidByProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="paidBy">Paid By</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select who paid" />
        </SelectTrigger>
        <SelectContent>
          {friends.map((friend) => (
            <SelectItem key={friend.id} value={friend.id}>
              {friend.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
