
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePaymentForm } from "../PaymentFormContext";

export const PaymentMethodNameInput = () => {
  const { methodType, methodName, setMethodName } = usePaymentForm();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="methodName" className="text-white">Payment Method Name</Label>
      <Input 
        id="methodName" 
        value={methodName} 
        onChange={(e) => setMethodName(e.target.value)}
        placeholder={methodType === "card" ? "Personal Card" : 
                    methodType === "easypaisa" ? "My EasyPaisa" : 
                    methodType === "jazzcash" ? "My JazzCash" : "My Bank Account"}
        className="bg-gray-700 border-gray-600 text-white"
      />
      <p className="text-xs text-gray-400">
        Give your payment method a name to easily identify it later
      </p>
    </div>
  );
};
