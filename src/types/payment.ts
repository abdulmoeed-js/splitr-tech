
export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "venmo" | "bank" | "easypaisa" | "jazzcash";
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
