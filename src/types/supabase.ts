
// Define types for our Supabase tables
import { Database } from '@/integrations/supabase/types';

// Use existing Database type but add our custom types
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_member: boolean;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AdminProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Invitation = {
  id: string;
  email: string;
  token: string;
  is_used: boolean;
  created_at: string;
  created_by: string;
  expires_at: string;
};

// Utility type to access tables from the Database type
export type Tables = Database['public']['Tables'];
