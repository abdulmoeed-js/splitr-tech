import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Divide, Percent, Mail, Phone } from "lucide-react";
import { Friend, Split } from "@/types/expense";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AddExpenseDialogProps {
  friends: Friend[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
  onAddFriend: (name: string, email?: string, phone?: string) => void;
  onInviteFriend: (email?: string, phone?: string) => void;
}

export const AddExpenseDialog = ({ 
  friends, 
  onAddExpense, 
  onAddFriend,
  onInviteFriend 
}: AddExpenseDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [open, setOpen] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [splitType, setSplitType] = useState("equal");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [percentageSplits, setPercentageSplits] = useState<Record<string, string>>({});
  
  // Friend adding states
  const [addFriendTab, setAddFriendTab] = useState<"quick" | "detailed" | "invite">("quick");
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [newFriendPhone, setNewFriendPhone] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");

  // Initialize splits when amount changes or when friends selection changes
  useEffect(() => {
    if (amount && splitType === "equal") {
      initializeSplits();
    }
  }, [amount, selectedFriends, splitType]);

  const initializeSplits = () => {
    const selected = selectedFriends.length > 0 ? selectedFriends : friends.map(f => f.id);
    const perPersonAmount = (Number(amount) / selected.length).toFixed(2);
    const perPersonPercentage = (100 / selected.length).toFixed(1);
    
    const newSplits: Record<string, string> = {};
    const newPercentages: Record<string, string> = {};
    
    selected.forEach(friendId => {
      newSplits[friendId] = perPersonAmount;
      newPercentages[friendId] = perPersonPercentage;
    });
    
    setCustomSplits(newSplits);
    setPercentageSplits(newPercentages);
  };

  const handleSplitTypeChange = (value: string) => {
    setSplitType(value);
    if (value === "equal" && amount) {
      initializeSplits();
    }
  };

  const handleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => {
      const isSelected = prev.includes(friendId);
      const newSelection = isSelected 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId];
        
      // Update splits after selection changes
      setTimeout(() => {
        if (amount && newSelection.length > 0) {
          const perPersonAmount = (Number(amount) / newSelection.length).toFixed(2);
          const perPersonPercentage = (100 / newSelection.length).toFixed(1);
          
          const newSplits: Record<string, string> = {};
          const newPercentages: Record<string, string> = {};
          
          newSelection.forEach(id => {
            newSplits[id] = perPersonAmount;
            newPercentages[id] = perPersonPercentage;
          });
          
          setCustomSplits(newSplits);
          setPercentageSplits(newPercentages);
        }
      }, 0);
      
      return newSelection;
    });
  };

  const handleCustomSplitChange = (friendId: string, value: string) => {
    setCustomSplits(prev => ({
      ...prev,
      [friendId]: value
    }));
  };

  const handlePercentageSplitChange = (friendId: string, value: string) => {
    // Ensure percentage is between 0 and 100
    const percentage = Math.min(100, Math.max(0, Number(value) || 0));
    
    setPercentageSplits(prev => ({
      ...prev,
      [friendId]: percentage.toString()
    }));
    
    // Update the amount based on the percentage
    if (amount) {
      const newAmount = (Number(amount) * percentage / 100).toFixed(2);
      setCustomSplits(prev => ({
        ...prev,
        [friendId]: newAmount
      }));
    }
  };

  const calculateSplitTotal = () => {
    return Object.values(customSplits).reduce((sum, val) => sum + Number(val), 0);
  };

  const calculatePercentageTotal = () => {
    return Object.values(percentageSplits).reduce((sum, val) => sum + Number(val), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paidBy) {
      return; // Ensure payer is selected
    }
    
    let splits: Split[] = [];
    const friendsToSplit = selectedFriends.length > 0 ? selectedFriends : friends.map(f => f.id);
    
    if (splitType === "equal") {
      const perPersonAmount = Number(amount) / friendsToSplit.length;
      
      splits = friendsToSplit.map(friendId => ({
        friendId,
        amount: perPersonAmount,
      }));
    } else if (splitType === "custom") {
      splits = Object.entries(customSplits)
        .filter(([_, splitAmount]) => Number(splitAmount) > 0)
        .map(([friendId, splitAmount]) => ({
          friendId,
          amount: Number(splitAmount),
        }));
    } else if (splitType === "percentage") {
      splits = Object.entries(percentageSplits)
        .filter(([_, percentage]) => Number(percentage) > 0)
        .map(([friendId, percentage]) => ({
          friendId,
          amount: Number(amount) * Number(percentage) / 100,
          percentage: Number(percentage),
        }));
    }
    
    onAddExpense(description, Number(amount), paidBy, splits);
    setDescription("");
    setAmount("");
    setPaidBy("");
    setSplitType("equal");
    setSelectedFriends([]);
    setCustomSplits({});
    setPercentageSplits({});
    setOpen(false);
  };

  const handleQuickAddFriend = () => {
    if (newFriendName.trim()) {
      onAddFriend(newFriendName.trim(), undefined, undefined);
      setNewFriendName("");
      setShowAddFriend(false);
    }
  };

  const handleDetailedAddFriend = () => {
    if (newFriendName.trim()) {
      onAddFriend(newFriendName.trim(), newFriendEmail, newFriendPhone);
      setNewFriendName("");
      setNewFriendEmail("");
      setNewFriendPhone("");
      setShowAddFriend(false);
    }
  };

  const handleInviteFriend = () => {
    if (inviteEmail || invitePhone) {
      onInviteFriend(inviteEmail, invitePhone);
      setInviteEmail("");
      setInvitePhone("");
      setShowAddFriend(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full shadow-lg">
          <Plus className="mr-2" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>Enter the expense details and select who paid.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, Movies, etc."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                // Calculations will be triggered by the useEffect
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="paidBy">Paid By</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAddFriend(!showAddFriend)}
                className="text-xs flex items-center"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Friend
              </Button>
            </div>
            
            {showAddFriend ? (
              <div className="bg-background/30 border rounded-md p-3 space-y-3">
                <Tabs defaultValue="quick" onValueChange={(value) => setAddFriendTab(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="quick">Quick Add</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed</TabsTrigger>
                    <TabsTrigger value="invite">Invite</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="quick" className="space-y-2 mt-2">
                    <Input
                      value={newFriendName}
                      onChange={(e) => setNewFriendName(e.target.value)}
                      placeholder="Friend's name"
                    />
                    <Button 
                      type="button" 
                      onClick={handleQuickAddFriend}
                      size="sm"
                      className="w-full"
                      disabled={!newFriendName.trim()}
                    >
                      Add Friend
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="detailed" className="space-y-2 mt-2">
                    <Input
                      value={newFriendName}
                      onChange={(e) => setNewFriendName(e.target.value)}
                      placeholder="Friend's name"
                      className="mb-2"
                    />
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={newFriendEmail}
                        onChange={(e) => setNewFriendEmail(e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={newFriendPhone}
                        onChange={(e) => setNewFriendPhone(e.target.value)}
                        placeholder="Phone"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleDetailedAddFriend}
                      size="sm"
                      className="w-full"
                      disabled={!newFriendName.trim()}
                    >
                      Add Friend
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="invite" className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={invitePhone}
                        onChange={(e) => setInvitePhone(e.target.value)}
                        placeholder="Phone"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleInviteFriend}
                      size="sm"
                      className="w-full"
                      disabled={!inviteEmail && !invitePhone}
                    >
                      Invite Friend
                    </Button>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddFriend(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Select value={paidBy} onValueChange={setPaidBy} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      {friend.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3">
            <Label>Split Type</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={splitType === "equal" ? "default" : "outline"}
                onClick={() => handleSplitTypeChange("equal")}
                className="flex-1"
              >
                Equal
              </Button>
              <Button
                type="button"
                variant={splitType === "percentage" ? "default" : "outline"}
                onClick={() => handleSplitTypeChange("percentage")}
                className="flex-1"
              >
                <Percent className="mr-1 h-4 w-4" /> Percent
              </Button>
              <Button
                type="button"
                variant={splitType === "custom" ? "default" : "outline"}
                onClick={() => handleSplitTypeChange("custom")}
                className="flex-1"
              >
                Custom
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Split Among</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`friend-${friend.id}`}
                      checked={selectedFriends.length === 0 || selectedFriends.includes(friend.id)}
                      onCheckedChange={() => handleFriendSelection(friend.id)}
                    />
                    <Label htmlFor={`friend-${friend.id}`} className="cursor-pointer flex items-center">
                      {friend.name}
                      {friend.isInvited && !friend.isComplete && (
                        <span className="ml-2 text-xs text-yellow-500">
                          (Invited)
                        </span>
                      )}
                    </Label>
                  </div>

                  {splitType === "custom" && (selectedFriends.length === 0 || selectedFriends.includes(friend.id)) && (
                    <Input
                      value={customSplits[friend.id] || ""}
                      onChange={(e) => handleCustomSplitChange(friend.id, e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-24"
                    />
                  )}

                  {splitType === "percentage" && (selectedFriends.length === 0 || selectedFriends.includes(friend.id)) && (
                    <div className="flex items-center w-24">
                      <Input
                        value={percentageSplits[friend.id] || ""}
                        onChange={(e) => handlePercentageSplitChange(friend.id, e.target.value)}
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        className="w-16"
                      />
                      <span className="ml-1">%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {splitType === "custom" && (
              <div className="flex justify-between items-center text-sm">
                <span>Total: ${calculateSplitTotal().toFixed(2)}</span>
                <span className={Number(amount) !== calculateSplitTotal() ? "text-red-500" : "text-green-500"}>
                  {Number(amount) !== calculateSplitTotal() 
                    ? `Difference: $${(Number(amount) - calculateSplitTotal()).toFixed(2)}` 
                    : "Splits match total ✓"}
                </span>
              </div>
            )}

            {splitType === "percentage" && (
              <div className="flex justify-between items-center text-sm">
                <span>Total: {calculatePercentageTotal().toFixed(1)}%</span>
                <span className={Math.abs(100 - calculatePercentageTotal()) > 0.1 ? "text-red-500" : "text-green-500"}>
                  {Math.abs(100 - calculatePercentageTotal()) > 0.1
                    ? `Difference: ${(100 - calculatePercentageTotal()).toFixed(1)}%` 
                    : "Percentages match 100% ✓"}
                </span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
