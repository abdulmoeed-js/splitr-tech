
import { Friend, Expense, SettlementPayment } from "@/types/expense";

export const useBalanceCalculation = () => {
  // Calculate balances based on expenses and payments
  const calculateBalances = (expenses: Expense[], friends: Friend[], payments: SettlementPayment[] = []) => {
    // Create a map to store balances for each friend
    const balances: Record<string, number> = {};
    
    // Initialize balances for all friends
    friends.forEach(friend => {
      balances[friend.id] = 0;
    });

    // Calculate expenses first
    expenses.forEach(expense => {
      const paidBy = expense.paidBy;
      
      // Skip expenses with invalid or missing paidBy
      if (!paidBy || !balances[paidBy]) {
        console.log(`Skipping expense with invalid payer: ${expense.id}, paidBy: ${paidBy}`);
        return;
      }
      
      // Add the full amount to the payer's balance
      balances[paidBy] += expense.amount;
      
      // Process each split
      expense.splits.forEach(split => {
        // Skip invalid split friendIds
        if (!split.friendId || !balances[split.friendId]) {
          console.log(`Skipping invalid split for expense: ${expense.id}, friendId: ${split.friendId}`);
          return;
        }
        
        // Subtract the split amount from each friend's balance
        balances[split.friendId] -= split.amount;
      });
    });
    
    // Apply payments
    payments.forEach(payment => {
      const { fromFriendId, toFriendId, amount } = payment;
      
      // Skip payments with invalid friend IDs
      if (!fromFriendId || !toFriendId || !balances[fromFriendId] || !balances[toFriendId]) {
        console.log(`Skipping payment with invalid friend IDs: ${payment.id}`);
        return;
      }
      
      // Adjust balances based on the payment
      balances[fromFriendId] -= amount;
      balances[toFriendId] += amount;
    });
    
    return balances;
  };

  // Filter expenses based on group
  const getFilteredExpenses = (expenses: Expense[], selectedGroupId: string | null) => {
    if (!selectedGroupId) return expenses;
    return expenses.filter(expense => expense.groupId === selectedGroupId);
  };

  return { calculateBalances, getFilteredExpenses };
};
