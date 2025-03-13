
import { PaymentMethod } from "@/types/payment";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "../useSession";
import { toast } from "@/components/ui/use-toast";

export const useAddPaymentMethod = (setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>) => {
  const { session } = useSession();

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'created'>) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a payment method",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: session.user.id,
          name: method.name,
          type: method.type,
          is_default: method.isDefault,
          last_four: method.lastFour || null,
          expiry_date: method.expiryDate || null,
          account_number: method.accountNumber || null,
          phone_number: method.phoneNumber || null
        })
        .select()
        .single();

      if (error) throw error;

      const newMethod: PaymentMethod = {
        id: data.id,
        name: data.name,
        type: data.type as PaymentMethod['type'],
        isDefault: data.is_default,
        lastFour: data.last_four || undefined,
        expiryDate: data.expiry_date || undefined,
        accountNumber: data.account_number || undefined,
        phoneNumber: data.phone_number || undefined,
        created: new Date(data.created_at)
      };

      setPaymentMethods(prev => [...prev, newMethod]);
      
      toast({
        title: "Payment Method Added",
        description: `${method.name} has been added to your account`,
      });

      return newMethod;
    } catch (error: any) {
      toast({
        title: "Error Adding Payment Method",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return null;
    }
  };

  return addPaymentMethod;
};
