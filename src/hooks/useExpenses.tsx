
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Friend, Expense, Split, FriendGroup, SettlementPayment, PaymentReminder } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";
import { toast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useExpenses = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const queryClient = useQueryClient();
  
  // Default name that works whether logged in or not
  const userName = session?.user?.email?.split('@')[0] || "You";
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user && event === 'SIGNED_IN') {
          // Force a refetch of data when user signs in
          queryClient.invalidateQueries({ queryKey: ['friends'] });
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
          queryClient.invalidateQueries({ queryKey: ['groups'] });
          queryClient.invalidateQueries({ queryKey: ['payments'] });
          queryClient.invalidateQueries({ queryKey: ['reminders'] });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  // Fetch friends from Supabase
  const { data: friends = [], isLoading: isFriendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      if (!session?.user) {
        // Return default friends for non-authenticated users
        return [
          { id: "1", name: userName },
          { id: "2", name: "Alice" },
          { id: "3", name: "Bob" },
          { id: "4", name: "Charlie" },
        ] as Friend[];
      }

      // First, ensure the user has a "You" entry
      const userFriendExists = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('name', userName)
        .single();
      
      if (userFriendExists.error && userFriendExists.error.code === 'PGRST116') {
        // "You" friend doesn't exist, create it
        await supabase
          .from('friends')
          .insert({
            user_id: session.user.id,
            name: userName
          });
      }

      // Now fetch all friends
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Convert database records to Friend objects
      return data.map(friend => ({
        id: friend.id,
        name: friend.name
      }));
    },
    enabled: !!session || !isLoaded,
  });

  // Add friend mutation
  const addFriendMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!session?.user) {
        // Generate a local ID for non-authenticated users
        return { id: Date.now().toString(), name };
      }

      const { data, error } = await supabase
        .from('friends')
        .insert({
          user_id: session.user.id,
          name
        })
        .select()
        .single();
      
      if (error) throw error;
      return { id: data.id, name: data.name };
    },
    onSuccess: (newFriend) => {
      queryClient.setQueryData(['friends'], (oldFriends: Friend[] = []) => [...oldFriends, newFriend]);
      
      toast({
        title: "Friend Added",
        description: `${newFriend.name} has been added to your friends list.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Friend",
        description: error.message || "An error occurred while adding friend",
        variant: "destructive"
      });
    }
  });

  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      // Check if friend has associated expenses
      const hasExpensesCheck = async () => {
        if (!session?.user) {
          return expenses.some(exp => 
            exp.paidBy === friendId || exp.splits.some(split => split.friendId === friendId)
          );
        }

        // Check if friend is payer or has splits in any expense
        const { data: paidByData } = await supabase
          .from('expenses')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('paid_by', friendId)
          .limit(1);
        
        if (paidByData && paidByData.length > 0) return true;
        
        const { data: splitData } = await supabase
          .from('expense_splits')
          .select('id')
          .eq('friend_id', friendId)
          .limit(1);
        
        return splitData && splitData.length > 0;
      };

      if (friendId === "1" || (await hasExpensesCheck())) {
        throw new Error(
          friendId === "1" 
            ? "Cannot remove yourself from friends list." 
            : "This friend has associated expenses. Settle all expenses before removing."
        );
      }

      if (session?.user) {
        // Remove friend from database
        const { error } = await supabase
          .from('friends')
          .delete()
          .eq('id', friendId)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
      }

      return friendId;
    },
    onSuccess: (removedFriendId) => {
      // Update friends list
      queryClient.setQueryData(['friends'], (oldFriends: Friend[] = []) => 
        oldFriends.filter(friend => friend.id !== removedFriendId)
      );
      
      // Also update groups to remove this friend
      queryClient.setQueryData(['groups'], (oldGroups: FriendGroup[] = []) =>
        oldGroups.map(group => ({
          ...group,
          members: group.members.filter(member => member.id !== removedFriendId)
        }))
      );
      
      const removedFriend = friends.find(f => f.id === removedFriendId);
      toast({
        title: "Friend Removed",
        description: `${removedFriend?.name || 'Friend'} has been removed from your friends list.`
      });
    },
    onError: (error) => {
      toast({
        title: "Cannot Remove Friend",
        description: error.message || "An error occurred while removing friend",
        variant: "destructive"
      });
    }
  });

  // Fetch expenses from Supabase
  const { data: expenses = [], isLoading: isExpensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      if (!session?.user) {
        return [] as Expense[]; // Empty expenses for non-authenticated users
      }

      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          expense_splits:expense_splits(*)
        `)
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(exp => ({
        id: exp.id,
        description: exp.description,
        amount: Number(exp.amount),
        paidBy: exp.paid_by,
        date: new Date(exp.date),
        groupId: exp.group_id || undefined,
        splits: exp.expense_splits.map((split: any) => ({
          friendId: split.friend_id,
          amount: Number(split.amount),
          percentage: split.percentage ? Number(split.percentage) : undefined
        }))
      }));
    },
    enabled: !!session
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: { 
      description: string; 
      amount: number; 
      paidBy: string; 
      splits: Split[];
      groupId?: string;
    }) => {
      if (!session?.user) {
        // Create a local expense for non-authenticated users
        return {
          id: Date.now().toString(),
          description: newExpense.description,
          amount: newExpense.amount,
          paidBy: newExpense.paidBy,
          date: new Date(),
          splits: newExpense.splits,
          groupId: newExpense.groupId
        };
      }

      // Insert the expense
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          user_id: session.user.id,
          description: newExpense.description,
          amount: newExpense.amount,
          paid_by: newExpense.paidBy,
          group_id: newExpense.groupId || null
        })
        .select()
        .single();
      
      if (expenseError) throw expenseError;
      
      // Insert the splits
      const splits = newExpense.splits.map(split => ({
        expense_id: expenseData.id,
        friend_id: split.friendId,
        amount: split.amount,
        percentage: split.percentage || null
      }));
      
      const { error: splitsError } = await supabase
        .from('expense_splits')
        .insert(splits);
      
      if (splitsError) throw splitsError;
      
      // Return the complete expense with splits
      return {
        id: expenseData.id,
        description: expenseData.description,
        amount: Number(expenseData.amount),
        paidBy: expenseData.paid_by,
        date: new Date(expenseData.date),
        groupId: expenseData.group_id || undefined,
        splits: newExpense.splits
      };
    },
    onSuccess: (newExpense) => {
      queryClient.setQueryData(['expenses'], (oldExpenses: Expense[] = []) => 
        [newExpense, ...oldExpenses]
      );
      
      toast({
        title: "Expense Added",
        description: `$${newExpense.amount.toFixed(2)} for ${newExpense.description}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Expense",
        description: error.message || "An error occurred while adding expense",
        variant: "destructive"
      });
    }
  });

  // Fetch friend groups
  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      if (!session?.user) {
        return [] as FriendGroup[];
      }

      const { data, error } = await supabase
        .from('friend_groups')
        .select(`
          *,
          group_members:group_members(*)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // We need to join with friends to get the names
      const friendsMap = friends.reduce((map, friend) => {
        map[friend.id] = friend;
        return map;
      }, {} as Record<string, Friend>);
      
      return data.map(group => ({
        id: group.id,
        name: group.name,
        createdAt: new Date(group.created_at),
        members: group.group_members
          .map((member: any) => friendsMap[member.friend_id])
          .filter(Boolean) // Only include friends that exist
      }));
    },
    enabled: !!session && friends.length > 0
  });

  // Add group mutation
  const addGroupMutation = useMutation({
    mutationFn: async (newGroup: { name: string; memberIds: string[] }) => {
      if (!session?.user) {
        // Create a local group for non-authenticated users
        return {
          id: Date.now().toString(),
          name: newGroup.name,
          createdAt: new Date(),
          members: friends.filter(friend => newGroup.memberIds.includes(friend.id))
        };
      }

      // Insert the group
      const { data: groupData, error: groupError } = await supabase
        .from('friend_groups')
        .insert({
          user_id: session.user.id,
          name: newGroup.name
        })
        .select()
        .single();
      
      if (groupError) throw groupError;
      
      // Insert the group members
      const groupMembers = newGroup.memberIds.map(memberId => ({
        group_id: groupData.id,
        friend_id: memberId
      }));
      
      const { error: membersError } = await supabase
        .from('group_members')
        .insert(groupMembers);
      
      if (membersError) throw membersError;
      
      // Return the complete group with members
      return {
        id: groupData.id,
        name: groupData.name,
        createdAt: new Date(groupData.created_at),
        members: friends.filter(friend => newGroup.memberIds.includes(friend.id))
      };
    },
    onSuccess: (newGroup) => {
      queryClient.setQueryData(['groups'], (oldGroups: FriendGroup[] = []) => 
        [newGroup, ...oldGroups]
      );
      
      toast({
        title: "Group Created",
        description: `${newGroup.name} has been created with ${newGroup.members.length} friends`
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Create Group",
        description: error.message || "An error occurred while creating group",
        variant: "destructive"
      });
    }
  });

  // Fetch payments
  const { data: payments = [], isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      if (!session?.user) {
        return [] as SettlementPayment[];
      }

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data.map(payment => ({
        id: payment.id,
        fromFriendId: payment.from_friend_id,
        toFriendId: payment.to_friend_id,
        amount: Number(payment.amount),
        date: new Date(payment.date),
        status: payment.status,
        method: payment.method,
        receiptUrl: payment.receipt_url
      }));
    },
    enabled: !!session
  });

  // Add payment mutation
  const addPaymentMutation = useMutation({
    mutationFn: async (newPayment: { 
      fromFriendId: string; 
      toFriendId: string; 
      amount: number;
      method: string;
      status: string;
      receiptUrl?: string;
    }) => {
      if (!session?.user) {
        // Create a local payment for non-authenticated users
        return {
          id: Date.now().toString(),
          fromFriendId: newPayment.fromFriendId,
          toFriendId: newPayment.toFriendId,
          amount: newPayment.amount,
          date: new Date(),
          status: newPayment.status,
          method: newPayment.method,
          receiptUrl: newPayment.receiptUrl
        };
      }

      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: session.user.id,
          from_friend_id: newPayment.fromFriendId,
          to_friend_id: newPayment.toFriendId,
          amount: newPayment.amount,
          status: newPayment.status,
          method: newPayment.method,
          receipt_url: newPayment.receiptUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        fromFriendId: data.from_friend_id,
        toFriendId: data.to_friend_id,
        amount: Number(data.amount),
        date: new Date(data.date),
        status: data.status,
        method: data.method,
        receiptUrl: data.receipt_url
      };
    },
    onSuccess: (newPayment) => {
      queryClient.setQueryData(['payments'], (oldPayments: SettlementPayment[] = []) => 
        [newPayment, ...oldPayments]
      );
      
      // Also update any related reminders
      queryClient.setQueryData(['reminders'], (oldReminders: PaymentReminder[] = []) => 
        oldReminders.map(reminder => 
          reminder.fromFriendId === newPayment.fromFriendId && 
          reminder.toFriendId === newPayment.toFriendId && 
          !reminder.isPaid
            ? { ...reminder, isPaid: true }
            : reminder
        )
      );
    }
  });

  // Fetch reminders
  const { data: reminders = [], isLoading: isRemindersLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      if (!session?.user) {
        return [] as PaymentReminder[];
      }

      const { data, error } = await supabase
        .from('payment_reminders')
        .select('*')
        .eq('user_id', session.user.id)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      
      return data.map(reminder => ({
        id: reminder.id,
        fromFriendId: reminder.from_friend_id,
        toFriendId: reminder.to_friend_id,
        amount: Number(reminder.amount),
        dueDate: new Date(reminder.due_date),
        isRead: reminder.is_read,
        isPaid: reminder.is_paid
      }));
    },
    enabled: !!session
  });

  // Update reminder mutation
  const updateReminderMutation = useMutation({
    mutationFn: async ({ 
      reminderId, 
      updates 
    }: { 
      reminderId: string; 
      updates: { isRead?: boolean; isPaid?: boolean } 
    }) => {
      if (!session?.user) {
        return { id: reminderId, ...updates };
      }

      const updateData: any = {};
      if (updates.isRead !== undefined) updateData.is_read = updates.isRead;
      if (updates.isPaid !== undefined) updateData.is_paid = updates.isPaid;

      const { error } = await supabase
        .from('payment_reminders')
        .update(updateData)
        .eq('id', reminderId)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      return { id: reminderId, ...updates };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['reminders'], (oldReminders: PaymentReminder[] = []) => 
        oldReminders.map(reminder => 
          reminder.id === data.id
            ? { ...reminder, ...data }
            : reminder
        )
      );
    }
  });

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: async (newReminder: { 
      fromFriendId: string; 
      toFriendId: string; 
      amount: number;
      dueDate: Date;
    }) => {
      if (!session?.user) {
        return {
          id: Date.now().toString(),
          fromFriendId: newReminder.fromFriendId,
          toFriendId: newReminder.toFriendId,
          amount: newReminder.amount,
          dueDate: newReminder.dueDate,
          isRead: false,
          isPaid: false
        };
      }

      const { data, error } = await supabase
        .from('payment_reminders')
        .insert({
          user_id: session.user.id,
          from_friend_id: newReminder.fromFriendId,
          to_friend_id: newReminder.toFriendId,
          amount: newReminder.amount,
          due_date: newReminder.dueDate.toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        fromFriendId: data.from_friend_id,
        toFriendId: data.to_friend_id,
        amount: Number(data.amount),
        dueDate: new Date(data.due_date),
        isRead: data.is_read,
        isPaid: data.is_paid
      };
    },
    onSuccess: (newReminder) => {
      queryClient.setQueryData(['reminders'], (oldReminders: PaymentReminder[] = []) => 
        [...oldReminders, newReminder]
      );
    }
  });

  // Track if the data is loaded
  useEffect(() => {
    const isDataLoaded = !session || (
      !isFriendsLoading && 
      !isExpensesLoading && 
      !isGroupsLoading && 
      !isPaymentsLoading && 
      !isRemindersLoading
    );
    
    if (isDataLoaded) {
      setIsLoaded(true);
    }
  }, [
    session, 
    isFriendsLoading, 
    isExpensesLoading, 
    isGroupsLoading, 
    isPaymentsLoading, 
    isRemindersLoading
  ]);

  // Fetch payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "card", name: "Personal Card", lastFour: "4242", expiryDate: "04/25" }
  ]);

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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

  // Create reminders from balances
  useEffect(() => {
    if (!session?.user || expenses.length === 0 || reminders.length > 0) {
      return;
    }

    const balances = calculateBalances();
    const newReminders: PaymentReminder[] = [];
    
    Object.entries(balances).forEach(([fromId, friendBalances]) => {
      Object.entries(friendBalances).forEach(([toId, amount]) => {
        if (amount > 0) {
          // Set due date to 1 month from now
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + 1);
          
          newReminders.push({
            id: '', // Will be set by database
            fromFriendId: fromId,
            toFriendId: toId,
            amount: amount,
            dueDate,
            isRead: false,
            isPaid: false
          });
        }
      });
    });
    
    // Create the reminders in batch
    if (newReminders.length > 0) {
      newReminders.forEach(reminder => {
        createReminderMutation.mutate({
          fromFriendId: reminder.fromFriendId,
          toFriendId: reminder.toFriendId,
          amount: reminder.amount,
          dueDate: reminder.dueDate
        });
      });
    }
  }, [session, expenses, reminders.length, createReminderMutation]);

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
    handleAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => {
      addExpenseMutation.mutate({ description, amount, paidBy, splits, groupId: selectedGroupId });
    },
    handleAddFriend: (name: string) => {
      addFriendMutation.mutate(name);
    },
    handleRemoveFriend: (friendId: string) => {
      removeFriendMutation.mutate(friendId);
    },
    handleAddGroup: (group: FriendGroup) => {
      addGroupMutation.mutate({ 
        name: group.name, 
        memberIds: group.members.map(m => m.id) 
      });
    },
    handleSelectGroup: (groupId: string | null) => {
      setSelectedGroupId(groupId);
    },
    handleSettleDebt: (payment: SettlementPayment) => {
      addPaymentMutation.mutate({
        fromFriendId: payment.fromFriendId,
        toFriendId: payment.toFriendId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        receiptUrl: payment.receiptUrl
      });
    },
    handleMarkReminderAsRead: (reminderId: string) => {
      updateReminderMutation.mutate({ reminderId, updates: { isRead: true } });
    },
    handleSettleReminder: (reminder: PaymentReminder) => {
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
      
      addPaymentMutation.mutate({
        fromFriendId: payment.fromFriendId,
        toFriendId: payment.toFriendId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        receiptUrl: payment.receiptUrl
      });
      
      // Mark the reminder as paid
      updateReminderMutation.mutate({ reminderId: reminder.id, updates: { isPaid: true } });
      
      toast({
        title: "Payment Successful",
        description: `You paid ${friends.find(f => f.id === reminder.toFriendId)?.name} $${reminder.amount.toFixed(2)}`
      });
    }
  };
};
