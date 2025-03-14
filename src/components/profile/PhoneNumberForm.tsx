
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface PhoneNumberFormProps {
  onAdd: (phoneNumber: string) => void;
  onCancel: () => void;
}

export const PhoneNumberForm = ({ onAdd, onCancel }: PhoneNumberFormProps) => {
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const handleSubmit = () => {
    if (newPhoneNumber.trim()) {
      onAdd(newPhoneNumber.trim());
      setNewPhoneNumber("");
    }
  };

  return (
    <div className="flex space-x-2">
      <Input 
        value={newPhoneNumber} 
        onChange={(e) => setNewPhoneNumber(e.target.value)} 
        placeholder="Enter phone number" 
        className="h-9"
      />
      <Button size="sm" onClick={handleSubmit}>Add</Button>
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={() => {
          onCancel();
          setNewPhoneNumber("");
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
