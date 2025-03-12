
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building } from "lucide-react";

interface PaymentMethodTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const PaymentMethodTypeSelect = ({ value, onValueChange }: PaymentMethodTypeSelectProps) => {
  const methods = [
    { id: "card", name: "Credit/Debit Card", icon: <CreditCard className="h-5 w-5" /> },
    { id: "easypaisa", name: "EasyPaisa", icon: <Smartphone className="h-5 w-5" /> },
    { id: "jazzcash", name: "JazzCash", icon: <Smartphone className="h-5 w-5" /> },
    { id: "bank", name: "Bank Account", icon: <Building className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-white">Payment Method Type</Label>
      <div className="grid grid-cols-2 gap-2">
        {methods.map(method => (
          <button
            key={method.id}
            type="button"
            className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              value === method.id 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            onClick={() => onValueChange(method.id)}
          >
            <div className={`${value === method.id ? 'text-black' : 'text-gray-400'}`}>
              {method.icon}
            </div>
            <span className="text-sm">{method.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
