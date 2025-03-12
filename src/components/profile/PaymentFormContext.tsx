
import { createContext, useContext, ReactNode } from 'react';
import { PaymentMethod } from '@/types/payment';

interface PaymentFormContextType {
  methodType: string;
  methodName: string;
  setMethodName: (name: string) => void;
  onAddPaymentMethod: (paymentMethod: PaymentMethod) => void;
  onClose: () => void;
}

const PaymentFormContext = createContext<PaymentFormContextType | undefined>(undefined);

export const usePaymentForm = () => {
  const context = useContext(PaymentFormContext);
  if (!context) {
    throw new Error('usePaymentForm must be used within a PaymentFormProvider');
  }
  return context;
};

interface PaymentFormProviderProps {
  children: ReactNode;
  methodType: string;
  methodName: string;
  setMethodName: (name: string) => void;
  onAddPaymentMethod: (paymentMethod: PaymentMethod) => void;
  onClose: () => void;
}

export const PaymentFormProvider = ({
  children,
  methodType,
  methodName,
  setMethodName,
  onAddPaymentMethod,
  onClose
}: PaymentFormProviderProps) => {
  return (
    <PaymentFormContext.Provider value={{
      methodType,
      methodName,
      setMethodName,
      onAddPaymentMethod,
      onClose
    }}>
      {children}
    </PaymentFormContext.Provider>
  );
};
