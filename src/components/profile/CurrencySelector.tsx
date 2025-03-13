
import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { SupportedCurrency, currencySymbols } from "@/hooks/useCurrency";

interface CurrencySelectorProps {
  currentCurrency: SupportedCurrency;
  onCurrencyChange: (currency: SupportedCurrency) => Promise<boolean>;
}

export const CurrencySelector = ({
  currentCurrency,
  onCurrencyChange
}: CurrencySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const currencies: { value: SupportedCurrency; label: string; symbol: string }[] = [
    { value: "PKR", label: "Pakistani Rupee", symbol: currencySymbols.PKR },
    { value: "USD", label: "US Dollar", symbol: currencySymbols.USD },
    { value: "EUR", label: "Euro", symbol: currencySymbols.EUR }
  ];

  const handleCurrencyChange = async (currency: SupportedCurrency) => {
    if (currency === currentCurrency) {
      setOpen(false);
      return;
    }

    setIsChanging(true);
    const success = await onCurrencyChange(currency);
    setIsChanging(false);
    
    if (success) {
      toast({
        title: "Currency Updated",
        description: `Your currency has been updated to ${currencies.find(c => c.value === currency)?.label}`
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update currency. Please try again.",
        variant: "destructive"
      });
    }
    
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between bg-gray-800 hover:bg-gray-700 border-gray-700"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span>Account Currency</span>
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mr-1">{currentCurrency}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-gray-800 border-gray-700">
        <div className="p-2">
          {currencies.map((currency) => (
            <Button
              key={currency.value}
              variant="ghost"
              disabled={isChanging}
              className={`w-full justify-start my-1 ${
                currentCurrency === currency.value ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => handleCurrencyChange(currency.value)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="mr-2">{currency.symbol}</span>
                  <span>{currency.label}</span>
                </div>
                {currentCurrency === currency.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
