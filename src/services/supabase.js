import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function signInWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.session?.access_token) {
    throw new Error('Supabase did not return an access token');
  }

  const { data: agentData, error: agentError } = await supabase
    .from('agents')
    .select('id, email, display_name, role')
    .eq('auth_id', data.user.id)
    .single();

  if (agentError) throw agentError;

  return {
    user: data.user,
    session: data.session,
    accessToken: data.session.access_token,
    agent: agentData,
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
