
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [methodType, setMethodType] = useState<string>("card");
  const [methodName, setMethodName] = useState("");
  
  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  
  // Mobile wallet details
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Bank details
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newMethod: PaymentMethod;
    
    switch (methodType) {
      case "card":
        newMethod = {
          id: Date.now().toString(),
          type: "card",
          name: methodName || "Card",
          lastFour: cardNumber.slice(-4),
          expiryDate: cardExpiry
        };
        break;
      case "easypaisa":
      case "jazzcash":
        newMethod = {
          id: Date.now().toString(),
          type: methodType as "easypaisa" | "jazzcash",
          name: methodName || (methodType === "easypaisa" ? "EasyPaisa" : "JazzCash"),
          phoneNumber
        };
        break;
      case "bank":
        newMethod = {
          id: Date.now().toString(),
          type: "bank",
          name: methodName || "Bank Account",
          bankName,
          accountNumber
        };
        break;
      default:
        return;
    }
    
    onAddPaymentMethod(newMethod);
    onClose();
    
    toast({
      title: "Payment Method Added",
      description: `${newMethod.name} has been added to your account.`
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="methodType">Payment Method Type</Label>
        <Select
          value={methodType}
          onValueChange={setMethodType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment method type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="easypaisa">EasyPaisa</SelectItem>
            <SelectItem value="jazzcash">JazzCash</SelectItem>
            <SelectItem value="bank">Bank Account</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="methodName">Name (optional)</Label>
        <Input 
          id="methodName" 
          value={methodName} 
          onChange={(e) => setMethodName(e.target.value)}
          placeholder={methodType === "card" ? "Personal Card" : 
                       methodType === "easypaisa" ? "My EasyPaisa" : 
                       methodType === "jazzcash" ? "My JazzCash" : "My Bank Account"}
        />
      </div>
      
      {methodType === "card" && (
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
      )}
      
      {(methodType === "easypaisa" || methodType === "jazzcash") && (
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
      )}
      
      {methodType === "bank" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Select
              value={bankName}
              onValueChange={setBankName}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
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
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input 
              id="accountNumber" 
              value={accountNumber} 
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Account Number"
              required
            />
          </div>
        </>
      )}
      
      <div className="pt-2">
        <Button type="submit" className="w-full rounded-full">
          Add Payment Method
        </Button>
      </div>
    </form>
  );
};
