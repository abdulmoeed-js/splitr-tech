
import { useState, Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Friend, SettlementPayment } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, Wallet, ArrowRight, Smartphone, Building } from "lucide-react";

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
  const [paymentMethod, setPaymentMethod] = useState<"in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank">("in-app");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");
  const [settlementAmount, setSettlementAmount] = useState(amount ? amount.toFixed(2) : "0.00");

  // Use external state if provided, otherwise use internal state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Filter payment methods by type
  const getPaymentMethodsByType = (type: string) => {
    return paymentMethods.filter(method => method.type === type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payment: SettlementPayment = {
      id: Date.now().toString(),
      fromFriendId: fromFriend.id,
      toFriendId: toFriend.id,
      amount: Number(settlementAmount),
      date: new Date(),
      status: "completed",
      method: paymentMethod,
      paymentMethodId: ["card", "easypaisa", "jazzcash", "bank"].includes(paymentMethod) ? selectedPaymentMethodId : undefined,
      receiptUrl: `receipt-${Date.now()}.pdf` // Simulated receipt URL
    };
    
    onSettleDebt(payment);
    setOpen(false);
    
    toast({
      title: "Payment Successful",
      description: `You paid ${toFriend.name} Rs. ${settlementAmount}`
    });
  };

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
          <div className="space-y-2">
            <Label>Payment Details</Label>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <span>{fromFriend.name}</span>
                <ArrowRight className="h-4 w-4 text-primary" />
                <span>{toFriend.name}</span>
              </div>
              <div className="font-semibold">Rs. {parseFloat(amount.toFixed(2)).toLocaleString('en-PK')}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Pay (PKR)</Label>
            <Input
              id="amount"
              type="number"
              value={settlementAmount}
              onChange={(e) => setSettlementAmount(e.target.value)}
              step="0.01"
              min="0.01"
              max={amount.toString()}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => {
                setPaymentMethod(value as any);
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
              </SelectContent>
            </Select>
          </div>
          
          {paymentMethod === "card" && getPaymentMethodsByType("card").length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="card">Select Card</Label>
              <Select
                value={selectedPaymentMethodId}
                onValueChange={setSelectedPaymentMethodId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {getPaymentMethodsByType("card").map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} {method.lastFour && `(•••• ${method.lastFour})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {paymentMethod === "easypaisa" && getPaymentMethodsByType("easypaisa").length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="easypaisa">Select EasyPaisa Account</Label>
              <Select
                value={selectedPaymentMethodId}
                onValueChange={setSelectedPaymentMethodId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select EasyPaisa account" />
                </SelectTrigger>
                <SelectContent>
                  {getPaymentMethodsByType("easypaisa").map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} {method.phoneNumber && `(${method.phoneNumber})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {paymentMethod === "jazzcash" && getPaymentMethodsByType("jazzcash").length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="jazzcash">Select JazzCash Account</Label>
              <Select
                value={selectedPaymentMethodId}
                onValueChange={setSelectedPaymentMethodId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select JazzCash account" />
                </SelectTrigger>
                <SelectContent>
                  {getPaymentMethodsByType("jazzcash").map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} {method.phoneNumber && `(${method.phoneNumber})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {paymentMethod === "bank" && getPaymentMethodsByType("bank").length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank Account</Label>
              <Select
                value={selectedPaymentMethodId}
                onValueChange={setSelectedPaymentMethodId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {getPaymentMethodsByType("bank").map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} ({method.bankName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button type="submit" className="w-full">
            Pay Rs. {parseFloat(settlementAmount).toLocaleString('en-PK')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
