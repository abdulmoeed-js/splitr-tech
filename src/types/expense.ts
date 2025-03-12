
export interface Friend {
  id: string;
  name: string;
}

export interface Split {
  friendId: string;
  amount: number;
  percentage?: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: Date;
  splits: Split[];
  groupId?: string;
}

export interface FriendGroup {
  id: string;
  name: string;
  members: Friend[];
  createdAt: Date;
}

export interface SettlementPayment {
  id: string;
  fromFriendId: string;
  toFriendId: string;
  amount: number;
  date: Date;
  status: "pending" | "completed";
  method: "in-app" | "external" | "card" | "easypaisa" | "jazzcash" | "bank";
  paymentMethodId?: string;
  receiptUrl?: string;
}

export interface PaymentReminder {
  id: string;
  fromFriendId: string;
  toFriendId: string;
  amount: number;
  dueDate: Date;
  isRead: boolean;
  isPaid: boolean;
}
