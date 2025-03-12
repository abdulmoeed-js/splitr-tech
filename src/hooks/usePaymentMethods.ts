
import { useState } from "react";
import { PaymentMethod } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";

export const usePaymentMethods = () => {
  const { user } = useUser();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "card", name: "Personal Card", lastFour: "4242", expiryDate: "04/25" }
  ]);
  const [preferredPaymentMethodId, setPreferredPaymentMethodId] = useState<string | null>("1");

  const addPaymentMethod = (newMethod: PaymentMethod) => {
    setPaymentMethods(prev => [...prev, newMethod]);
    toast({
      title: "Payment Method Added",
      description: `${newMethod.name} has been added to your account.`
    });
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    
    // If the removed method was the preferred one, reset preferred method
    if (preferredPaymentMethodId === id) {
      setPreferredPaymentMethodId(null);
    }

    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed from your account."
    });
  };

  const setPreferredMethod = (id: string) => {
    setPreferredPaymentMethodId(id);
    
    toast({
      title: "Preferred Method Updated",
      description: "Your preferred payment method has been updated."
    });
  };

  return {
    paymentMethods,
    preferredPaymentMethodId,
    addPaymentMethod,
    removePaymentMethod,
    setPreferredMethod
  };
};
