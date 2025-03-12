
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SettlementPayment } from "@/types/expense";
import { Friend } from "@/types/expense";
import { format } from "date-fns";
import { Check, Download, FileText } from "lucide-react";

interface PaymentReceiptProps {
  payment: SettlementPayment;
  friends: Friend[];
}

export const PaymentReceipt = ({ payment, friends }: PaymentReceiptProps) => {
  const fromFriend = friends.find(f => f.id === payment.fromFriendId);
  const toFriend = friends.find(f => f.id === payment.toFriendId);
  
  if (!fromFriend || !toFriend) return null;

  const formatCurrency = (amount: number) => {
    return `Rs. ${parseFloat(amount.toFixed(2)).toLocaleString('en-PK')}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4 mr-1" /> Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 border border-dashed rounded-md">
          <div className="text-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full inline-flex mx-auto mb-2">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Payment Successful</h3>
            <p className="text-muted-foreground text-sm">
              {format(payment.date, "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">{fromFriend.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium">{toFriend.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium capitalize">{payment.method}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-green-600 capitalize">{payment.status}</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" /> Download Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
