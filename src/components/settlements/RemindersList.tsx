
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentReminder, Friend } from "@/types/expense";
import { format, isAfter } from "date-fns";
import { Bell, BellOff, Calendar } from "lucide-react";

interface RemindersListProps {
  reminders: PaymentReminder[];
  friends: Friend[];
  onMarkAsRead: (reminderId: string) => void;
  onSettleReminder: (reminder: PaymentReminder) => void;
}

export const RemindersList = ({ 
  reminders,
  friends,
  onMarkAsRead,
  onSettleReminder
}: RemindersListProps) => {
  const formatCurrency = (amount: number) => {
    return `Rs. ${parseFloat(amount.toFixed(2)).toLocaleString('en-PK')}`;
  };

  if (reminders.length === 0) {
    return (
      <Card className="p-6 text-center glass-panel">
        <BellOff className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No payment reminders</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reminders.map((reminder) => {
        const toFriend = friends.find(f => f.id === reminder.toFriendId);
        const isOverdue = isAfter(new Date(), reminder.dueDate);
        
        return (
          <Card key={reminder.id} className={`p-4 ${!reminder.isRead ? 'border-l-4 border-l-primary' : ''} glass-panel`}>
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl ${isOverdue ? 'bg-red-100' : 'bg-secondary'}`}>
                  <Bell className={`h-5 w-5 ${isOverdue ? 'text-red-500' : 'text-primary'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {reminder.isPaid ? "Paid to" : "Pay"} {toFriend?.name}
                    </h3>
                    {!reminder.isRead && (
                      <Badge variant="outline" className="text-xs">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-primary font-semibold">{formatCurrency(reminder.amount)}</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Due {format(reminder.dueDate, "MMM d, yyyy")}</span>
                    {isOverdue && !reminder.isPaid && (
                      <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {!reminder.isPaid && (
                  <Button 
                    size="sm" 
                    onClick={() => onSettleReminder(reminder)}
                    className="whitespace-nowrap"
                  >
                    Pay Now
                  </Button>
                )}
                {!reminder.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onMarkAsRead(reminder.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
