
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

export const PaymentMethodsTab = () => {
  const { 
    paymentMethods, 
    loading,
    preferredPaymentMethodId,
    addPaymentMethod, 
    removePaymentMethod, 
    setPreferredMethod 
  } = usePaymentMethods();
  
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false);

  useEffect(() => {
    // Fetch user's currency preference
    if (user) {
      const fetchCurrency = async () => {
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('currency')
            .eq('user_id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found", which is ok
          
          if (data) {
            setCurrency(data.currency);
          }
        } catch (error) {
          console.error("Error fetching currency:", error);
        }
      };
      
      fetchCurrency();
    }
  }, [user]);

  const handleChangeCurrency = async (value: string) => {
    if (!user) return;
    
    setIsCurrencyLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: user.id,
          currency: value
        }, { onConflict: 'user_id' });
      
      if (error) throw error;
      
      setCurrency(value);
      toast({
        title: "Currency updated",
        description: `Your account currency has been set to ${value}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating currency",
        description: error.message || "An error occurred while updating your currency",
      });
    } finally {
      setIsCurrencyLoading(false);
    }
  };
  
  return (
    <>
      <div className="space-y-6">
        {/* Currency selector */}
        <div className="bg-accent/10 rounded-lg p-4">
          <label className="block text-sm mb-2">Account Currency</label>
          <Select
            value={currency}
            onValueChange={handleChangeCurrency}
            disabled={isCurrencyLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">US Dollar (USD)</SelectItem>
              <SelectItem value="EUR">Euro (EUR)</SelectItem>
              <SelectItem value="PKR">Pakistani Rupee (PKR)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-primary/70 mt-2">
            This currency will be used throughout the app
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Payment Methods</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <AddPaymentMethodForm 
                onAddPaymentMethod={addPaymentMethod} 
                onClose={() => setDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="p-6 text-center bg-accent/10 rounded-xl">
            <p className="text-primary/70">Loading payment methods...</p>
          </div>
        ) : (
          <PaymentMethodsList 
            paymentMethods={paymentMethods} 
            preferredMethodId={preferredPaymentMethodId}
            onRemovePaymentMethod={removePaymentMethod}
            onSetPreferredMethod={setPreferredMethod}
          />
        )}
      </div>
    </>
  );
};
