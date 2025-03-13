
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "../useSession";
import { toast } from "@/components/ui/use-toast";
import { PaymentMethod } from "@/types/payment";

export const useRemovePaymentMethod = (setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>) => {
  const { session } = useSession();

  const removePaymentMethod = async (id: string) => {
    if (!session?.user) return false;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      
      toast({
        title: "Payment Method Removed",
        description: "Your payment method has been removed",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error Removing Payment Method",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  return removePaymentMethod;
};
