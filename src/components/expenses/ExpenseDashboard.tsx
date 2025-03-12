
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseTabContent } from "@/components/expenses/ExpenseTabContent";
import { BalanceSummary } from "@/components/BalanceSummary";
import { RemindersList } from "@/components/settlements/RemindersList";
import { Friend, Expense, SettlementPayment, PaymentReminder } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";

interface ExpenseDashboardProps {
  expenses: Expense[];
  filteredExpenses: Expense[];
  friends: Friend[];
  filteredFriends: Friend[];
  payments: SettlementPayment[];
  reminders: PaymentReminder[];
  paymentMethods: PaymentMethod[];
  hasUnreadReminders: boolean;
  onSettleDebt: (payment: SettlementPayment) => void;
  onMarkReminderAsRead: (reminderId: string) => void;
  onSettleReminder: (reminder: PaymentReminder) => void;
}

export const ExpenseDashboard = ({
  filteredExpenses,
  friends,
  filteredFriends,
  payments,
  reminders,
  paymentMethods,
  hasUnreadReminders,
  onSettleDebt,
  onMarkReminderAsRead,
  onSettleReminder
}: ExpenseDashboardProps) => {
  return (
    <Tabs defaultValue="expenses" className="space-y-8">
      <TabsList className="grid w-full grid-cols-3 rounded-full p-1">
        <TabsTrigger value="expenses" className="rounded-full">Expenses</TabsTrigger>
        <TabsTrigger value="balances" className="rounded-full">Balances</TabsTrigger>
        <TabsTrigger value="reminders" className="rounded-full relative">
          Reminders
          {hasUnreadReminders && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-2 h-2"></span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="expenses" className="space-y-4">
        <ExpenseTabContent expenses={filteredExpenses} friends={friends} />
      </TabsContent>

      <TabsContent value="balances">
        <BalanceSummary 
          expenses={filteredExpenses} 
          friends={filteredFriends}
          payments={payments}
          paymentMethods={paymentMethods}
          onSettleDebt={onSettleDebt} 
        />
      </TabsContent>
      
      <TabsContent value="reminders">
        <RemindersList 
          reminders={reminders}
          friends={friends}
          onMarkAsRead={onMarkReminderAsRead}
          onSettleReminder={onSettleReminder}
        />
      </TabsContent>
    </Tabs>
  );
};
