
import { useSession } from "@/hooks/useSession";
import { useFriends } from "@/hooks/useFriends";
import { FriendsManagement } from "@/components/friends/FriendsManagement";

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

  return (
    <div className="container mx-auto px-4 py-8">
      {isFriendsLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <FriendsManagement
          friends={friends}
          onAddFriend={handleAddFriend}
          onUpdateFriend={handleUpdateFriend}
          onInviteFriend={handleInviteFriend}
          onRemoveFriend={handleRemoveFriend}
        />
      )}
    </div>
  );
};

export default FriendsPage;
