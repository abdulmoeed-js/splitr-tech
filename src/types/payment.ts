
export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "venmo" | "bank" | "easypaisa" | "jazzcash" | "stripe" | "paypal";
  name: string;
  lastFour?: string;
  expiryDate?: string;
  bankName?: string;
  accountNumber?: string;
  country?: string;
  phoneNumber?: string;
  created: Date;
  isDefault: boolean;
}

export interface PaymentProvider {
  id: string;
  provider: string;
  isEnabled: boolean;
  settings?: Record<string, any> | null;
}
