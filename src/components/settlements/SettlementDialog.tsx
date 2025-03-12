
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Friend, SettlementPayment } from "@/types/expense";
import { PaymentMethod } from "@/types/payment";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, Wallet, ArrowRight } from "lucide-react";

interface SettlementDialogProps {
  fromFriend: Friend;
  toFriend: Friend;
  amount: number;
  paymentMethods: PaymentMethod[];
  onSettleDebt: (payment: SettlementPayment) => void;
}

export const SettlementDialog = ({
  fromFriend,
  toFriend,
  amount,
  paymentMethods,
  onSettleDebt
}: SettlementDialogProps) => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"in-app" | "external" | "card">("in-app");
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [settlementAmount, setSettlementAmount] = useState(amount.toFixed(2));

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
      paymentMethodId: paymentMethod === "card" ? selectedCardId : undefined,
      receiptUrl: `receipt-${Date.now()}.pdf` // Simulated receipt URL
    };
    
    onSettleDebt(payment);
    setOpen(false);
    
    toast({
      title: "Payment Successful",
      description: `You paid ${toFriend.name} $${settlementAmount}`
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
              <div className="font-semibold">${amount.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Pay</Label>
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
              onValueChange={(value) => setPaymentMethod(value as "in-app" | "external" | "card")}
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
                    <CreditCard className="h-4 w-4" />
                    <span>Bank Transfer</span>
                  </div>
                </SelectItem>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Saved Card</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {paymentMethod === "card" && (
            <div className="space-y-2">
              <Label htmlFor="card">Select Card</Label>
              <Select
                value={selectedCardId}
                onValueChange={setSelectedCardId}
                required={paymentMethod === "card"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} {method.lastFour && `(•••• ${method.lastFour})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button type="submit" className="w-full">
            Pay ${settlementAmount}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
