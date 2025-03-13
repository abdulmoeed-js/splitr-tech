
import { useExpenses } from "@/hooks/useExpenses";
import { FriendsManagement } from "@/components/friends/FriendsManagement";

const FriendsPage = () => {
  const { 
    isLoaded, 
    friends, 
    handleAddFriend, 
    handleUpdateFriend, 
    handleInviteFriend, 
    handleRemoveFriend 
  } = useExpenses();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Friends Management</h1>
      {isLoaded ? (
        <FriendsManagement
          friends={friends}
          onAddFriend={handleAddFriend}
          onUpdateFriend={handleUpdateFriend}
          onInviteFriend={handleInviteFriend}
          onRemoveFriend={handleRemoveFriend}
        />
      ) : (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
