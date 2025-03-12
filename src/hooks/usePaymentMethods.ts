
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PaymentMethod } from "@/types/payment";
import { useSession } from "./useSession";
import { toast } from "@/components/ui/use-toast";

export const usePaymentMethods = () => {
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
          type: method.type,
          isDefault: method.is_default,
          lastFour: method.last_four || undefined,
          expiryDate: method.expiry_date || undefined,
          accountNumber: method.account_number || undefined,
          phoneNumber: method.phone_number || undefined,
          created: new Date(method.created_at)
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

  // Add a payment method
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
        type: data.type,
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

  // Remove a payment method
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

  // Set a payment method as default
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

  return {
    paymentMethods,
    loading,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod
  };
};
