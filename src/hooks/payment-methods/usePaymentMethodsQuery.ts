
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentMethod } from "@/types/payment";
import { useSession } from "../useSession";

export const usePaymentMethodsQuery = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();

  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!session?.user) {
        setPaymentMethods([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) throw error;

        // Transform data to match PaymentMethod type
        const transformedData = data.map((method): PaymentMethod => ({
          id: method.id,
          name: method.name,
          type: method.type as PaymentMethod['type'],
          lastFour: method.last_four || undefined,
          expiryDate: method.expiry_date || undefined,
          accountNumber: method.account_number || undefined,
          phoneNumber: method.phone_number || undefined,
          created: new Date(method.created_at),
          isDefault: method.is_default
        }));

        setPaymentMethods(transformedData);
      } catch (error: any) {
        console.error("Error fetching payment methods:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [session]);

  return {
    paymentMethods,
    setPaymentMethods,
    loading
  };
};
