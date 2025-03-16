
import { useSession } from "@/hooks/useSession";
import { useFriends } from "@/hooks/useFriends";
import { useExpenses } from "@/hooks/useExpenses";
import { usePayments } from "@/hooks/usePayments";
import { FriendsManagement } from "@/components/friends/FriendsManagement";
import { useState } from "react";
import { SettlementDialog } from "@/components/settlements/SettlementDialog";
import { SettlementPayment } from "@/types/expense";
import { calculateBalances } from "@/components/balance/BalanceCalculator";

const FriendsPage = () => {
  const { session, userName } = useSession();
  const { 
    friends, 
    isFriendsLoading,
    handleAddFriend, 
    handleUpdateFriend, 
    handleInviteFriend, 
    handleRemoveFriend 
  } = useFriends(session, userName);
  const { expenses } = useExpenses();
  const { payments, settleDebt } = usePayments(session);

  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);

  // Calculate balances
  const balances = calculateBalances(expenses, friends, payments);

  const handleSettleUp = (friendId: string) => {
    // Don't allow settling up with yourself
    const selectedFriend = friends.find(f => f.id === friendId);
    if (selectedFriend?.name === "You") {
      return;
    }
    
    // Only allow settling up if the user owes money (negative balance)
    const friendBalance = balances[friendId];
    if (friendBalance >= 0) {
      return; // No debt to settle
    }
    
    setSelectedFriendId(friendId);
    setIsSettlementOpen(true);
  };

  const handleSettleDebt = (payment: SettlementPayment) => {
    settleDebt(payment);
    setIsSettlementOpen(false);
    setSelectedFriendId(null);
  };

  // Find the selected friend
  const selectedFriend = selectedFriendId ? friends.find(f => f.id === selectedFriendId) : null;
  
  // Get the current user as a friend entity
  const currentUserAsFriend = friends.find(f => f.name === "You") || null;

  // Calculate the settlement amount (what user owes to the selected friend)
  const settlementAmount = selectedFriendId ? Math.abs(Math.min(0, balances[selectedFriendId] || 0)) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {isFriendsLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <FriendsManagement
          friends={friends}
          expenses={expenses}
          payments={payments}
          onAddFriend={handleAddFriend}
          onUpdateFriend={handleUpdateFriend}
          onInviteFriend={handleInviteFriend}
          onRemoveFriend={handleRemoveFriend}
          onSettleUp={handleSettleUp}
        />
      )}

      {/* Settlement Dialog */}
      {selectedFriend && currentUserAsFriend && (
        <SettlementDialog
          fromFriend={currentUserAsFriend}
          toFriend={selectedFriend}
          amount={settlementAmount} // Pass the calculated amount
          paymentMethods={[]}
          onSettleDebt={handleSettleDebt}
          isOpen={isSettlementOpen}
          onOpenChange={setIsSettlementOpen}
        />
      )}
    </div>
  );
};

export default FriendsPage;
