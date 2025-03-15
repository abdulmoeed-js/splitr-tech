
import { Dispatch, SetStateAction } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Building, Smartphone, CreditCard as StripeIcon } from "lucide-react";
import { PayPalIcon } from "@/components/ui/icons";

type PaymentMethodType = "in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank" | "stripe" | "paypal";

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethodType>>;
  setSelectedPaymentMethodId: Dispatch<SetStateAction<string>>;
}

export const PaymentMethodSelector = ({
  paymentMethod,
  setPaymentMethod,
  setSelectedPaymentMethodId
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="paymentMethod">Payment Method</Label>
      <Select
        value={paymentMethod}
        onValueChange={(value) => {
          setPaymentMethod(value as PaymentMethodType);
          setSelectedPaymentMethodId("");
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="in-app">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>In-App Balance</span>
            </div>
          </SelectItem>
          <SelectItem value="external">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Bank Transfer</span>
            </div>
          </SelectItem>
          <SelectItem value="card">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Credit/Debit Card</span>
            </div>
          </SelectItem>
          <SelectItem value="easypaisa">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>EasyPaisa</span>
            </div>
          </SelectItem>
          <SelectItem value="jazzcash">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>JazzCash</span>
            </div>
          </SelectItem>
          <SelectItem value="bank">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Bank Account</span>
            </div>
          </SelectItem>
          <SelectItem value="stripe">
            <div className="flex items-center gap-2">
              <StripeIcon className="h-4 w-4" />
              <span>Stripe</span>
            </div>
          </SelectItem>
          <SelectItem value="paypal">
            <div className="flex items-center gap-2">
              <PayPalIcon className="h-4 w-4" />
              <span>PayPal</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
