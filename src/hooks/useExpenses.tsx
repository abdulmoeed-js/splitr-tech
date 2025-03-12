
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Friend, Expense, Split, FriendGroup, SettlementPayment, PaymentReminder } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";
import { toast } from "@/components/ui/use-toast";

export const useExpenses = () => {
  const { user, isLoaded } = useUser();
  
  // Set a default name that works whether logged in or not
  const userName = user?.fullName || "You";
  
  const [friends, setFriends] = useState<Friend[]>([
    { id: "1", name: userName },
    { id: "2", name: "Alice" },
    { id: "3", name: "Bob" },
    { id: "4", name: "Charlie" },
  ]);

  // Update friends list if user name changes
  useEffect(() => {
    if (isLoaded && user?.fullName) {
      setFriends(prev => {
        const updated = [...prev];
        const userIndex = updated.findIndex(f => f.id === "1");
        if (userIndex !== -1) {
          updated[userIndex] = { ...updated[userIndex], name: user.fullName || "You" };
        }
        return updated;
      });
    }
  }, [isLoaded, user?.fullName]);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groups, setGroups] = useState<FriendGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [payments, setPayments] = useState<SettlementPayment[]>([]);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    // Simulate fetching payment methods
    const fetchMethods = async () => {
      // In a real app, this would be an API call
      const methods: PaymentMethod[] = [
        { id: "1", type: "card", name: "Personal Card", lastFour: "4242", expiryDate: "04/25" }
      ];
      setPaymentMethods(methods);
    };
    
    fetchMethods();
  }, []);

  // Simulate monthly reminders
  useEffect(() => {
    const calculateReminders = () => {
      const balances = calculateBalances();
      const newReminders: PaymentReminder[] = [];
      
      Object.entries(balances).forEach(([fromId, friendBalances]) => {
        Object.entries(friendBalances).forEach(([toId, amount]) => {
          if (amount > 0) {
            // Only create a reminder if there's an outstanding balance
            const existingReminder = reminders.find(
              r => r.fromFriendId === fromId && r.toFriendId === toId && !r.isPaid
            );
            
            if (!existingReminder) {
              // Set due date to 1 month from now
              const dueDate = new Date();
              dueDate.setMonth(dueDate.getMonth() + 1);
              
              newReminders.push({
                id: Date.now().toString() + fromId + toId,
                fromFriendId: fromId,
                toFriendId: toId,
                amount: amount,
                dueDate,
                isRead: false,
                isPaid: false
              });
            }
          }
        });
      });
      
      if (newReminders.length > 0) {
        setReminders(prev => [...prev, ...newReminders]);
      }
    };
    
    // Calculate initial reminders
    if (expenses.length > 0 && reminders.length === 0) {
      calculateReminders();
    }
  }, [expenses]);

  const calculateBalances = () => {
    // Calculate what each person owes to others
    const balances: Record<string, Record<string, number>> = {};
    
    // Initialize balances
    friends.forEach(f1 => {
      balances[f1.id] = {};
      friends.forEach(f2 => {
        if (f1.id !== f2.id) {
          balances[f1.id][f2.id] = 0;
        }
      });
    });
    
    // Process expenses
    expenses.forEach(expense => {
      const payer = expense.paidBy;
      
      expense.splits.forEach(split => {
        const debtor = split.friendId;
        
        if (payer !== debtor) {
          // Debtor owes payer
          balances[debtor][payer] += split.amount;
          
          // Payer is owed by debtor (negative entry)
          balances[payer][debtor] -= split.amount;
        }
      });
    });
    
    // Process payments
    payments.forEach(payment => {
      const { fromFriendId, toFriendId, amount } = payment;
      
      if (payment.status === "completed") {
        // Reduce what fromFriend owes to toFriend
        balances[fromFriendId][toFriendId] -= amount;
        
        // Reduce what toFriend is owed by fromFriend
        balances[toFriendId][fromFriendId] += amount;
      }
    });
    
    // Simplify balances (remove zero or negative amounts)
    Object.keys(balances).forEach(fromId => {
      Object.keys(balances[fromId]).forEach(toId => {
        if (balances[fromId][toId] <= 0) {
          balances[fromId][toId] = 0;
        }
      });
    });
    
    return balances;
  };

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
      groupId: selectedGroupId
    };
    
    setExpenses(prev => [...prev, newExpense]);
    
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
    
    setFriends(prev => [...prev, newFriend]);
    
    toast({
      title: "Friend Added",
      description: `${name} has been added to your friends list.`,
    });
  };

  const handleAddGroup = (group: FriendGroup) => {
    setGroups(prev => [...prev, group]);
  };

  const handleSelectGroup = (groupId: string | null) => {
    setSelectedGroupId(groupId);
  };

  const handleSettleDebt = (payment: SettlementPayment) => {
    setPayments(prev => [...prev, payment]);
    
    // Update reminders if applicable
    setReminders(prev => 
      prev.map(reminder => 
        reminder.fromFriendId === payment.fromFriendId && 
        reminder.toFriendId === payment.toFriendId && 
        !reminder.isPaid
          ? { ...reminder, isPaid: true }
          : reminder
      )
    );
  };

  const handleMarkReminderAsRead = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, isRead: true }
          : reminder
      )
    );
  };

  const handleSettleReminder = (reminder: PaymentReminder) => {
    // Create a payment from the reminder
    const payment: SettlementPayment = {
      id: Date.now().toString(),
      fromFriendId: reminder.fromFriendId,
      toFriendId: reminder.toFriendId,
      amount: reminder.amount,
      date: new Date(),
      status: "completed",
      method: "in-app",
      receiptUrl: `receipt-${Date.now()}.pdf` // Simulated receipt URL
    };
    
    handleSettleDebt(payment);
    
    toast({
      title: "Payment Successful",
      description: `You paid ${friends.find(f => f.id === reminder.toFriendId)?.name} $${reminder.amount.toFixed(2)}`
    });
  };

  // Filter friends based on selected group
  const filteredFriends = selectedGroupId
    ? groups.find(g => g.id === selectedGroupId)?.members || friends
    : friends;

  // Filter expenses based on selected group
  const filteredExpenses = selectedGroupId
    ? expenses.filter(expense => expense.groupId === selectedGroupId)
    : expenses;

  // Calculate if there are unread reminders
  const hasUnreadReminders = reminders.some(r => !r.isRead);

  return {
    isLoaded,
    friends,
    filteredFriends,
    expenses,
    filteredExpenses,
    groups,
    selectedGroupId,
    payments,
    reminders,
    paymentMethods,
    hasUnreadReminders,
    calculateBalances,
    handleAddExpense,
    handleAddFriend,
    handleAddGroup,
    handleSelectGroup,
    handleSettleDebt,
    handleMarkReminderAsRead,
    handleSettleReminder
  };
};
