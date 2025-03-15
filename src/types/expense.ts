
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

export interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isInvited?: boolean;
  isComplete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  date: Date;
  paidBy: string;
  splits: Split[];
  groupId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  category?: string;
  receipt?: string;
}

export interface FriendGroup {
  id: string;
  name: string;
  createdAt: Date;
  members: Friend[];
}

export interface PaymentReminder {
  id: string;
  fromFriendId: string;
  toFriendId: string;
  amount: number;
  dueDate: Date;
  createdAt: Date;
  isRead: boolean;
  isPaid: boolean;
  message?: string;
}
