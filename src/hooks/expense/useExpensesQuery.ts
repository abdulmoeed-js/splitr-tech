
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { fetchExpenses } from "@/utils/expense/expenseQueries";
import { toast } from "@/components/ui/use-toast";

export const useExpensesQuery = (session: Session | null) => {
  return useQuery({
    queryKey: ['expenses', session?.user?.id],
    queryFn: () => fetchExpenses(session),
    enabled: !!session?.user, // Only fetch when authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3, // Retry 3 times on failure
    // Add error handling
    meta: {
      onError: (error: any) => {
        console.error("Error fetching expenses:", error);
        toast({
          title: "Failed to load expenses",
          description: error.message || "An error occurred while loading expenses",
          variant: "destructive"
        });
      }
    }
  });
};
