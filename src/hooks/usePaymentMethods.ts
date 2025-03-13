
import { usePaymentMethodsQuery } from "./payment-methods/usePaymentMethodsQuery";
import { useAddPaymentMethod } from "./payment-methods/useAddPaymentMethod";
import { useRemovePaymentMethod } from "./payment-methods/useRemovePaymentMethod";
import { useSetDefaultPaymentMethod } from "./payment-methods/useSetDefaultPaymentMethod";

export const usePaymentMethods = () => {
  const { paymentMethods, setPaymentMethods, loading } = usePaymentMethodsQuery();
  const addPaymentMethod = useAddPaymentMethod(setPaymentMethods);
  const removePaymentMethod = useRemovePaymentMethod(setPaymentMethods);
  const setPreferredMethod = useSetDefaultPaymentMethod(setPaymentMethods);

  // Get the preferred (default) payment method ID
  const preferredPaymentMethodId = paymentMethods.find(method => method.isDefault)?.id || null;

  return {
    paymentMethods,
    loading,
    preferredPaymentMethodId,
    addPaymentMethod,
    removePaymentMethod,
    setPreferredMethod
  };
};
