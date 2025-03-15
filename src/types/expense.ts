export interface SettlementPayment {
  id: string;
  fromFriendId: string;
  toFriendId: string;
  amount: number;
  date: Date;
  status: "pending" | "completed";
  method: "in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank" | "stripe" | "paypal";
  paymentMethodId?: string;
  receiptUrl?: string;
}
