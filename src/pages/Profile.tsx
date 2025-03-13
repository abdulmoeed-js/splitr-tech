
import { useState } from "react";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { PaymentMethodsTab } from "@/components/profile/PaymentMethodsTab";
import { Search, Bell, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Create a compatible user object that matches our UserProfileCardProps interface
  const profileUser = {
    profileImageUrl: null, // Supabase doesn't provide profile images by default
    fullName: user?.email?.split('@')[0] || "User",
    primaryEmailAddress: user?.email,
    // Convert Date to string to match our interface
    createdAt: user?.created_at || new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background">
        <ChevronLeft className="h-6 w-6 text-primary" />
        <div className="text-lg font-semibold">My Profile</div>
        <div className="flex space-x-4">
          <Search className="h-6 w-6 text-primary" />
          <Bell className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container max-w-md mx-auto px-4 pb-24">
        <UserProfileCard user={profileUser} />
        
        {/* Payment Methods section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
          <PaymentMethodsTab />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex items-center justify-around">
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full border border-primary/20"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full border border-primary/20"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 rounded-full border border-primary/20"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
