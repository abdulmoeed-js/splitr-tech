
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";

interface RefreshButtonProps {
  onRefresh: () => Promise<any>;
  session: Session | null;
}

export function RefreshButton({ onRefresh, session }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to refresh data",
        variant: "destructive"
      });
      return;
    }
    
    setIsRefreshing(true);
    try {
      await onRefresh();
      
      toast({
        title: "Data Refreshed",
        description: "Your data has been refreshed successfully"
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing your data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleRefreshData} 
      disabled={isRefreshing || !session?.user}
      className="mb-4"
    >
      {isRefreshing ? "Refreshing..." : "Refresh Data"}
    </Button>
  );
}
