import { sb, ok, created, err, cors, getQuery, readBody } from './_supabase.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const { user_id: userId, id } = getQuery(req);
  if (!userId) return err(res, 'user_id required');

  try {
    if (req.method === 'GET') {
      const data = await sb(`goals?user_id=eq.${userId}&order=created_at.desc`);
      return ok(res, data || []);
    }

    if (req.method === 'POST') {
      const body = await readBody(req);
      if (!body.title || !body.target) return err(res, `invalid body: ${JSON.stringify(body)}`, 400);
      const g = {
        user_id: Number(userId), title: body.title, target: Number(body.target),
        saved: Number(body.saved) || 0, icon: body.icon || '🎯',
        created_at: new Date().toISOString(),
      };
      const data = await sb('goals', { method: 'POST', body: JSON.stringify(g) });
      return created(res, data?.[0] || g);
    }

    if (req.method === 'PATCH' && id) {
      const body = await readBody(req);
      const saved = Number(body.saved);
      if (isNaN(saved)) return err(res, `invalid saved: ${JSON.stringify(body)}`, 400);
      await sb(`goals?id=eq.${id}&user_id=eq.${userId}`, { method: 'PATCH', body: JSON.stringify({ saved }) });
      return ok(res, { ok: true });
    }

    if (req.method === 'DELETE' && id) {
      await sb(`goals?id=eq.${id}&user_id=eq.${userId}`, { method: 'DELETE' });
      return ok(res, { ok: true });
    }

    return err(res, 'Method not allowed', 405);
  } catch (e) {
    return err(res, e.message, 503);
  }
}