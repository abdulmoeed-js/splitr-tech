
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { PaymentMethodsTab } from "@/components/profile/PaymentMethodsTab";
import { Search, Bell, ChevronLeft, Home, Wallet, User, PlusCircle } from "lucide-react";
import { AccountSettingsTab } from "@/components/profile/AccountSettingsTab";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;
  }

  // Create a compatible user object that matches our UserProfileCardProps interface
  const profileUser = {
    profileImageUrl: null, // Supabase doesn't provide profile images by default
    fullName: user?.email?.split('@')[0] || "User",
    primaryEmailAddress: user?.email,
    // Convert Date to string to match our interface
    createdAt: user?.created_at || new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black/70 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <ChevronLeft className="h-6 w-6 mr-2" />
            <div className="text-lg font-semibold">My Profile</div>
          </div>
          <div className="flex space-x-4">
            <Search className="h-6 w-6" />
            <Bell className="h-6 w-6" />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container max-w-md mx-auto px-4 pb-24 pt-20">
        <UserProfileCard user={profileUser} />
        
        <Tabs defaultValue="payment" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-900/80 p-1 backdrop-blur-sm border border-white/10">
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
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center text-gray-400">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <Wallet className="h-6 w-6" />
            <span className="text-xs mt-1">Wallet</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-8 shadow-lg border-4 border-black">
              <PlusCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex flex-col items-center text-white">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
