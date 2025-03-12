
import { Friend, Expense, SettlementPayment } from "@/types/expense";

export const useBalanceCalculation = (
  friends: Friend[], 
  expenses: Expense[], 
  payments: SettlementPayment[]
) => {
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

  return { calculateBalances };
};
