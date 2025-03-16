
import { Friend, Expense, SettlementPayment } from "@/types/expense";

export interface Debt {
  fromId: string;
  toId: string;
  amount: number;
}

export const calculateBalances = (
  expenses: Expense[],
  friends: Friend[],
  payments: SettlementPayment[] = []
): Record<string, number> => {
  const balances: Record<string, number> = {};
  friends.forEach((friend) => {
    balances[friend.id] = 0;
  });

  // Process expenses
  expenses.forEach((expense) => {
    // Add amount to payer's balance (positive means others owe them)
    balances[expense.paidBy] += expense.amount;
    
    // Subtract split amounts from each person's balance (negative means they owe the payer)
    expense.splits.forEach((split) => {
      balances[split.friendId] -= split.amount;
    });
  });
  
  // Process payments
  payments.forEach((payment) => {
    if (payment.status === "completed") {
      // From friend pays money (decreases debt)
      balances[payment.fromFriendId] -= payment.amount;
      
      // To friend receives money (decreases what was owed to them)
      balances[payment.toFriendId] += payment.amount;
    }
  });

  return balances;
};

export const calculateDebts = (balances: Record<string, number>): Debt[] => {
  const debts: Debt[] = [];
  
  // Create a copy of balances to work with
  const workingBalances = { ...balances };
  
  // Find people with negative balance (who owe money)
  const debtors = Object.entries(workingBalances)
    .filter(([_, balance]) => balance < 0)
    .sort(([_, a], [__, b]) => a - b); // Sort by amount, most negative first
  
  // Find people with positive balance (who are owed money)
  const creditors = Object.entries(workingBalances)
    .filter(([_, balance]) => balance > 0)
    .sort(([_, a], [__, b]) => b - a); // Sort by amount, most positive first
  
  // Match debtors with creditors
  while (debtors.length > 0 && creditors.length > 0) {
    const [debtorId, debtorBalance] = debtors[0];
    const [creditorId, creditorBalance] = creditors[0];
    
    // Calculate the amount to transfer
    const transferAmount = Math.min(Math.abs(debtorBalance), creditorBalance);
    
    if (transferAmount > 0) {
      // Add to debts
      debts.push({
        fromId: debtorId,
        toId: creditorId,
        amount: transferAmount
      });
      
      // Update balances
      workingBalances[debtorId] += transferAmount;
      workingBalances[creditorId] -= transferAmount;
      
      // Remove if balance is zero or update the arrays
      if (workingBalances[debtorId] >= -0.01) { // Account for floating point errors
        debtors.shift();
      } else {
        debtors[0] = [debtorId, workingBalances[debtorId]];
      }
      
      if (workingBalances[creditorId] <= 0.01) { // Account for floating point errors
        creditors.shift();
      } else {
        creditors[0] = [creditorId, workingBalances[creditorId]];
      }
    }
  }
  
  return debts;
};

export const formatCurrency = (amount: number): string => {
  return `Rs. ${parseFloat(amount.toFixed(2)).toLocaleString('en-PK')}`;
};
