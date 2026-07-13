import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Supabase URL or Service Role Key missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const email = 'mohammedsoudahmed@gmail.com';

async function updateRole() {
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('email', email)
    .single();

  if (fetchError) {
    console.error('Error fetching profile:', fetchError.message);
    process.exit(1);
  }

  console.log('Current profile:', profile);

  const { data, error } = await supabase
    .from('profiles')
    .update({ role: 'super_admin' })
    .eq('email', email)
    .select();

  if (error) {
    console.error('Error updating role:', error.message);
    process.exit(1);
  }

  console.log('Updated profile:', data);
}

updateRole();
