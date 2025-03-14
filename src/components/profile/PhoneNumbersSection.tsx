
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PhoneNumberItem } from "./PhoneNumberItem";
import { PhoneNumberForm } from "./PhoneNumberForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface PhoneNumbersSectionProps {
  phoneNumbers: string[];
  setPhoneNumbers: (numbers: string[]) => void;
}

export const PhoneNumbersSection = ({ phoneNumbers, setPhoneNumbers }: PhoneNumbersSectionProps) => {
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const { user: authUser } = useAuth();

  const handleAddPhoneNumber = async (newPhoneNumber: string) => {
    console.log("Adding phone number:", newPhoneNumber);
    
    if (!newPhoneNumber.trim() || !authUser) {
      console.log("No phone number or no authenticated user");
      return;
    }
    
    const updatedPhoneNumbers = [...phoneNumbers, newPhoneNumber.trim()];
    
    try {
      console.log("Updating phone numbers in database");
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: authUser.id, 
          phone_numbers: updatedPhoneNumbers 
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) {
        console.error("Error adding phone number:", error);
        throw error;
      }
      
      console.log("Phone number added successfully");
      setPhoneNumbers(updatedPhoneNumbers);
      setIsAddingPhone(false);
      
      toast({
        title: "Phone Number Added",
        description: "Your phone number has been added to your profile"
      });
    } catch (error: any) {
      console.error("Error in handleAddPhoneNumber:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add phone number"
      });
    }
  };

  const handleRemovePhoneNumber = async (index: number) => {
    console.log("Removing phone number at index:", index);
    
    if (!authUser) {
      console.log("No authenticated user, cannot remove phone number");
      return;
    }
    
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers.splice(index, 1);
    
    try {
      console.log("Updating phone numbers in database");
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: authUser.id, 
          phone_numbers: updatedPhoneNumbers 
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) {
        console.error("Error removing phone number:", error);
        throw error;
      }
      
      console.log("Phone number removed successfully");
      setPhoneNumbers(updatedPhoneNumbers);
      
      toast({
        title: "Phone Number Removed",
        description: "The phone number has been removed from your profile"
      });
    } catch (error: any) {
      console.error("Error in handleRemovePhoneNumber:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove phone number"
      });
    }
  };

  return (
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
            <PhoneNumberItem 
              key={index} 
              phone={phone} 
              onRemove={() => handleRemovePhoneNumber(index)} 
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-primary/50 italic">No phone numbers added</p>
      )}
      
      {/* Add phone number input */}
      {isAddingPhone && (
        <PhoneNumberForm 
          onAdd={handleAddPhoneNumber}
          onCancel={() => setIsAddingPhone(false)}
        />
      )}
    </div>
  );
};
