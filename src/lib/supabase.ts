import { createClient } from "@supabase/supabase-js";

// Publishable (anon) key — safe in the browser; RLS policies control access.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
