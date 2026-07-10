import { sb, cors, getQuery, err, ok } from './_supabase.js';

const TABLES = ['transactions', 'goals', 'budgets', 'profiles'];

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'DELETE') return err(res, 'Method not allowed', 405);

  const { user_id: userId } = getQuery(req);
  if (!userId) return err(res, 'user_id required');

  try {
    for (const table of TABLES) {
      await sb(`${table}?user_id=eq.${userId}`, { method: 'DELETE' });
    }
    return ok(res, { ok: true });
  } catch (e) {
    return err(res, e.message, 503);
  }
}
