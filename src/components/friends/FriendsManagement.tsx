
import { Friend, Expense, SettlementPayment } from "@/types/expense";
import { FriendsList } from "@/components/friends/FriendsList";
import { FriendsHeader } from "./FriendsHeader";
import { QuickInvite } from "./QuickInvite";
import { calculateBalances, formatCurrency } from "@/components/balance/BalanceCalculator";

interface FriendsManagementProps {
  friends: Friend[];
  expenses: Expense[];
  payments?: SettlementPayment[];
  onAddFriend: (name: string, email?: string, phone?: string) => void;
  onUpdateFriend: (friend: Partial<Friend> & { id: string }) => void;
  onInviteFriend: (email?: string, phone?: string) => void;
  onRemoveFriend: (friendId: string) => void;
  onSettleUp?: (friendId: string) => void;
}

export const FriendsManagement = ({ 
  friends, 
  expenses,
  payments = [],
  onAddFriend, 
  onUpdateFriend,
  onInviteFriend,
  onRemoveFriend,
  onSettleUp
}: FriendsManagementProps) => {
  // Calculate balances
  const balances = calculateBalances(expenses, friends, payments);
  
  // Make sure the "You" friend isn't filtered out
  const displayFriends = friends;

  return (
    <div className="space-y-6">
      <FriendsHeader 
        onAddFriend={onAddFriend}
        onInviteFriend={onInviteFriend}
      />
      
      <QuickInvite onInviteFriend={onInviteFriend} />

      <FriendsList 
        friends={displayFriends}
        onRemoveFriend={onRemoveFriend}
        onUpdateFriend={onUpdateFriend}
        balances={balances}
        formatCurrency={formatCurrency}
        onSettleUp={onSettleUp}
      />
    </div>
  );
};
