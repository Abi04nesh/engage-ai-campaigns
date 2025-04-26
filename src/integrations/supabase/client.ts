
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://juotaweyrheomkcocxro.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1b3Rhd2V5cmhlb21rY29jeHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODA2NDQsImV4cCI6MjA2MTI1NjY0NH0.4BQhbPY8UJhC_D1opkVLoO5wh4taOcC8MxNl6orG99g";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true // Added for better debugging
  }
});
