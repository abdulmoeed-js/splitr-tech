
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";
import { PaymentMethod } from "@/types/payment";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export const PaymentMethodsTab = () => {
  const { 
    paymentMethods, 
    preferredPaymentMethodId,
    addPaymentMethod, 
    removePaymentMethod, 
    setPreferredMethod 
  } = usePaymentMethods();
  
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Payment Methods</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full bg-gray-800 border-none">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 text-white border-gray-800">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
            </DialogHeader>
            <AddPaymentMethodForm 
              onAddPaymentMethod={addPaymentMethod} 
              onClose={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <PaymentMethodsList 
        paymentMethods={paymentMethods} 
        preferredMethodId={preferredPaymentMethodId}
        onRemovePaymentMethod={removePaymentMethod}
        onSetPreferredMethod={setPreferredMethod}
      />
    </>
  );
};
