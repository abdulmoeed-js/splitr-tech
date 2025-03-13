
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "../useSession";
import { toast } from "@/components/ui/use-toast";
import { PaymentMethod } from "@/types/payment";

export const useSetDefaultPaymentMethod = (setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>) => {
  const { session } = useSession();

  const setDefaultPaymentMethod = async (id: string) => {
    if (!session?.user) return false;

    try {
      // First, set all methods to non-default
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;

      // Then set the selected method as default
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Update local state
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: method.id === id
        }))
      );
      
      toast({
        title: "Default Payment Method Updated",
        description: "Your default payment method has been updated",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error Updating Default Payment Method",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  return setDefaultPaymentMethod;
};
