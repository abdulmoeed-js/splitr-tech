
import { CreditCard, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { PaymentMethod } from "@/types/payment";

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  onRemovePaymentMethod: (id: string) => void;
}

export const PaymentMethodsList = ({ 
  paymentMethods, 
  onRemovePaymentMethod 
}: PaymentMethodsListProps) => {
  const handleRemoveCard = (id: string) => {
    onRemovePaymentMethod(id);
    
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed from your account."
    });
  };

  if (paymentMethods.length === 0) {
    return (
      <Card className="p-6 text-center glass-panel">
        <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No payment methods added yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <Card key={method.id} className="p-4 hover:shadow-md transition-shadow glass-panel">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-secondary rounded-xl">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{method.name}</h3>
                {method.lastFour && (
                  <p className="text-sm text-muted-foreground">
                    •••• {method.lastFour} {method.expiryDate && `• Expires ${method.expiryDate}`}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleRemoveCard(method.id)}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
