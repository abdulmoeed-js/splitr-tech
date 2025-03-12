
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CreditCard, Trash2, User } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PaymentMethod {
  id: string;
  type: "card" | "paypal" | "venmo";
  name: string;
  lastFour?: string;
  expiryDate?: string;
}

const Profile = () => {
  const { user, isLoaded } = useUser();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "card", name: "Personal Card", lastFour: "4242", expiryDate: "04/25" }
  ]);
  const [newCardName, setNewCardName] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCVC, setNewCardCVC] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would integrate with Stripe or another payment processor here
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: "card",
      name: newCardName,
      lastFour: newCardNumber.slice(-4),
      expiryDate: newCardExpiry
    };
    
    setPaymentMethods([...paymentMethods, newCard]);
    setNewCardName("");
    setNewCardNumber("");
    setNewCardExpiry("");
    setNewCardCVC("");
    setDialogOpen(false);
    
    toast({
      title: "Payment Method Added",
      description: `${newCardName} has been added to your account.`
    });
  };

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed from your account."
    });
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 rounded-full p-1">
          <TabsTrigger value="profile" className="rounded-full">Profile</TabsTrigger>
          <TabsTrigger value="payment" className="rounded-full">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 glass-panel">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.fullName || ""} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{user?.fullName}</h2>
                <p className="text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Account Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Payment Methods</h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Method
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel">
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCard} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      value={newCardName} 
                      onChange={(e) => setNewCardName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      value={newCardNumber} 
                      onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input 
                        id="cardExpiry" 
                        value={newCardExpiry} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          let formatted = '';
                          if (val.length > 0) {
                            if (val.length <= 2) {
                              formatted = val;
                            } else {
                              formatted = val.slice(0, 2) + '/' + val.slice(2, 4);
                            }
                          }
                          setNewCardExpiry(formatted);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCVC">CVC</Label>
                      <Input 
                        id="cardCVC" 
                        value={newCardCVC} 
                        onChange={(e) => setNewCardCVC(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full rounded-full">
                      Add Card
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {paymentMethods.length === 0 ? (
            <Card className="p-6 text-center glass-panel">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No payment methods added yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="p-4 hover:shadow-md transition-shadow glass-panel">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-secondary rounded-xl">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{method.name}</h3>
                        {method.lastFour && (
                          <p className="text-sm text-muted-foreground">
                            •••• {method.lastFour} {method.expiryDate && `• Expires ${method.expiryDate}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveCard(method.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
