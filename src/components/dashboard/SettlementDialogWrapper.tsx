
import { useState } from "react";
import { Friend, PaymentReminder, SettlementPayment } from "@/types/expense";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";

interface SettlementDialogWrapperProps {
  friends: Friend[];
  selectedReminder: PaymentReminder | null;
  onSettleReminder: (reminder: PaymentReminder) => void;
  onSettleDebt: (payment: SettlementPayment) => void;
  isSettlementOpen: boolean;
  setIsSettlementOpen: (isOpen: boolean) => void;
  setSelectedReminder: (reminder: PaymentReminder | null) => void;
}

export function SettlementDialogWrapper({
  friends,
  selectedReminder,
  onSettleReminder,
  onSettleDebt,
  isSettlementOpen,
  setIsSettlementOpen,
  setSelectedReminder
}: SettlementDialogWrapperProps) {
  // Handle settling up
  const handleSettleUp = (payment: SettlementPayment) => {
    if (selectedReminder) {
      onSettleReminder(selectedReminder);
    }
    onSettleDebt(payment);
    setIsSettlementOpen(false);
    setSelectedReminder(null);
  };

  if (!selectedReminder) return null;

  return (
    <SettlementDialog
      fromFriend={{id: "1", name: "You"}}
      toFriend={selectedReminder?.toFriendId ? friends.find(f => f.id === selectedReminder.toFriendId) || {id: "unknown", name: "Unknown"} : {id: "unknown", name: "Unknown"}}
      amount={selectedReminder?.amount || 0}
      paymentMethods={[]}
      onSettleDebt={handleSettleUp}
      isOpen={isSettlementOpen}
      onOpenChange={setIsSettlementOpen}
    />
  );
}
