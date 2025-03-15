
import { useState } from "react";
import { PaymentReminder } from "@/types/expense";

export function useSettlementDialogState() {
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<PaymentReminder | null>(null);

  // Handle opening the settlement dialog
  const openSettlementDialog = (reminder: PaymentReminder) => {
    setSelectedReminder(reminder);
    setIsSettlementOpen(true);
  };

  // Handle closing the settlement dialog
  const closeSettlementDialog = () => {
    setIsSettlementOpen(false);
    // Use a slight delay to ensure smooth UI transition
    setTimeout(() => {
      setSelectedReminder(null);
    }, 200);
  };

  return {
    isSettlementOpen,
    setIsSettlementOpen,
    selectedReminder,
    setSelectedReminder,
    openSettlementDialog,
    closeSettlementDialog
  };
}
