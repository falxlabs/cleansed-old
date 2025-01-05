// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cleansed-old.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbmdhc2hzcnZudXZlb3h1dGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5Njk0OTUsImV4cCI6MjA1MDU0NTQ5NX0.8zl3NGxIXsnmlY_tn7gk7pGfwX_eZkVXUPdh71y1SM0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);