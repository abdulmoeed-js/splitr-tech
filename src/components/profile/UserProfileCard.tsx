
import { User as ClerkUser } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface UserProfileCardProps {
  user: ClerkUser;
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  return (
    <Card className="p-6 glass-panel">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={user.fullName || ""} className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-1">{user?.fullName}</h2>
          <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <p className="text-sm text-muted-foreground">
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
