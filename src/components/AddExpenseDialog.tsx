
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Friend, Split } from "@/types/expense";
import { useToast } from "@/components/ui/use-toast";

interface AddExpenseDialogProps {
  friends: Friend[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
}

export function AddExpenseDialog({ 
  friends, 
  onAddExpense
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(friends[0]?.id || "");
  const [splits, setSplits] = useState<Split[]>([]);
  const { toast } = useToast();

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy(friends[0]?.id || "");
    setSplits([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount.trim()) {
      toast({
        title: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (!paidBy) {
      toast({
        title: "Please select who paid the expense.",
        variant: "destructive",
      });
      return;
    }

    if (splits.length === 0) {
      toast({
        title: "Please add at least one split.",
        variant: "destructive",
      });
      return;
    }

    onAddExpense(description, amountValue, paidBy, splits);
    setOpen(false);
    resetForm();
    
    toast({
      title: "Expense Added",
      description: "Your expense has been successfully added.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expense description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <select
              id="paidBy"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {friends.map((friend) => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Splits</Label>
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-2">
                <Label htmlFor={`split-${friend.id}`}>{friend.name}</Label>
                <Input
                  type="number"
                  id={`split-${friend.id}`}
                  placeholder="0.00"
                  className="w-24"
                  onChange={(e) => {
                    const splitAmount = parseFloat(e.target.value);
                    if (!isNaN(splitAmount)) {
                      setSplits((prevSplits) => {
                        const existingSplitIndex = prevSplits.findIndex(
                          (split) => split.friendId === friend.id
                        );
                        if (existingSplitIndex !== -1) {
                          const newSplits = [...prevSplits];
                          newSplits[existingSplitIndex] = {
                            ...newSplits[existingSplitIndex],
                            amount: splitAmount,
                          };
                          return newSplits;
                        } else {
                          return [
                            ...prevSplits,
                            { friendId: friend.id, amount: splitAmount },
                          ];
                        }
                      });
                    } else {
                      setSplits((prevSplits) =>
                        prevSplits.filter((split) => split.friendId !== friend.id)
                      );
                    }
                  }}
                />
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
