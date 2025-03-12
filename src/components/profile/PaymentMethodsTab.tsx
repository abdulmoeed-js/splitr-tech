
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PaymentMethodsList } from "./PaymentMethodsList";
import { AddPaymentMethodForm } from "./AddPaymentMethodForm";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export const PaymentMethodsTab = () => {
  const { 
    paymentMethods, 
    loading,
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

      {loading ? (
        <div className="p-6 text-center bg-gray-800 rounded-xl">
          <p className="text-gray-500">Loading payment methods...</p>
        </div>
      ) : (
        <PaymentMethodsList 
          paymentMethods={paymentMethods} 
          preferredMethodId={preferredPaymentMethodId}
          onRemovePaymentMethod={removePaymentMethod}
          onSetPreferredMethod={setPreferredMethod}
        />
      )}
    </>
  );
};
