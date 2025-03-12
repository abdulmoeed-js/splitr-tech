
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentForm } from "../PaymentFormContext";

export const MobileWalletForm = () => {
  const { methodType } = usePaymentForm();
  const [phoneNumber, setPhoneNumber] = useState("");

  if (methodType !== "easypaisa" && methodType !== "jazzcash") return null;

  const formatPhoneNumber = (input: string) => {
    const digits = input.replace(/\D/g, '');
    
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const serviceColor = methodType === "easypaisa" ? "green-500" : "red-500";
  const serviceName = methodType === "easypaisa" ? "EasyPaisa" : "JazzCash";

  return (
    <div className="space-y-2">
      <Label htmlFor="phoneNumber" className="text-white">
        {serviceName} Phone Number
      </Label>
      <div className="relative">
        <Input 
          id="phoneNumber" 
          value={phoneNumber} 
          onChange={handleChange}
          placeholder="03XX-XXX-XXXX"
          maxLength={13}
          className="pl-20 bg-gray-700 border-gray-600 text-white"
          required
        />
        <div className={`absolute left-1 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-white text-xs bg-${serviceColor} font-medium`}>
          {serviceName}
        </div>
      </div>
      <p className="text-xs text-gray-400">
        Enter the mobile number linked to your {serviceName} account
      </p>
    </div>
  );
};
