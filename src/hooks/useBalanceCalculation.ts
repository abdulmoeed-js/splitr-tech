
import { Friend, Expense, SettlementPayment } from "@/types/expense";

export const useBalanceCalculation = () => {
  const calculateBalances = (expenses: Expense[], friends: Friend[]) => {
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
          balances[debtor][payer] = (balances[debtor][payer] || 0) + split.amount;
          
          // Payer is owed by debtor (negative entry)
          balances[payer][debtor] = (balances[payer][debtor] || 0) - split.amount;
        }
      });
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

  const getFilteredExpenses = (expenses: Expense[], selectedGroupId: string | null) => {
    if (!selectedGroupId) return expenses;
    return expenses.filter(expense => expense.groupId === selectedGroupId);
  };

  return { calculateBalances, getFilteredExpenses };
};
