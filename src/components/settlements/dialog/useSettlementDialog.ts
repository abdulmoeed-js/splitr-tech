
import { useState } from "react";
import { Friend, SettlementPayment } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";

type PaymentMethodType = "in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank";

export const useSettlementDialog = (
  fromFriend: Friend,
  toFriend: Friend,
  amount: number,
  onSettleDebt: (payment: SettlementPayment) => void,
  onOpenChange: (open: boolean) => void
) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("in-app");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");
  const [settlementAmount, setSettlementAmount] = useState(amount ? amount.toFixed(2) : "0.00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payment: SettlementPayment = {
      id: Date.now().toString(),
      fromFriendId: fromFriend.id,
      toFriendId: toFriend.id,
      amount: Number(settlementAmount),
      date: new Date(),
      status: "completed",
      method: paymentMethod,
      paymentMethodId: ["card", "easypaisa", "jazzcash", "bank"].includes(paymentMethod) ? selectedPaymentMethodId : undefined,
      receiptUrl: `receipt-${Date.now()}.pdf` // Simulated receipt URL
    };
    
    onSettleDebt(payment);
    onOpenChange(false);
    
    toast({
      title: "Payment Successful",
      description: `You paid ${toFriend.name} Rs. ${settlementAmount}`
    });
  };

  return {
    paymentMethod,
    setPaymentMethod,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    settlementAmount,
    setSettlementAmount,
    handleSubmit
  };
};
