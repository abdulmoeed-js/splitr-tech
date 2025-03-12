
import { useUser } from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileCard } from "@/components/profile/UserProfileCard";
import { PaymentMethodsTab } from "@/components/profile/PaymentMethodsTab";

const Profile = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 rounded-full p-1">
          <TabsTrigger value="profile" className="rounded-full">Profile</TabsTrigger>
          <TabsTrigger value="payment" className="rounded-full">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <UserProfileCard user={user} />
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <PaymentMethodsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
