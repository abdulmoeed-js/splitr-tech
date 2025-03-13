
import { useState } from "react";
import { User, Camera, Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Define our own interface that matches what we need from the Clerk user
interface UserProfileCardProps {
  user: {
    profileImageUrl?: string | null;
    fullName?: string | null;
    primaryEmailAddress?: string | null;
    createdAt?: string | null;
    phoneNumbers?: string[];
  };
}

export const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const { user: authUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(user?.phoneNumbers || []);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!authUser) return;
    
    setIsLoading(true);
    try {
      // Update user profile data in Supabase
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          { 
            user_id: authUser.id,
            full_name: fullName,
            phone_numbers: phoneNumbers
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });

      setEditing(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while updating your profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhoneNumber = () => {
    if (!newPhoneNumber) return;
    
    if (phoneNumbers.includes(newPhoneNumber)) {
      toast({
        variant: "destructive",
        title: "Duplicate",
        description: "This phone number is already added"
      });
      return;
    }

    setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
    setNewPhoneNumber('');
    setIsAddingPhone(false);
  };

  const handleRemovePhoneNumber = (index: number) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers.splice(index, 1);
    setPhoneNumbers(updatedPhoneNumbers);
  };

  return (
    <div className="flex flex-col items-center pb-6 pt-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-accent/80 flex items-center justify-center">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt={user.fullName || ""} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-primary" />
          )}
        </div>
        <div className="absolute bottom-0 right-0 bg-primary p-1 rounded-full">
          <Camera className="h-4 w-4 text-white" />
        </div>
      </div>
      
      {!editing ? (
        // Display mode
        <>
          <div className="flex items-center mt-4">
            <h2 className="text-2xl font-semibold">{user?.fullName || 'User'}</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2" 
              onClick={() => setEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-primary/80 text-sm">{user?.primaryEmailAddress || 'No email'}</p>
          
          {phoneNumbers.length > 0 && (
            <div className="mt-2 w-full max-w-xs">
              <p className="text-sm text-primary/80 mb-1">Phone Numbers:</p>
              {phoneNumbers.map((phone, index) => (
                <div key={index} className="text-sm mb-1">{phone}</div>
              ))}
            </div>
          )}
        </>
      ) : (
        // Edit mode
        <div className="mt-4 w-full max-w-xs">
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-sm mb-1">Email (cannot be changed)</label>
            <Input
              value={user?.primaryEmailAddress || ''}
              disabled
              className="bg-accent/10"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm">Phone Numbers</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingPhone(true)}
                className="h-6 px-2"
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            
            {phoneNumbers.length > 0 ? (
              <div className="space-y-2">
                {phoneNumbers.map((phone, index) => (
                  <div key={index} className="flex justify-between items-center py-1 px-2 bg-accent/10 rounded">
                    <span className="text-sm">{phone}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePhoneNumber(index)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-primary/60 italic">No phone numbers added</p>
            )}
            
            {isAddingPhone && (
              <div className="mt-2 space-y-2">
                <Input
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="text-sm"
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewPhoneNumber('');
                      setIsAddingPhone(false);
                    }}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddPhoneNumber}
                    className="text-xs"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditing(false);
                setFullName(user?.fullName || '');
                setPhoneNumbers(user?.phoneNumbers || []);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
      
      {/* Balance Display */}
      <div className="mt-6 w-full">
        <div className="text-center">
          <span className="text-3xl font-bold">$ 1,860</span>
          <div className="text-primary/80 text-sm mt-1 flex items-center justify-center">
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
