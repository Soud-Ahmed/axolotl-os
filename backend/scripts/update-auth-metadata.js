import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Supabase URL or Service Role Key missing');
  process.exit(1);
}

const userId = 'e161bb6a-f86c-4b97-971e-ad7c65271b11';

async function updateUserRole(userId) {
  const body = {
    user_metadata: { role: 'super_admin' },
  };
  const resp = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    console.error('Failed to update user role:', resp.status, await resp.text());
    process.exit(1);
  }
  const result = await resp.json();
  console.log('User role updated:', result.user_metadata);
}

updateUserRole(userId);
