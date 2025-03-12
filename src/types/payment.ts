
export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "venmo" | "bank";
  name: string;
  lastFour?: string;
  expiryDate?: string;
  bankName?: string;
  accountNumber?: string;
  country?: string;
}
