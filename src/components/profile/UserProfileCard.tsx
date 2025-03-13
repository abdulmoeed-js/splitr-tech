
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Phone, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

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
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.fullName || "");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [isAddingPhone, setIsAddingPhone] = useState(false);

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

  const handleUpdateName = async () => {
    if (!authUser) return;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: authUser.id, 
          full_name: name 
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) throw error;
      
      setIsEditingName(false);
      
      toast({
        title: "Name Updated",
        description: "Your profile name has been updated"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update name"
      });
    }
  };

  const handleAddPhoneNumber = async () => {
    if (!newPhoneNumber.trim() || !authUser) return;
    
    const updatedPhoneNumbers = [...phoneNumbers, newPhoneNumber.trim()];
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: authUser.id, 
          phone_numbers: updatedPhoneNumbers 
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) throw error;
      
      setPhoneNumbers(updatedPhoneNumbers);
      setNewPhoneNumber("");
      setIsAddingPhone(false);
      
      toast({
        title: "Phone Number Added",
        description: "Your phone number has been added to your profile"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add phone number"
      });
    }
  };

  const handleRemovePhoneNumber = async (index: number) => {
    if (!authUser) return;
    
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers.splice(index, 1);
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: authUser.id, 
          phone_numbers: updatedPhoneNumbers 
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) throw error;
      
      setPhoneNumbers(updatedPhoneNumbers);
      
      toast({
        title: "Phone Number Removed",
        description: "The phone number has been removed from your profile"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove phone number"
      });
    }
  };

  return (
    <div className="bg-accent/10 rounded-xl p-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user?.profileImageUrl || ""} alt="Profile" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {isEditingName ? (
              <div className="flex w-full space-x-2">
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="h-8" 
                  placeholder="Your name"
                />
                <Button size="sm" onClick={handleUpdateName}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{name || "User"}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setIsEditingName(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          <p className="text-sm text-primary/70">{user?.primaryEmailAddress}</p>
          
          {user?.createdAt && (
            <p className="text-xs text-primary/50 mt-1">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Phone numbers section */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Phone Numbers</h3>
          {!isAddingPhone && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 p-1" 
              onClick={() => setIsAddingPhone(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </div>
        
        {/* Phone numbers list */}
        {phoneNumbers.length > 0 ? (
          <div className="space-y-2">
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-accent/20 rounded-lg">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary/70" />
                  <span>{phone}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/80" 
                  onClick={() => handleRemovePhoneNumber(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-primary/50 italic">No phone numbers added</p>
        )}
        
        {/* Add phone number input */}
        {isAddingPhone && (
          <div className="flex space-x-2">
            <Input 
              value={newPhoneNumber} 
              onChange={(e) => setNewPhoneNumber(e.target.value)} 
              placeholder="Enter phone number" 
              className="h-9"
            />
            <Button size="sm" onClick={handleAddPhoneNumber}>Add</Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                setIsAddingPhone(false);
                setNewPhoneNumber("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
