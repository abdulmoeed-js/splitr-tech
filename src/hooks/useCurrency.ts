
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./useSession";

export type SupportedCurrency = "PKR" | "USD" | "EUR";

export const currencySymbols: Record<SupportedCurrency, string> = {
  PKR: "Rs.",
  USD: "$",
  EUR: "€"
};

export interface CurrencyPreference {
  currency: SupportedCurrency;
}

// Define a type for the user preferences
interface UserPreference {
  id: string;
  user_id: string;
  currency: SupportedCurrency;
  created_at: string;
  updated_at: string;
}

export const useCurrency = () => {
  const { user } = useSession();
  const [currencyPreference, setCurrencyPreference] = useState<CurrencyPreference>({ currency: "PKR" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencyPreference = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Since we can't use strongly typed Supabase query for user_preferences yet,
        // we'll use a raw query approach
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching currency preference:", error);
          // Default to PKR if there's an error
          setIsLoading(false);
          return;
        }

        if (data && data.currency) {
          setCurrencyPreference({ currency: data.currency as SupportedCurrency });
        }
      } catch (error) {
        console.error("Error in currency preference fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencyPreference();
  }, [user]);

  const updateCurrencyPreference = async (currency: SupportedCurrency) => {
    if (!user) return false;

    try {
      // First check if a preference already exists
      const { data: existingPref, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        console.error("Error checking existing preferences:", fetchError);
        return false;
      }

      if (existingPref) {
        // Update existing preference
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({ currency, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new preference
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({ 
            user_id: user.id, 
            currency, 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }

      // Update local state
      setCurrencyPreference({ currency });
      return true;
    } catch (error) {
      console.error("Error updating currency preference:", error);
      return false;
    }
  };

  const formatAmount = (amount: number) => {
    const { currency } = currencyPreference;
    const symbol = currencySymbols[currency];
    
    return `${symbol} ${parseFloat(amount.toFixed(2)).toLocaleString(
      currency === 'PKR' ? 'en-PK' : 
      currency === 'USD' ? 'en-US' : 
      'de-DE'
    )}`;
  };

  return {
    currencyPreference,
    isLoading,
    updateCurrencyPreference,
    formatAmount
  };
};
