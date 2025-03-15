
import { useState } from "react";
import { Friend, SettlementPayment } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

type PaymentMethodType = "in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank" | "stripe" | "paypal";

export const useSettlementDialog = (
  fromFriend: Friend,
  toFriend: Friend,
  amount: number,
  onSettleDebt: (payment: SettlementPayment) => void,
  onOpenChange: (open: boolean) => void
) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("in-app");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");
  const [settlementAmount, setSettlementAmount] = useState(amount ? amount.toFixed(2) : "0.00");
  const [isProcessing, setIsProcessing] = useState(false);
  const { session } = useSession();

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          fromFriendId: fromFriend.id,
          toFriendId: toFriend.id,
          amount: settlementAmount,
          returnUrl: window.location.href
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error initiating Stripe checkout:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: `Failed to initiate payment: ${error.message}`
      });
      setIsProcessing(false);
    }
  };

  const handlePayPalCheckout = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          fromFriendId: fromFriend.id,
          toFriendId: toFriend.id,
          amount: settlementAmount,
          returnUrl: window.location.href
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Redirect to PayPal approval URL
      window.location.href = data.approvalUrl;
    } catch (error) {
      console.error('Error initiating PayPal checkout:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: `Failed to initiate payment: ${error.message}`
      });
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle different payment methods
    if (paymentMethod === 'stripe') {
      await handleStripeCheckout();
      return;
    }
    
    if (paymentMethod === 'paypal') {
      await handlePayPalCheckout();
      return;
    }
    
    // Regular in-app payment processing
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
    onOpenChange(false);
    
    toast({
      title: "Payment Successful",
      description: `You paid ${toFriend.name} Rs. ${settlementAmount}`
    });
  };

  // Function to check URL parameters for payment status
  const checkPaymentStatus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    const orderId = urlParams.get('token');
    
    if (success === 'true') {
      if (sessionId) {
        // Stripe payment was successful
        toast({
          title: "Stripe Payment Successful",
          description: "Your payment has been processed successfully."
        });
      } else if (orderId) {
        // PayPal payment was authorized, capture it
        capturePayPalPayment(orderId);
      }
    } else if (success === 'false' || urlParams.get('canceled') === 'true') {
      toast({
        variant: "destructive",
        title: "Payment Canceled",
        description: "You canceled the payment process."
      });
    }
    
    // Clean up the URL
    if (success || urlParams.get('canceled')) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  };

  // Function to capture PayPal payment
  const capturePayPalPayment = async (orderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('capture-paypal-payment', {
        body: {
          orderId,
          userId: session?.user?.id || 'anonymous'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "PayPal Payment Successful",
        description: "Your payment has been processed successfully."
      });
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: `Failed to complete payment: ${error.message}`
      });
    }
  };

  // Check payment status on component mount
  if (typeof window !== 'undefined') {
    checkPaymentStatus();
  }

  return {
    paymentMethod,
    setPaymentMethod,
    selectedPaymentMethodId,
    setSelectedPaymentMethodId,
    settlementAmount,
    setSettlementAmount,
    isProcessing,
    handleSubmit
  };
};
