
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";

interface QuickInviteProps {
  onInviteFriend: (email?: string, phone?: string) => void;
}

export function QuickInvite({ onInviteFriend }: QuickInviteProps) {
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInviteFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      onInviteFriend(inviteEmail, undefined);
      setInviteEmail("");
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Invite</CardTitle>
        <CardDescription>
          Quickly invite friends to join your expense-sharing network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInviteFriend} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter friend's email"
            />
          </div>
          <Button 
            type="submit" 
            variant="secondary"
            disabled={!inviteEmail}
          >
            <Mail className="mr-2 h-4 w-4" /> Invite
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
