
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/payment";
import { toast } from "@/components/ui/use-toast";
import { PaymentFormProvider } from "./PaymentFormContext";
import { PaymentMethodTypeSelect } from "./payment-methods/PaymentMethodTypeSelect";
import { PaymentMethodNameInput } from "./payment-methods/PaymentMethodNameInput";
import { CardPaymentForm } from "./payment-methods/CardPaymentForm";
import { MobileWalletForm } from "./payment-methods/MobileWalletForm";
import { BankAccountForm } from "./payment-methods/BankAccountForm";

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form elements
    const form = e.target as HTMLFormElement;
    
    let newMethod: PaymentMethod;
    
    switch (methodType) {
      case "card":
        const cardNumber = (form.querySelector('#cardNumber') as HTMLInputElement).value;
        const cardExpiry = (form.querySelector('#cardExpiry') as HTMLInputElement).value;
        
        newMethod = {
          id: Date.now().toString(),
          type: "card",
          name: methodName || "Credit/Debit Card",
          lastFour: cardNumber.slice(-4),
          expiryDate: cardExpiry
        };
        break;
        
      case "easypaisa":
      case "jazzcash":
        const phoneNumber = (form.querySelector('#phoneNumber') as HTMLInputElement).value;
        
        newMethod = {
          id: Date.now().toString(),
          type: methodType as "easypaisa" | "jazzcash",
          name: methodName || (methodType === "easypaisa" ? "EasyPaisa" : "JazzCash"),
          phoneNumber
        };
        break;
        
      case "bank":
        const bankNameSelect = form.querySelector('[id^="bankName"]') as HTMLSelectElement;
        const bankName = bankNameSelect ? bankNameSelect.value : '';
        const accountNumber = (form.querySelector('#accountNumber') as HTMLInputElement).value;
        
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
  };

  return (
    <PaymentFormProvider
      methodType={methodType}
      methodName={methodName}
      setMethodName={setMethodName}
      onAddPaymentMethod={onAddPaymentMethod}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <PaymentMethodTypeSelect value={methodType} onValueChange={setMethodType} />
        <PaymentMethodNameInput />
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <CardPaymentForm />
          <MobileWalletForm />
          <BankAccountForm />
        </div>
        
        <div className="pt-2">
          <Button type="submit" className="w-full rounded-full bg-yellow-500 hover:bg-yellow-600 text-black">
            Add Payment Method
          </Button>
        </div>
      </form>
    </PaymentFormProvider>
  );
};
