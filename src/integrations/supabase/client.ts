// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wgnhznbderbokdvjyqsl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnbmh6bmJkZXJib2tkdmp5cXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTQ2MjAsImV4cCI6MjA1NzM5MDYyMH0.IAY-q-CH3B5Hf2sCucKr9O-l3lWnXvOYFVBFltUYbSs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);