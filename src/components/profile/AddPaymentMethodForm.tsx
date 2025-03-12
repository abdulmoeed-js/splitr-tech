
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethod } from "@/types/payment";
import { toast } from "@/components/ui/use-toast";

interface AddPaymentMethodFormProps {
  onAddPaymentMethod: (paymentMethod: PaymentMethod) => void;
  onClose: () => void;
}

export const AddPaymentMethodForm = ({ 
  onAddPaymentMethod, 
  onClose 
}: AddPaymentMethodFormProps) => {
  const [newCardName, setNewCardName] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCVC, setNewCardCVC] = useState("");

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would integrate with Stripe or another payment processor here
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      name: newCardName,
      lastFour: newCardNumber.slice(-4),
      expiryDate: newCardExpiry
    };
    
    onAddPaymentMethod(newCard);
    setNewCardName("");
    setNewCardNumber("");
    setNewCardExpiry("");
    setNewCardCVC("");
    onClose();
    
    toast({
      title: "Payment Method Added",
      description: `${newCardName} has been added to your account.`
    });
  };

  return (
    <form onSubmit={handleAddCard} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="cardName">Name on Card</Label>
        <Input 
          id="cardName" 
          value={newCardName} 
          onChange={(e) => setNewCardName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input 
          id="cardNumber" 
          value={newCardNumber} 
          onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="4242 4242 4242 4242"
          maxLength={16}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cardExpiry">Expiry Date</Label>
          <Input 
            id="cardExpiry" 
            value={newCardExpiry} 
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              let formatted = '';
              if (val.length > 0) {
                if (val.length <= 2) {
                  formatted = val;
                } else {
                  formatted = val.slice(0, 2) + '/' + val.slice(2, 4);
                }
              }
              setNewCardExpiry(formatted);
            }}
            placeholder="MM/YY"
            maxLength={5}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardCVC">CVC</Label>
          <Input 
            id="cardCVC" 
            value={newCardCVC} 
            onChange={(e) => setNewCardCVC(e.target.value.replace(/\D/g, ''))}
            placeholder="123"
            maxLength={3}
            required
          />
        </div>
      </div>
      <div className="pt-2">
        <Button type="submit" className="w-full rounded-full">
          Add Card
        </Button>
      </div>
    </form>
  );
};
