
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentForm } from "../PaymentFormContext";
import { CreditCard } from "lucide-react";

export const CardPaymentForm = () => {
  const { methodType } = usePaymentForm();
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  if (methodType !== "card") return null;

  const formatCardNumber = (input: string) => {
    const digits = input.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="cardNumber" className="text-white">Card Number</Label>
        <div className="relative">
          <Input 
            id="cardNumber" 
            value={cardNumber} 
            onChange={handleCardNumberChange}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="pl-10 bg-gray-700 border-gray-600 text-white"
            required
          />
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="cardExpiry" className="text-white">Expiry Date</Label>
          <Input 
            id="cardExpiry" 
            value={cardExpiry} 
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
              setCardExpiry(formatted);
            }}
            placeholder="MM/YY"
            maxLength={5}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardCVC" className="text-white">CVC</Label>
          <Input 
            id="cardCVC" 
            value={cardCVC} 
            onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
            placeholder="123"
            maxLength={3}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
      </div>
    </>
  );
};
