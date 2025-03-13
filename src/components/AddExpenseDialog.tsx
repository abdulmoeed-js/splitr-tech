
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, UserPlus, Mail, Phone, Check, Users, Divide } from "lucide-react";
import { Friend, Split } from "@/types/expense";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrency } from "@/hooks/useCurrency";

interface AddExpenseDialogProps {
  friends: Friend[];
  onAddExpense: (description: string, amount: number, paidBy: string, splits: Split[]) => void;
  onAddFriend: (name: string, email?: string, phone?: string) => void;
  onInviteFriend: (email?: string, phone?: string) => void;
}

export function AddExpenseDialog({ 
  friends, 
  onAddExpense, 
  onAddFriend,
  onInviteFriend
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(friends[0]?.id || "");
  const [splits, setSplits] = useState<Split[]>([]);
  const [newFriendName, setNewFriendName] = useState("");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [newFriendPhone, setNewFriendPhone] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [activeTab, setActiveTab] = useState("expense");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const { toast } = useToast();
  const { formatAmount } = useCurrency();

  useEffect(() => {
    // When selected friends change, update splits accordingly
    if (splitType === "equal" && selectedFriends.length > 0) {
      const splitAmount = parseFloat(amount) / selectedFriends.length;
      if (!isNaN(splitAmount)) {
        const newSplits = selectedFriends.map(friendId => ({
          friendId,
          amount: splitAmount
        }));
        setSplits(newSplits);
      }
    }
  }, [selectedFriends, amount, splitType]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy(friends[0]?.id || "");
    setSplits([]);
    setNewFriendName("");
    setNewFriendEmail("");
    setNewFriendPhone("");
    setInviteEmail("");
    setInvitePhone("");
    setSelectedFriends([]);
    setSplitType("equal");
    setActiveTab("expense");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount.trim()) {
      toast({
        title: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (!paidBy) {
      toast({
        title: "Please select who paid the expense.",
        variant: "destructive",
      });
      return;
    }

    if (splits.length === 0) {
      toast({
        title: "Please add at least one split.",
        variant: "destructive",
      });
      return;
    }

    onAddExpense(description, amountValue, paidBy, splits);
    setOpen(false);
    resetForm();
    
    toast({
      title: "Expense Added",
      description: "Your expense has been successfully added.",
    });
  };

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFriendName.trim()) {
      onAddFriend(newFriendName, newFriendEmail, newFriendPhone);
      setNewFriendName("");
      setNewFriendEmail("");
      setNewFriendPhone("");
      setActiveTab("expense");
    }
  };

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail || invitePhone) {
      onInviteFriend(inviteEmail, invitePhone);
      setInviteEmail("");
      setInvitePhone("");
      setActiveTab("expense");
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const calculateEqualSplits = () => {
    if (selectedFriends.length === 0 || !amount) return;
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue)) return;
    
    const splitAmount = amountValue / selectedFriends.length;
    const newSplits = selectedFriends.map(friendId => ({
      friendId,
      amount: splitAmount
    }));
    
    setSplits(newSplits);
  };

  // Calculate the total split amount
  const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0);
  const amountValue = parseFloat(amount);
  const isBalanced = !isNaN(amountValue) && Math.abs(totalSplitAmount - amountValue) < 0.01;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="invite">Invite</TabsTrigger>
          </TabsList>

          <TabsContent value="expense" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Expense description"
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
                    if (splitType === "equal") {
                      // Recalculate equal splits when amount changes
                      const newAmount = parseFloat(e.target.value);
                      if (!isNaN(newAmount) && selectedFriends.length > 0) {
                        const splitAmount = newAmount / selectedFriends.length;
                        const newSplits = selectedFriends.map(friendId => ({
                          friendId,
                          amount: splitAmount
                        }));
                        setSplits(newSplits);
                      }
                    }
                  }}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid By</Label>
                <select
                  id="paidBy"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                >
                  {friends.map((friend) => (
                    <option key={friend.id} value={friend.id}>
                      {friend.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Friend Selection Section */}
              <div className="space-y-2">
                <Label>Split With</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                  {friends.map((friend) => (
                    <div 
                      key={friend.id}
                      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                        selectedFriends.includes(friend.id) 
                          ? 'bg-purple-500/20 border border-purple-500/50' 
                          : 'bg-gray-800/30 border border-gray-700/50'
                      }`}
                      onClick={() => toggleFriendSelection(friend.id)}
                    >
                      <Checkbox 
                        checked={selectedFriends.includes(friend.id)}
                        onCheckedChange={() => toggleFriendSelection(friend.id)}
                        className="data-[state=checked]:bg-purple-500"
                      />
                      <span>{friend.name}</span>
                      {selectedFriends.includes(friend.id) && (
                        <Check size={16} className="ml-auto text-purple-400" />
                      )}
                    </div>
                  ))}
                </div>
                {selectedFriends.length === 0 && (
                  <p className="text-sm text-gray-400">
                    Select friends to split the expense with or{" "}
                    <button
                      type="button"
                      className="text-purple-400 hover:underline"
                      onClick={() => setActiveTab("friends")}
                    >
                      add new friends
                    </button>
                  </p>
                )}
              </div>

              {/* Split Type Selection */}
              {selectedFriends.length > 0 && (
                <div className="space-y-2">
                  <Label>Split Type</Label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={splitType === "equal" ? "default" : "outline"}
                      className={splitType === "equal" ? "bg-purple-500" : ""}
                      onClick={() => {
                        setSplitType("equal");
                        calculateEqualSplits();
                      }}
                    >
                      <Divide className="mr-2 h-4 w-4" /> Equal Split
                    </Button>
                    <Button
                      type="button"
                      variant={splitType === "custom" ? "default" : "outline"}
                      className={splitType === "custom" ? "bg-purple-500" : ""}
                      onClick={() => setSplitType("custom")}
                    >
                      Custom Split
                    </Button>
                  </div>
                </div>
              )}

              {/* Show splits based on split type */}
              {selectedFriends.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Amount per person</Label>
                    {!isBalanced && amount && (
                      <span className="text-sm text-red-400">
                        Total: {formatAmount(totalSplitAmount)} / {formatAmount(amountValue)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                    {selectedFriends.map((friendId) => {
                      const friend = friends.find(f => f.id === friendId);
                      const split = splits.find(s => s.friendId === friendId);
                      return (
                        <div key={friendId} className="flex items-center space-x-2">
                          <span className="w-1/2 truncate">{friend?.name}</span>
                          <Input
                            type="number"
                            value={split?.amount || ""}
                            onChange={(e) => {
                              const splitAmount = parseFloat(e.target.value);
                              setSplits(prev => {
                                const existing = prev.findIndex(s => s.friendId === friendId);
                                if (existing !== -1) {
                                  const newSplits = [...prev];
                                  newSplits[existing] = {
                                    ...newSplits[existing],
                                    amount: splitAmount
                                  };
                                  return newSplits;
                                } else {
                                  return [...prev, { friendId, amount: splitAmount }];
                                }
                              });
                              if (splitType === "equal") {
                                setSplitType("custom");
                              }
                            }}
                            placeholder="0.00"
                            readOnly={splitType === "equal"}
                            className={splitType === "equal" ? "bg-gray-800/50" : ""}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={!isBalanced || selectedFriends.length === 0}
              >
                Add Expense
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="friends" className="space-y-4">
            <form onSubmit={handleAddFriend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newFriendName">Name</Label>
                <Input
                  id="newFriendName"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="Friend's name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newFriendEmail">Email (Optional)</Label>
                <Input
                  type="email"
                  id="newFriendEmail"
                  value={newFriendEmail}
                  onChange={(e) => setNewFriendEmail(e.target.value)}
                  placeholder="friend@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newFriendPhone">Phone (Optional)</Label>
                <Input
                  type="tel"
                  id="newFriendPhone"
                  value={newFriendPhone}
                  onChange={(e) => setNewFriendPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                <UserPlus className="mr-2 h-4 w-4" /> Add Friend
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab("expense")}
              >
                Back to Expense
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="invite" className="space-y-4">
            <form onSubmit={handleInviteFriend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email</Label>
                <Input
                  type="email"
                  id="inviteEmail"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                />
              </div>
              
              <div className="text-center my-2">
                <span className="text-sm text-muted-foreground">Or</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invitePhone">Phone</Label>
                <Input
                  type="tel"
                  id="invitePhone"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                disabled={!inviteEmail && !invitePhone}
              >
                <Mail className="mr-2 h-4 w-4" /> Invite Friend
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab("expense")}
              >
                Back to Expense
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
