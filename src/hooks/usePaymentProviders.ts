
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";
import { toast } from "@/components/ui/use-toast";

export interface PaymentProvider {
  id: string;
  provider: string;
  isEnabled: boolean;
  settings?: Record<string, any> | null;
}

export const usePaymentProviders = () => {
  const [providers, setProviders] = useState<PaymentProvider[]>([
    { id: 'stripe', provider: 'stripe', isEnabled: false },
    { id: 'paypal', provider: 'paypal', isEnabled: false }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSession();

  useEffect(() => {
    const fetchProviders = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('payment_provider_settings')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          // Map database providers to our state format
          const dbProviders: PaymentProvider[] = data.map(item => ({
            id: item.id,
            provider: item.provider,
            isEnabled: item.is_enabled || false,
            settings: item.settings as Record<string, any> | null
          }));

          // Merge with our default providers to ensure we always have all providers
          const mergedProviders = providers.map(defaultProvider => {
            const dbProvider = dbProviders.find(p => p.provider === defaultProvider.provider);
            return dbProvider || defaultProvider;
          });

          setProviders(mergedProviders);
        } else {
          // If no providers in DB, initialize with defaults
          const initialProviders = [
            { provider: 'stripe', is_enabled: false, user_id: session.user.id, settings: null },
            { provider: 'paypal', is_enabled: false, user_id: session.user.id, settings: null }
          ];

          // Insert default providers
          const { error: insertError } = await supabase
            .from('payment_provider_settings')
            .insert(initialProviders);

          if (insertError) {
            console.error("Error initializing payment providers:", insertError);
            // Don't throw here, just log the error and continue
          }
        }
      } catch (error: any) {
        console.error('Error fetching payment providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment providers',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [session]);

  const toggleProviderEnabled = async (providerName: string, enabled: boolean) => {
    if (!session?.user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to change payment settings',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Update state optimistically
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.provider === providerName 
            ? { ...provider, isEnabled: enabled } 
            : provider
        )
      );

      // Check if provider exists in DB
      const { data, error } = await supabase
        .from('payment_provider_settings')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('provider', providerName);

      if (error) throw error;

      if (data && data.length > 0) {
        // Update existing provider
        const { error: updateError } = await supabase
          .from('payment_provider_settings')
          .update({ is_enabled: enabled })
          .eq('id', data[0].id);

        if (updateError) throw updateError;
      } else {
        // Insert new provider
        const { error: insertError } = await supabase
          .from('payment_provider_settings')
          .insert({
            user_id: session.user.id,
            provider: providerName,
            is_enabled: enabled,
            settings: null
          });

        if (insertError) throw insertError;
      }

      toast({
        title: 'Settings updated',
        description: `${providerName} payment provider ${enabled ? 'enabled' : 'disabled'}`
      });
    } catch (error: any) {
      console.error('Error updating payment provider:', error);
      
      // Revert state on error
      setProviders(prevProviders => 
        prevProviders.map(provider => 
          provider.provider === providerName 
            ? { ...provider, isEnabled: !enabled } 
            : provider
        )
      );
      
      toast({
        title: 'Error',
        description: 'Failed to update payment provider settings',
        variant: 'destructive'
      });
    }
  };

  return {
    providers,
    isLoading,
    toggleProviderEnabled
  };
};
