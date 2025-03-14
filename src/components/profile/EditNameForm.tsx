
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface EditNameFormProps {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export const EditNameForm = ({ initialName, onSave, onCancel }: EditNameFormProps) => {
  const [editableName, setEditableName] = useState(initialName);
  const { user: authUser } = useAuth();

  const handleUpdateName = async () => {
    if (!authUser) return;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: authUser.id, 
          full_name: editableName 
        }, { 
          onConflict: 'user_id' 
        });
      
      if (error) throw error;
      
      onSave(editableName);
      
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

  return (
    <div className="flex w-full space-x-2">
      <Input 
        value={editableName} 
        onChange={(e) => setEditableName(e.target.value)} 
        className="h-8" 
        placeholder="Your name"
      />
      <Button size="sm" onClick={handleUpdateName}>Save</Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
