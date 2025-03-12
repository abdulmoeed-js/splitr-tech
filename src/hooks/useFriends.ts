
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "@/types/expense";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

export const useFriends = (session: Session | null, userName: string) => {
  const queryClient = useQueryClient();

  // Fetch friends from Supabase
  const { data: friends = [], isLoading: isFriendsLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      if (!session?.user) {
        // Return default friends for non-authenticated users
        return [
          { id: "1", name: userName },
          { id: "2", name: "Alice" },
          { id: "3", name: "Bob" },
          { id: "4", name: "Charlie" },
        ] as Friend[];
      }

      // First, ensure the user has a "You" entry
      const userFriendExists = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('name', userName)
        .single();
      
      if (userFriendExists.error && userFriendExists.error.code === 'PGRST116') {
        // "You" friend doesn't exist, create it
        await supabase
          .from('friends')
          .insert({
            user_id: session.user.id,
            name: userName
          });
      }

      // Now fetch all friends
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Convert database records to Friend objects
      return data.map(friend => ({
        id: friend.id,
        name: friend.name
      }));
    },
    enabled: !!session || true,
  });

  // Add friend mutation
  const addFriendMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!session?.user) {
        // Generate a local ID for non-authenticated users
        return { id: Date.now().toString(), name };
      }

      const { data, error } = await supabase
        .from('friends')
        .insert({
          user_id: session.user.id,
          name
        })
        .select()
        .single();
      
      if (error) throw error;
      return { id: data.id, name: data.name };
    },
    onSuccess: (newFriend) => {
      queryClient.setQueryData(['friends'], (oldFriends: Friend[] = []) => [...oldFriends, newFriend]);
      
      toast({
        title: "Friend Added",
        description: `${newFriend.name} has been added to your friends list.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Friend",
        description: error.message || "An error occurred while adding friend",
        variant: "destructive"
      });
    }
  });

  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: async (friendId: string) => {
      // Check if friend has associated expenses
      const hasExpensesCheck = async () => {
        if (!session?.user) {
          return false;
        }

        // Check if friend is payer or has splits in any expense
        const { data: paidByData } = await supabase
          .from('expenses')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('paid_by', friendId)
          .limit(1);
        
        if (paidByData && paidByData.length > 0) return true;
        
        const { data: splitData } = await supabase
          .from('expense_splits')
          .select('id')
          .eq('friend_id', friendId)
          .limit(1);
        
        return splitData && splitData.length > 0;
      };

      if (friendId === "1" || (await hasExpensesCheck())) {
        throw new Error(
          friendId === "1" 
            ? "Cannot remove yourself from friends list." 
            : "This friend has associated expenses. Settle all expenses before removing."
        );
      }

      if (session?.user) {
        // Remove friend from database
        const { error } = await supabase
          .from('friends')
          .delete()
          .eq('id', friendId)
          .eq('user_id', session.user.id);
        
        if (error) throw error;
      }

      return friendId;
    },
    onSuccess: (removedFriendId) => {
      // Update friends list
      queryClient.setQueryData(['friends'], (oldFriends: Friend[] = []) => 
        oldFriends.filter(friend => friend.id !== removedFriendId)
      );
      
      // Also update groups to remove this friend
      queryClient.setQueryData(['groups'], (oldGroups: any[] = []) =>
        oldGroups.map(group => ({
          ...group,
          members: group.members.filter((member: any) => member.id !== removedFriendId)
        }))
      );
      
      const removedFriend = friends.find(f => f.id === removedFriendId);
      toast({
        title: "Friend Removed",
        description: `${removedFriend?.name || 'Friend'} has been removed from your friends list.`
      });
    },
    onError: (error) => {
      toast({
        title: "Cannot Remove Friend",
        description: error.message || "An error occurred while removing friend",
        variant: "destructive"
      });
    }
  });

  return {
    friends,
    isFriendsLoading,
    handleAddFriend: (name: string) => addFriendMutation.mutate(name),
    handleRemoveFriend: (friendId: string) => removeFriendMutation.mutate(friendId)
  };
};
