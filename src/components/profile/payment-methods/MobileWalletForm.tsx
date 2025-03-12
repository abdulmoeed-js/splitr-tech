
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentForm } from "../PaymentFormContext";

export const MobileWalletForm = () => {
  const { methodType } = usePaymentForm();
  const [phoneNumber, setPhoneNumber] = useState("");

  if (methodType !== "easypaisa" && methodType !== "jazzcash") return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="phoneNumber">Phone Number</Label>
      <Input 
        id="phoneNumber" 
        value={phoneNumber} 
        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
        placeholder="03XX XXXXXXX"
        maxLength={11}
        required
      />
    </div>
  );
};
