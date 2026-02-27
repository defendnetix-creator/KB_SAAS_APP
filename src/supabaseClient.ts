import { createClient } from "@supabase/supabase-js";

// SUPABASE CONNECTION CONFIGURATION
// Using environment variables with hardcoded fallbacks to prevent crashes
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mhcnamoszmwokpnonuxk.supabase.co";
const SUPABASE_PUBLIC_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oY25hbW9zem13b2twbm9udXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTcwNTQsImV4cCI6MjA4NzU5MzA1NH0.rtfthLoQAXrkBPHi5njE-4Jd3Yox2LPp1C4KjCJin_8";

if (!SUPABASE_URL || !SUPABASE_PUBLIC_KEY) {
  console.warn("Supabase credentials missing. Please check your environment variables.");
}

// Export the Supabase client to be used throughout the project
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
