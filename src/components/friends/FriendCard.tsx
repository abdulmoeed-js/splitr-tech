
import { Friend } from "@/types/expense";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, Edit2, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface FriendCardProps {
  friend: Friend;
  onEdit: (friend: Friend) => void;
  onRemove: (friendId: string) => void;
}

export const FriendCard = ({ friend, onEdit, onRemove }: FriendCardProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const handleRemove = () => {
    if (selectedFriendId) {
      onRemove(selectedFriendId);
      setSelectedFriendId(null);
    }
  };

  return (
    <Card key={friend.id} className="p-4 glass-panel">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <span className="font-medium text-primary">
                {friend.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium">{friend.name}</span>
              {friend.isInvited && !friend.isComplete && (
                <Badge variant="outline" className="ml-2 text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                  Invited
                </Badge>
              )}
            </div>
          </div>
          
          {friend.email && (
            <div className="flex items-center text-sm text-muted-foreground ml-11">
              <Mail className="h-3 w-3 mr-2" />
              <span>{friend.email}</span>
            </div>
          )}
          
          {friend.phone && (
            <div className="flex items-center text-sm text-muted-foreground ml-11">
              <Phone className="h-3 w-3 mr-2" />
              <span>{friend.phone}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {friend.id !== "1" && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(friend)}
                className="text-muted-foreground hover:text-primary"
              >
                <Edit2 className="h-5 w-5" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedFriendId(friend.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <UserX className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {friend.name} from your friends list? 
                      This action cannot be undone if they have associated expenses.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedFriendId(null)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemove} className="bg-destructive">
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
