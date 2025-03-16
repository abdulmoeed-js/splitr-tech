
import { useState } from "react";
import { Friend, PaymentReminder, SettlementPayment } from "@/types/expense";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";
import { calculateBalances } from "@/components/balance/BalanceCalculator";
import { Expense } from "@/types/expense";

interface SettlementDialogWrapperProps {
  friends: Friend[];
  expenses: Expense[];
  payments: SettlementPayment[];
  selectedReminder: PaymentReminder | null;
  onSettleReminder: (reminder: PaymentReminder) => void;
  onSettleDebt: (payment: SettlementPayment) => void;
  isSettlementOpen: boolean;
  setIsSettlementOpen: (isOpen: boolean) => void;
  setSelectedReminder: (reminder: PaymentReminder | null) => void;
}

export function SettlementDialogWrapper({
  friends,
  expenses,
  payments,
  selectedReminder,
  onSettleReminder,
  onSettleDebt,
  isSettlementOpen,
  setIsSettlementOpen,
  setSelectedReminder
}: SettlementDialogWrapperProps) {
  // Get the current user as a friend entity
  const currentUserAsFriend = friends.find(f => f.name === "You") || null;
  
  // Handle settling up
  const handleSettleUp = (payment: SettlementPayment) => {
    if (selectedReminder) {
      onSettleReminder(selectedReminder);
    }
    onSettleDebt(payment);
    setIsSettlementOpen(false);
    setSelectedReminder(null);
  };

  // Calculate the amount to settle based on the selected reminder or friend
  const calculateSettlementAmount = (): number => {
    if (selectedReminder) {
      return selectedReminder.amount;
    }
    
    // If no specific reminder, get the amount from the balances
    const balances = calculateBalances(expenses, friends, payments);
    const friendId = selectedReminder?.toFriendId;
    
    if (friendId && balances[friendId]) {
      // Get the absolute value of negative balances (what user owes)
      return Math.abs(Math.min(0, balances[friendId]));
    }
    
    return 0;
  };

  if (!selectedReminder || !currentUserAsFriend) return null;

  const settlementAmount = calculateSettlementAmount();

  return (
    <SettlementDialog
      fromFriend={currentUserAsFriend}
      toFriend={selectedReminder?.toFriendId ? friends.find(f => f.id === selectedReminder.toFriendId) || {id: "unknown", name: "Unknown"} : {id: "unknown", name: "Unknown"}}
      amount={settlementAmount}
      paymentMethods={[]}
      onSettleDebt={handleSettleUp}
      isOpen={isSettlementOpen}
      onOpenChange={setIsSettlementOpen}
    />
  );
}
