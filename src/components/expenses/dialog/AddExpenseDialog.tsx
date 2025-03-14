
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Friend, Split } from "@/types/expense";
import { AddExpenseForm } from "./AddExpenseForm";

interface AddExpenseDialogProps {
  friends: Friend[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
}

export function AddExpenseDialog({ 
  friends, 
  onAddExpense
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);

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
          <DialogDescription>
            Enter expense details to split among friends.
          </DialogDescription>
        </DialogHeader>
        <AddExpenseForm 
          friends={friends} 
          onAddExpense={onAddExpense}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
