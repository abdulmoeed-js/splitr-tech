
export interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "venmo";
  name: string;
  lastFour?: string;
  expiryDate?: string;
}
