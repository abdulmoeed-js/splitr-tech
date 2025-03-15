
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { toast } from "@/components/ui/use-toast";
import { PaymentProvider } from "@/types/payment";

export const usePaymentProviders = () => {
  const [providers, setProviders] = useState<PaymentProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();

  // Fetch payment providers
  useEffect(() => {
    const fetchProviders = async () => {
      if (!session?.user) {
        setProviders([
          { id: 'local-stripe', provider: 'stripe', isEnabled: false },
          { id: 'local-paypal', provider: 'paypal', isEnabled: false }
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('payment_provider_settings')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) throw error;

        // Transform data with proper type conversion
        const transformedData: PaymentProvider[] = data.map(item => ({
          id: item.id,
          provider: item.provider,
          isEnabled: item.is_enabled,
          settings: item.settings as Record<string, any> | null
        }));

        // Ensure we have default providers if none exist
        if (transformedData.length === 0) {
          // Create default records
          await createDefaultProviders(session.user.id);
          
          setProviders([
            { id: 'pending-stripe', provider: 'stripe', isEnabled: false },
            { id: 'pending-paypal', provider: 'paypal', isEnabled: false }
          ]);
        } else {
          setProviders(transformedData);
        }
      } catch (error: any) {
        console.error("Error fetching payment providers:", error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load payment providers"
        });
        
        // Set default local state for UI
        setProviders([
          { id: 'error-stripe', provider: 'stripe', isEnabled: false },
          { id: 'error-paypal', provider: 'paypal', isEnabled: false }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [session]);

  // Create default provider records
  const createDefaultProviders = async (userId: string) => {
    try {
      await supabase
        .from('payment_provider_settings')
        .insert([
          {
            user_id: userId,
            provider: 'stripe',
            is_enabled: false,
            settings: {}
          },
          {
            user_id: userId,
            provider: 'paypal',
            is_enabled: false,
            settings: {}
          }
        ]);
      
      // Refetch providers after creating defaults
      const { data } = await supabase
        .from('payment_provider_settings')
        .select('*')
        .eq('user_id', userId);
      
      if (data) {
        const transformedData: PaymentProvider[] = data.map(item => ({
          id: item.id,
          provider: item.provider,
          isEnabled: item.is_enabled,
          settings: item.settings as Record<string, any> | null
        }));
        setProviders(transformedData);
      }
    } catch (error: any) {
      console.error("Error creating default providers:", error.message);
    }
  };

  // Toggle provider enabled status
  const toggleProviderEnabled = async (providerName: string, enabled: boolean) => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to change provider settings"
      });
      return;
    }

    // Optimistically update the UI
    setProviders(prevProviders => 
      prevProviders.map(provider => 
        provider.provider === providerName 
          ? { ...provider, isEnabled: enabled } 
          : provider
      )
    );

    try {
      const provider = providers.find(p => p.provider === providerName);
      
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      const { error } = await supabase
        .from('payment_provider_settings')
        .update({ is_enabled: enabled })
        .eq('id', provider.id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} ${enabled ? 'Enabled' : 'Disabled'}`,
        description: `${providerName.charAt(0).toUpperCase() + providerName.slice(1)} payments are now ${enabled ? 'enabled' : 'disabled'}.`
      });
    } catch (error: any) {
      console.error(`Error toggling ${providerName}:`, error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update ${providerName} settings: ${error.message}`
      });
      
      // Revert the optimistic update
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.provider === providerName 
            ? { ...provider, isEnabled: !enabled } 
            : provider
        )
      );
    }
  };

  return {
    providers,
    isLoading,
    toggleProviderEnabled
  };
};
