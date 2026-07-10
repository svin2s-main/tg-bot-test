import { sb, ok, created, err, cors, getQuery, readBody } from './_supabase.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const { user_id: userId } = getQuery(req);
  if (!userId) return err(res, 'user_id required');

  try {
    if (req.method === 'GET') {
      const data = await sb(`budgets?user_id=eq.${userId}&order=created_at.desc`);
      return ok(res, data || []);
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      const existing = await sb(`budgets?user_id=eq.${userId}&category=eq.${encodeURIComponent(body.category)}&select=id`);
      if (existing && existing.length > 0) {
        await sb(`budgets?id=eq.${existing[0].id}&user_id=eq.${userId}`, {
          method: 'PATCH',
          body: JSON.stringify({ limit_amount: Number(body.limit_amount), period: body.period || 'monthly' }),
        });
        return ok(res, { ok: true, updated: true });
      }
      const data = await sb('budgets', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          category: body.category,
          limit_amount: Number(body.limit_amount),
          period: body.period || 'monthly',
        }),
      });
      return created(res, data?.[0] || { ok: true });
    }

    if (req.method === 'DELETE') {
      const { category } = getQuery(req);
      if (!category) return err(res, 'category required');
      await sb(`budgets?user_id=eq.${userId}&category=eq.${encodeURIComponent(category)}`, { method: 'DELETE' });
      return ok(res, { ok: true });
    }

    return err(res, 'Method not allowed', 405);
  } catch (e) {
    return err(res, e.message, 503);
  }
}
