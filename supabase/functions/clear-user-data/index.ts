
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get the user ID from the request
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Clearing data for user: ${user_id}`);

    // Delete all user data from relevant tables
    const tables = [
      "payments",
      "payment_reminders",
      "expense_splits",
      "expenses",
      "group_members",
      "friend_groups",
      "friends"
    ];

    // Execute all delete operations in parallel
    const deletePromises = tables.map(async (table) => {
      console.log(`Deleting ${table} for user ${user_id}`);
      const { error } = await supabaseAdmin
        .from(table)
        .delete()
        .eq("user_id", user_id);
      
      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        return { table, success: false, error: error.message };
      }
      
      return { table, success: true };
    });

    const results = await Promise.all(deletePromises);
    
    console.log("Data clearing complete", results);

    return new Response(
      JSON.stringify({ 
        message: "User data cleared successfully", 
        details: results 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error clearing user data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
