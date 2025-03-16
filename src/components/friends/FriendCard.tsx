
import { Friend } from "@/types/expense";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, Edit2, Mail, Phone, DollarSign, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
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
  balance?: number;
  formatCurrency?: (amount: number) => string;
  onSettleUp?: (friendId: string) => void;
}

export const FriendCard = ({ 
  friend, 
  onEdit, 
  onRemove, 
  balance = 0, 
  formatCurrency = (amount) => `Rs. ${amount.toFixed(2)}`,
  onSettleUp
}: FriendCardProps) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const handleRemove = () => {
    if (selectedFriendId) {
      onRemove(selectedFriendId);
      setSelectedFriendId(null);
    }
  };

  const handleSettleUp = () => {
    if (onSettleUp && friend.id) {
      onSettleUp(friend.id);
    }
  };

  // Determine if user can settle up with this friend
  // Only show settle up when there's a negative balance (user owes money)
  const canSettleUp = balance < 0 && friend.name !== "You";

  return (
    <Card key={friend.id} className="p-4 glass-panel">
      <div className="flex justify-between items-start">
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
          
          {/* Display balance information */}
          <div className="flex items-center ml-11 mt-2">
            {balance > 0 ? (
              <div className="flex items-center text-sm text-green-600">
                <ArrowDownToLine className="h-3 w-3 mr-2" />
                <span className="font-medium">{formatCurrency(balance)} owed to you</span>
              </div>
            ) : balance < 0 ? (
              <div className="flex items-center text-sm text-red-600">
                <ArrowUpFromLine className="h-3 w-3 mr-2" />
                <span className="font-medium">{formatCurrency(Math.abs(balance))} you owe</span>
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Settled up</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            {friend.name !== "You" && (
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
          
          {/* Only show Settle Up button when the user owes money (negative balance) */}
          {canSettleUp && onSettleUp && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSettleUp}
              className="text-primary border-primary/50 hover:bg-primary/10"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Settle Up
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
