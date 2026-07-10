import { sb, ok, err, cors, getQuery, readBody } from './_supabase.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const { user_id: userId } = getQuery(req);
  if (!userId) return err(res, 'user_id required');

  try {
    if (req.method === 'GET') {
      let data = await sb(`profiles?user_id=eq.${userId}`);
      if (!data || data.length === 0) {
        const created = await sb('profiles', {
          method: 'POST',
          body: JSON.stringify({ user_id: userId }),
        });
        data = created?.[0] ? [created[0]] : [{ user_id: userId, main_currency: 'RUB', salary_currency: 'RUB' }];
      }
      return ok(res, Array.isArray(data) ? data[0] : data);
    }

    if (req.method === 'PATCH') {
      const body = await readBody(req);
      const updates = {};
      if (body.main_currency) updates.main_currency = body.main_currency;
      if (body.salary_currency) updates.salary_currency = body.salary_currency;
      if (Object.keys(updates).length === 0) return err(res, 'no fields to update');

      const existing = await sb(`profiles?user_id=eq.${userId}`);
      if (!existing || existing.length === 0) {
        await sb('profiles', {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, main_currency: 'RUB', salary_currency: 'RUB', ...updates }),
        });
      } else {
        await sb(`profiles?user_id=eq.${userId}`, { method: 'PATCH', body: JSON.stringify(updates) });
      }
      return ok(res, { ok: true });
    }

    return err(res, 'Method not allowed', 405);
  } catch (e) {
    return err(res, e.message, 503);
  }
}
