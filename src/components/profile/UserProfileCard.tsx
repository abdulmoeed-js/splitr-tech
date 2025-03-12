
import { User, Camera } from "lucide-react";

// Define our own interface that matches what we need from the Clerk user
interface UserProfileCardProps {
  user: {
    profileImageUrl?: string | null;
    fullName?: string | null;
    primaryEmailAddress?: string | null;
    createdAt?: string | null;
  };
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  return (
    <div className="flex flex-col items-center pb-6 pt-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={user.fullName || ""} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <div className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full">
          <Camera className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mt-4">{user?.fullName || 'User'}</h2>
      <p className="text-gray-400 text-sm">{user?.primaryEmailAddress || 'No email'}</p>
      
      {/* Balance Display */}
      <div className="mt-6 w-full">
        <div className="text-center">
          <span className="text-3xl font-bold">$ 1,860</span>
          <div className="text-gray-400 text-sm mt-1 flex items-center justify-center">
            <span>USD</span>
            <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
