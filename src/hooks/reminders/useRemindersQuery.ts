
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { fetchReminders } from "@/utils/reminders";

export const useRemindersQuery = (session: Session | null) => {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: () => fetchReminders(session),
    enabled: !!session
  });
};
