
import { useState, useEffect } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { UserInfo } from "./UserInfo";
import { PhoneNumbersSection } from "./PhoneNumbersSection";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileProps {
  user: {
    profileImageUrl?: string | null;
    fullName?: string | null;
    primaryEmailAddress?: string | null;
    createdAt?: string;
  };
}

export const UserProfileCard = ({ user }: UserProfileProps) => {
  const { user: authUser } = useAuth();
  const [name, setName] = useState(user?.fullName || "");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

  useEffect(() => {
    if (authUser) {
      fetchUserPreferences();
    }
  }, [authUser]);

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('full_name, phone_numbers')
        .eq('user_id', authUser?.id)
        .single();
      
      if (error) {
        console.error("Error fetching user preferences:", error);
        return;
      }
      
      if (data) {
        if (data.full_name) setName(data.full_name);
        if (data.phone_numbers) setPhoneNumbers(data.phone_numbers || []);
      }
    } catch (error) {
      console.error("Error in fetchUserPreferences:", error);
    }
  };

  return (
    <div className="bg-accent/10 rounded-xl p-6">
      <div className="flex items-center space-x-4">
        <ProfileAvatar 
          imageUrl={user?.profileImageUrl} 
          fallbackText={name || "U"} 
        />
        
        <UserInfo 
          name={name}
          email={user?.primaryEmailAddress}
          createdAt={user?.createdAt}
          setName={setName}
        />
      </div>
      
      <PhoneNumbersSection 
        phoneNumbers={phoneNumbers}
        setPhoneNumbers={setPhoneNumbers}
      />
    </div>
  );
};
