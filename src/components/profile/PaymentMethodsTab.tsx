
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";
import { PaymentMethod } from "@/types/payment";

export const PaymentMethodsTab = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "card", name: "Personal Card", lastFour: "4242", expiryDate: "04/25" },
    { id: "2", type: "easypaisa", name: "EasyPaisa", phoneNumber: "03001234567" },
    { id: "3", type: "jazzcash", name: "JazzCash", phoneNumber: "03121234567" },
    { id: "4", type: "bank", name: "Bank Account", bankName: "HBL", accountNumber: "12345678901" }
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddPaymentMethod = (newMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Payment Methods</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="mr-2 h-4 w-4" /> Add Method
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <AddPaymentMethodForm 
              onAddPaymentMethod={handleAddPaymentMethod} 
              onClose={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <PaymentMethodsList 
        paymentMethods={paymentMethods} 
        onRemovePaymentMethod={handleRemovePaymentMethod} 
      />
    </>
  );
};
