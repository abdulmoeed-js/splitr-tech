
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

  return {
    isSettlementOpen,
    setIsSettlementOpen,
    selectedReminder,
    setSelectedReminder,
    openSettlementDialog
  };
}
