
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentForm } from "../PaymentFormContext";

export const PaymentMethodNameInput = () => {
  const { methodType, methodName, setMethodName } = usePaymentForm();
  
  return (
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
  );
};
