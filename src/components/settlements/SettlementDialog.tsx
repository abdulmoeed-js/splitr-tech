
import { useState, Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Friend, SettlementPayment } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";
import { PaymentSummary } from "./dialog/PaymentSummary";
import { SettlementAmount } from "./dialog/SettlementAmount";
import { PaymentMethodSelector } from "./dialog/PaymentMethodSelector";
import { PaymentMethodOptions } from "./dialog/PaymentMethodOptions";
import { useSettlementDialog } from "./dialog/useSettlementDialog";
import { Loader2 } from "lucide-react";

interface SettlementDialogProps {
  fromFriend: Friend;
  toFriend: Friend;
  amount: number;
  paymentMethods: PaymentMethod[];
  onSettleDebt: (payment: SettlementPayment) => void;
  isOpen?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export const SettlementDialog = ({
  fromFriend,
  toFriend,
  amount,
  paymentMethods,
  onSettleDebt,
  isOpen,
  onOpenChange
}: SettlementDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const {
    paymentMethod,
    setPaymentMethod,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    settlementAmount,
    setSettlementAmount,
    isProcessing,
    handleSubmit
  } = useSettlementDialog(fromFriend, toFriend, amount, onSettleDebt, setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Settle Up</Button>
      </DialogTrigger>
      <DialogContent className="glass-panel max-w-md">
        <DialogHeader>
          <DialogTitle>Settle Up with {toFriend.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <PaymentSummary 
            fromFriend={fromFriend} 
            toFriend={toFriend} 
            amount={amount} 
          />
          
          <SettlementAmount 
            settlementAmount={settlementAmount} 
            setSettlementAmount={setSettlementAmount} 
            maxAmount={amount} 
          />
          
          <PaymentMethodSelector 
            paymentMethod={paymentMethod} 
            setPaymentMethod={setPaymentMethod} 
            setSelectedPaymentMethodId={setSelectedPaymentMethodId} 
          />
          
          {paymentMethod === "card" && (
            <PaymentMethodOptions
              paymentMethodType="card"
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              setSelectedPaymentMethodId={setSelectedPaymentMethodId}
            />
          )}
          
          {paymentMethod === "easypaisa" && (
            <PaymentMethodOptions
              paymentMethodType="easypaisa"
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              setSelectedPaymentMethodId={setSelectedPaymentMethodId}
            />
          )}
          
          {paymentMethod === "jazzcash" && (
            <PaymentMethodOptions
              paymentMethodType="jazzcash"
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              setSelectedPaymentMethodId={setSelectedPaymentMethodId}
            />
          )}
          
          {paymentMethod === "bank" && (
            <PaymentMethodOptions
              paymentMethodType="bank"
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={selectedPaymentMethodId}
              setSelectedPaymentMethodId={setSelectedPaymentMethodId}
            />
          )}
          
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay Rs. {parseFloat(settlementAmount).toLocaleString('en-PK')}
              </>
            )}
          </Button>
          
          {(paymentMethod === 'stripe' || paymentMethod === 'paypal') && (
            <p className="text-xs text-muted-foreground text-center">
              You will be redirected to a secure payment page.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
