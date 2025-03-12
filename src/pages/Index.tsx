
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseList } from "@/components/ExpenseList";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { BalanceSummary } from "@/components/BalanceSummary";
import { Friend, Expense, Split } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [friends, setFriends] = useState<Friend[]>([
    { id: "1", name: "You" },
    { id: "2", name: "Alice" },
    { id: "3", name: "Bob" },
    { id: "4", name: "Charlie" },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = (
    description: string,
    amount: number,
    paidBy: string,
    splits: Split[]
  ) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      paidBy,
      date: new Date(),
      splits,
    };
    setExpenses((prev) => [...prev, newExpense]);
    toast({
      title: "Expense Added",
      description: `$${amount.toFixed(2)} for ${description}`,
    });
  };

  const handleAddFriend = (name: string) => {
    const newFriend: Friend = {
      id: Date.now().toString(),
      name,
    };
    setFriends((prev) => [...prev, newFriend]);
    toast({
      title: "Friend Added",
      description: `${name} has been added to your friends list.`,
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Split Buddy</h1>
      
      <Tabs defaultValue="expenses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          {expenses.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No expenses yet. Add your first expense!
            </div>
          ) : (
            <ExpenseList expenses={expenses} friends={friends} />
          )}
        </TabsContent>

        <TabsContent value="balances">
          <BalanceSummary expenses={expenses} friends={friends} />
        </TabsContent>
      </Tabs>

      <AddExpenseDialog 
        friends={friends} 
        onAddExpense={handleAddExpense} 
        onAddFriend={handleAddFriend} 
      />
    </div>
  );
};

export default Index;
