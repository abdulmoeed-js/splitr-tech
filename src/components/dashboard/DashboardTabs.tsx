
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseDashboard } from "@/components/expenses/ExpenseDashboard";
import { ExpenseTabContent } from "@/components/expenses/ExpenseTabContent";
import { Friend, Expense, SettlementPayment, PaymentReminder } from "@/types/expense";

interface DashboardTabsProps {
  expenses: Expense[];
  friends: Friend[];
  filteredFriends: Friend[];
  payments: SettlementPayment[];
  reminders: PaymentReminder[];
  hasUnreadReminders: boolean;
  onSettleDebt: (payment: SettlementPayment) => void;
  onMarkReminderAsRead: (reminderId: string) => void;
  onSettleReminder: (reminder: PaymentReminder) => void;
  onDeleteExpense: (expenseId: string) => Promise<boolean>;
}

export function DashboardTabs({
  expenses,
  friends,
  filteredFriends,
  payments,
  reminders,
  hasUnreadReminders,
  onSettleDebt,
  onMarkReminderAsRead,
  onSettleReminder,
  onDeleteExpense
}: DashboardTabsProps) {
  // This will be used for the ExpenseDashboard component
  const dashboardProps = {
    filteredExpenses: expenses,
    friends,
    filteredFriends,
    payments,
    reminders,
    paymentMethods: [],
    hasUnreadReminders,
    onSettleDebt,
    onMarkReminderAsRead,
    onSettleReminder,
    onDeleteExpense
  };

  return (
    <Tabs defaultValue="dashboard" className="mt-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-4">
        <ExpenseDashboard 
          {...dashboardProps}
        />
      </TabsContent>

      <TabsContent value="expenses" className="mt-4">
        <ExpenseTabContent
          expenses={expenses}
          friends={filteredFriends}
          reminders={reminders}
          onMarkReminderAsRead={onMarkReminderAsRead}
          onSettleReminder={onSettleReminder}
          payments={payments}
          onDeleteExpense={onDeleteExpense}
        />
      </TabsContent>
    </Tabs>
  );
}
