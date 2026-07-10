import { sb, ok, err, cors, getQuery } from './_supabase.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return err(res, 'Method not allowed', 405);

  const { user_id: userId } = getQuery(req);
  if (!userId) return err(res, 'user_id required');

  try {
    const txs = await sb(`transactions?user_id=eq.${userId}&select=*`) || [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const totalIncome = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const totalExpense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const monthTxs = txs.filter(t => (t.created_at || '') >= monthStart);
    const monthIncome = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const monthExpense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

    const catMap = {};
    monthTxs.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
    });
    const categories = Object.entries(catMap)
      .map(([k, v]) => ({ category: k, amount: v }))
      .sort((a, b) => b.amount - a.amount);

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    ok(res, {
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: totalIncome - totalExpense,
      month_income: monthIncome,
      month_expense: monthExpense,
      month_balance: monthIncome - monthExpense,
      count: txs.length,
      month_count: monthTxs.length,
      categories,
      daily_avg: daysInMonth > 0 ? Math.round(monthExpense / daysInMonth) : 0,
    });
  } catch (e) {
    return err(res, e.message, 503);
  }
}