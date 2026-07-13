import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function listUsers() {
  const resp = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });
  const users = await resp.json();
  console.log(users.users?.map(u => ({ id: u.id, email: u.email })) || users);
}

listUsers();
