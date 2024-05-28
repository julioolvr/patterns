import { createClient } from "@supabase/supabase-js";

// TODO: Check generics
const client = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default client;
