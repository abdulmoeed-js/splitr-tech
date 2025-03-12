
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentForm } from "../PaymentFormContext";

export const CardPaymentForm = () => {
  const { methodType } = usePaymentForm();
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  if (methodType !== "card") return null;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input 
          id="cardNumber" 
          value={cardNumber} 
          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
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
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardCVC">CVC</Label>
          <Input 
            id="cardCVC" 
            value={cardCVC} 
            onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
            placeholder="123"
            maxLength={3}
            required
          />
        </div>
      </div>
    </>
  );
};
