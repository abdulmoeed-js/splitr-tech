
import { useState, useEffect } from "react";
import { PaymentMethodsList } from "@/components/profile/PaymentMethodsList";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AddPaymentMethodForm } from "@/components/profile/AddPaymentMethodForm";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const PaymentMethodsTab = () => {
  const { paymentMethods, loading, preferredPaymentMethodId, removePaymentMethod, setPreferredMethod } = usePaymentMethods();
  const { user } = useAuth();
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  
  useEffect(() => {
    const fetchCurrency = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('currency')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching currency:", error);
          return;
        }
        
        if (data?.currency) {
          setCurrency(data.currency);
        }
      } catch (error) {
        console.error("Error in fetchCurrency:", error);
      }
    };
    
    fetchCurrency();
  }, [user]);
  
  const handleCurrencyChange = async (value: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: user.id, 
          currency: value 
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) throw error;
      
      setCurrency(value);
      
      toast({
        title: "Currency Updated",
        description: `Your preferred currency is now ${value}`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update currency"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Currency Selector */}
      <div className="bg-accent/10 rounded-xl p-4">
        <h3 className="font-medium mb-3">Account Currency</h3>
        <p className="text-sm text-primary/70 mb-4">
          Select your preferred currency for all transactions
        </p>
        
        <RadioGroup 
          value={currency} 
          onValueChange={handleCurrencyChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="USD" id="usd" />
            <Label htmlFor="usd">US Dollar (USD)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="EUR" id="eur" />
            <Label htmlFor="eur">Euro (EUR)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PKR" id="pkr" />
            <Label htmlFor="pkr">Pakistani Rupee (PKR)</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Payment Methods List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">My Payment Methods</h3>
          <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <AddPaymentMethodForm onSuccess={() => setIsAddPaymentOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full"></div>
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
    </div>
  );
};
