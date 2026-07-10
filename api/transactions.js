import { sb, ok, created, err, cors, getQuery, readBody } from './_supabase.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const { user_id: userId } = getQuery(req);
  if (!userId) return err(res, 'user_id required');

  try {
    if (req.method === 'GET') {
      const data = await sb(`transactions?user_id=eq.${userId}&order=created_at.desc&limit=100`);
      return ok(res, data || []);
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const tx = {
        user_id: Number(userId),
        type: body.type,
        category: body.category,
        amount: Number(body.amount),
        currency: body.currency || 'RUB',
        description: body.description || body.category,
        created_at: body.date || new Date().toISOString(),
      };
      const data = await sb('transactions', { method: 'POST', body: JSON.stringify(tx) });
      return created(res, data?.[0] || tx);
    }

    return err(res, 'Method not allowed', 405);
  } catch (e) {
    return err(res, e.message, 503);
  }
}