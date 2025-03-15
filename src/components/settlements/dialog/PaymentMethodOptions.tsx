
import { Dispatch, SetStateAction } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaymentMethod } from "@/types/payment";

interface PaymentMethodOptionsProps {
  paymentMethodType: string;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: string;
  setSelectedPaymentMethodId: Dispatch<SetStateAction<string>>;
}

export const PaymentMethodOptions = ({
  paymentMethodType,
  paymentMethods,
  selectedPaymentMethodId,
  setSelectedPaymentMethodId
}: PaymentMethodOptionsProps) => {
  // Filter payment methods by type
  const filteredPaymentMethods = paymentMethods.filter(method => method.type === paymentMethodType);
  
  if (filteredPaymentMethods.length === 0) {
    return null;
  }

  let title = "Select Payment Method";
  let placeholder = "Select payment method";
  
  switch (paymentMethodType) {
    case "card":
      title = "Select Card";
      placeholder = "Select a card";
      break;
    case "easypaisa":
      title = "Select EasyPaisa Account";
      placeholder = "Select EasyPaisa account";
      break;
    case "jazzcash":
      title = "Select JazzCash Account";
      placeholder = "Select JazzCash account";
      break;
    case "bank":
      title = "Select Bank Account";
      placeholder = "Select bank account";
      break;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={paymentMethodType}>{title}</Label>
      <Select
        value={selectedPaymentMethodId}
        onValueChange={setSelectedPaymentMethodId}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredPaymentMethods.map((method) => (
            <SelectItem key={method.id} value={method.id}>
              {method.name} {renderAdditionalInfo(method, paymentMethodType)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Helper function to render additional payment method info
function renderAdditionalInfo(method: PaymentMethod, type: string): JSX.Element | string {
  switch (type) {
    case "card":
      return method.lastFour ? `(•••• ${method.lastFour})` : "";
    case "easypaisa":
    case "jazzcash":
      return method.phoneNumber ? `(${method.phoneNumber})` : "";
    case "bank":
      return method.bankName ? `(${method.bankName})` : "";
    default:
      return "";
  }
}
