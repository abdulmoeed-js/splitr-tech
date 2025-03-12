
import { useUser } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { PaymentMethodsTab } from "@/components/profile/PaymentMethodsTab";
import { Search, Bell, ChevronLeft } from "lucide-react";
import { AccountSettingsTab } from "@/components/profile/AccountSettingsTab";

const Profile = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;
  }

  // Create a compatible user object that matches our UserProfileCardProps interface
  const profileUser = {
    profileImageUrl: user?.profileImageUrl,
    fullName: user?.fullName,
    primaryEmailAddress: user?.primaryEmailAddress?.emailAddress,
    // Convert Date to string to match our interface
    createdAt: user?.createdAt ? user.createdAt.toISOString() : null
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <ChevronLeft className="h-6 w-6" />
        <div className="text-lg font-semibold">My Profile</div>
        <div className="flex space-x-4">
          <Search className="h-6 w-6" />
          <Bell className="h-6 w-6" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container max-w-md mx-auto px-4 pb-24">
        <UserProfileCard user={profileUser} />
        
        <Tabs defaultValue="payment" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-900 p-1">
            <TabsTrigger value="payment" className="rounded-full text-sm">Payment Methods</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-full text-sm">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="mt-6">
            <PaymentMethodsTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AccountSettingsTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full border border-gray-600"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full border border-gray-600"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full border border-gray-600"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
