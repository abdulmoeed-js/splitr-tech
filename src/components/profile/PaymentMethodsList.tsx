
import { CreditCard, Trash2, Smartphone, Building, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { PaymentMethod } from "@/types/payment";

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  preferredMethodId: string | null;
  onRemovePaymentMethod: (id: string) => void;
  onSetPreferredMethod: (id: string) => void;
}

export const PaymentMethodsList = ({ 
  paymentMethods, 
  preferredMethodId,
  onRemovePaymentMethod,
  onSetPreferredMethod
}: PaymentMethodsListProps) => {
  if (paymentMethods.length === 0) {
    return (
      <div className="p-6 text-center bg-gray-800 rounded-xl">
        <CreditCard className="mx-auto h-12 w-12 text-gray-500 mb-2" />
        <p className="text-gray-500">No payment methods added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        let icon;
        let details;
        let cardType;
        
        switch (method.type) {
          case "card":
            icon = <CreditCard className="h-5 w-5 text-white" />;
            details = method.lastFour && (
              <p className="text-sm text-gray-400">
                •••• {method.lastFour} {method.expiryDate && `• Expires ${method.expiryDate}`}
              </p>
            );
            cardType = "VISA";
            break;
          case "easypaisa":
          case "jazzcash":
            icon = <Smartphone className="h-5 w-5 text-white" />;
            details = method.phoneNumber && (
              <p className="text-sm text-gray-400">
                {method.phoneNumber.substring(0, 3)}••••{method.phoneNumber.substring(7)}
              </p>
            );
            break;
          case "bank":
            icon = <Building className="h-5 w-5 text-white" />;
            details = (
              <p className="text-sm text-gray-400">
                {method.bankName} • ••••{method.accountNumber?.substring(method.accountNumber.length - 4)}
              </p>
            );
            break;
          default:
            icon = <CreditCard className="h-5 w-5 text-white" />;
            details = null;
        }
        
        const isPreferred = method.id === preferredMethodId;
        
        return (
          <div key={method.id} className="p-4 bg-gray-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-700 rounded-xl">
                  {icon}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold">{method.name}</h3>
                    {isPreferred && (
                      <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
                        Preferred
                      </span>
                    )}
                  </div>
                  {details}
                </div>
              </div>
              
              {method.type === "card" && cardType && (
                <div className="text-right">
                  <span className="text-sm font-semibold">{cardType}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-3 pt-3 border-t border-gray-700">
              {!isPreferred && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onSetPreferredMethod(method.id)}
                  className="text-gray-400 hover:text-white text-xs"
                >
                  <Check className="h-3 w-3 mr-1" /> Set as preferred
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemovePaymentMethod(method.id)}
                className="text-red-500 hover:text-red-400 text-xs ml-auto"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Remove
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
