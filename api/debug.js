import { sb, ok, err, cors, getQuery } from './_supabase.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return err(res, 'Method not allowed', 405);

  try {
    const { user_id } = getQuery(req);
    const all = await sb('transactions?select=*&limit=50');
    const byUser = user_id ? await sb(`transactions?user_id=eq.${user_id}&limit=20`) : [];

    ok(res, {
      total_in_db: (all || []).length,
      user_ids: [...new Set((all || []).map(t => t.user_id))],
      requested_user_id: user_id || 'none',
      transactions_for_user: byUser || [],
    });
  } catch (e) {
    return err(res, e.message, 503);
  }
}
