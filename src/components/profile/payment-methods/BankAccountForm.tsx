
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePaymentForm } from "../PaymentFormContext";
import { Building } from "lucide-react";

export const BankAccountForm = () => {
  const { methodType } = usePaymentForm();
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  if (methodType !== "bank") return null;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="bankName" className="text-white">Bank Name</Label>
        <Select
          value={bankName}
          onValueChange={setBankName}
          required
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="HBL">Habib Bank Limited (HBL)</SelectItem>
            <SelectItem value="UBL">United Bank Limited (UBL)</SelectItem>
            <SelectItem value="MCB">MCB Bank Limited</SelectItem>
            <SelectItem value="ABL">Allied Bank Limited (ABL)</SelectItem>
            <SelectItem value="Meezan">Meezan Bank</SelectItem>
            <SelectItem value="BankAlfalah">Bank Alfalah</SelectItem>
            <SelectItem value="BankAlHabib">Bank Al Habib</SelectItem>
            <SelectItem value="Askari">Askari Bank</SelectItem>
            <SelectItem value="SCB">Standard Chartered Bank</SelectItem>
            <SelectItem value="Other">Other Bank</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="accountNumber" className="text-white">Account Number</Label>
        <div className="relative">
          <Input 
            id="accountNumber" 
            value={accountNumber} 
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="Account Number"
            className="pl-10 bg-gray-700 border-gray-600 text-white"
            required
          />
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </>
  );
};
