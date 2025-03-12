
export interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isInvited?: boolean;
  isComplete?: boolean;
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
  groupId?: string;
  splits: Split[];
}

export interface FriendGroup {
  id: string;
  name: string;
  members: Friend[];
}

export interface SettlementPayment {
  id: string;
  fromFriendId: string;
  toFriendId: string;
  amount: number;
  date: Date;
  status: 'pending' | 'completed';
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
