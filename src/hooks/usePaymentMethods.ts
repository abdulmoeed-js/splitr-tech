
import { useState } from "react";
import { PaymentMethod } from "@/types/payment";

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "card", name: "Personal Card", lastFour: "4242", expiryDate: "04/25" }
  ]);

  return { paymentMethods };
};
