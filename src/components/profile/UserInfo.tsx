
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface UserInfoProps {
  name: string;
  email?: string | null;
  createdAt?: string;
  setName: (name: string) => void;
}

export const UserInfo = ({ name, email, createdAt, setName }: UserInfoProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableName, setEditableName] = useState(name);
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
      
      setName(editableName);
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

  return (
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        {isEditingName ? (
          <div className="flex w-full space-x-2">
            <Input 
              value={editableName} 
              onChange={(e) => setEditableName(e.target.value)} 
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
      
      <p className="text-sm text-primary/70">{email}</p>
      
      {createdAt && (
        <p className="text-xs text-primary/50 mt-1">
          Joined {new Date(createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
