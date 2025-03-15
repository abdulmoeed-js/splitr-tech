
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Receipt, User, Users, Trash2, Loader2 } from "lucide-react";
import { Expense, Friend, FriendGroup } from "@/types/expense";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ExpenseListProps {
  expenses: Expense[];
  friends: Friend[];
  groups?: FriendGroup[];
  onDeleteExpense?: (expenseId: string) => Promise<boolean> | void;
  isDeleting?: boolean;
}

export const ExpenseList = ({ 
  expenses, 
  friends, 
  groups = [], 
  onDeleteExpense,
  isDeleting = false
}: ExpenseListProps) => {
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localIsDeleting, setLocalIsDeleting] = useState(false);
  
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        No expenses found
      </div>
    );
  }

  // Ensure we have a valid friends array
  const validFriends = Array.isArray(friends) ? friends : [];
  const validGroups = Array.isArray(groups) ? groups : [];

  // Sort expenses by date, most recent first
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatCurrency = (amount: number) => {
    return `Rs. ${parseFloat(amount.toFixed(2)).toLocaleString('en-PK')}`;
  };

  const handleDelete = async () => {
    if (expenseToDelete && onDeleteExpense) {
      try {
        setLocalIsDeleting(true);
        const result = await onDeleteExpense(expenseToDelete);
        
        if (result === false) {
          toast({
            title: "Error",
            description: "Failed to delete expense. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error in handleDelete:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred while deleting the expense.",
          variant: "destructive"
        });
      } finally {
        setLocalIsDeleting(false);
        setExpenseToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const openDeleteDialog = (expenseId: string) => {
    setExpenseToDelete(expenseId);
    setIsDeleteDialogOpen(true);
  };

  // Determine if we're currently deleting
  const isDeletingExpense = isDeleting || localIsDeleting;

  return (
    <div className="space-y-4">
      {sortedExpenses.map((expense) => {
        // Find the payer, handle case where payer might not be found
        const payer = validFriends.find(f => String(f.id) === String(expense.paidBy)) || 
          { id: expense.paidBy, name: `Friend #${expense.paidBy}` };
        
        // Find the group if it exists
        const group = expense.groupId ? validGroups.find(g => g.id === expense.groupId) : null;
        
        const isCurrentlyDeleting = isDeletingExpense && expenseToDelete === expense.id;
        
        return (
          <Card key={expense.id} className="p-4 hover:shadow-md transition-shadow slide-up glass-panel">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-secondary rounded-xl">
                  <Receipt className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{expense.description}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </p>
                  
                  {group && (
                    <div className="mt-1">
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" />
                        {group.name}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-bold text-primary">{formatCurrency(expense.amount)}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <User className="w-3 h-3 mr-1" />
                  <span>
                    Paid by {payer?.name}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Split among {expense.splits?.length || 0} {expense.splits?.length === 1 ? 'person' : 'people'}
                </div>
                {onDeleteExpense && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mt-2 text-muted-foreground hover:text-destructive"
                    onClick={() => openDeleteDialog(expense.id)}
                    disabled={isDeletingExpense}
                  >
                    {isCurrentlyDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setExpenseToDelete(null)}
              disabled={isDeletingExpense}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive"
              disabled={isDeletingExpense}
            >
              {isDeletingExpense ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
