
import { AuthWrapper } from "@/components/AuthWrapper";
import { FriendsManagement } from "@/components/friends/FriendsManagement";
import { useExpenses } from "@/hooks/useExpenses";

const Friends = () => {
  const {
    isLoaded,
    friends,
    handleAddFriend,
    handleRemoveFriend
  } = useExpenses();

  return (
    <AuthWrapper>
      <div className="container max-w-2xl py-8 px-4">
        {!isLoaded ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <FriendsManagement
            friends={friends}
            onAddFriend={handleAddFriend}
            onRemoveFriend={handleRemoveFriend}
          />
        )}
      </div>
    </AuthWrapper>
  );
};

export default Friends;
