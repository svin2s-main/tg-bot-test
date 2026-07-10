import { useState, useEffect, useCallback } from 'react';
import { fetchTransactions, addTransaction as apiAddTx } from '../api';

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await fetchTransactions(userId);
      setTransactions(data || []);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const addTransaction = useCallback(async (data) => {
    if (!userId) return;
    try {
      const newTx = await apiAddTx(userId, data);
      setTransactions(prev => [newTx, ...prev]);
    } catch (e) {
      setError(e.message);
    }
  }, [userId]);

  const getStats = useCallback(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthTxs = transactions.filter(t => {
      const d = t.created_at || '';
      return d >= monthStart || d.slice(0, 7) === now.toISOString().slice(0, 7);
    });

    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    const monthIncome = monthTxs.filter(t => t.type === 'income');
    const monthExpense = monthTxs.filter(t => t.type === 'expense');

    const totalIncome = income.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const monthIncomeSum = monthIncome.reduce((s, t) => s + t.amount, 0);
    const monthExpenseSum = monthExpense.reduce((s, t) => s + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthIncome: monthIncomeSum,
      monthExpense: monthExpenseSum,
      monthBalance: monthIncomeSum - monthExpenseSum,
      count: transactions.length,
      monthCount: monthTxs.length,
    };
  }, [transactions]);

  const getCategoryStats = useCallback(() => {
    const now = new Date();
    const monthStart = now.toISOString().slice(0, 7);
    const monthTxs = transactions.filter(t =>
      (t.created_at || '').startsWith(monthStart) && t.type === 'expense'
    );

    const map = {};
    monthTxs.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const getDailyAverage = useCallback(() => {
    const now = new Date();
    const monthStart = now.toISOString().slice(0, 7);
    const monthTxs = transactions.filter(t =>
      (t.created_at || '').startsWith(monthStart) && t.type === 'expense'
    );
    const total = monthTxs.reduce((s, t) => s + t.amount, 0);
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return days > 0 ? Math.round(total / days) : 0;
  }, [transactions]);

  const getBiggestPurchase = useCallback(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    if (!expenses.length) return null;
    return expenses.reduce((a, b) => a.amount > b.amount ? a : b);
  }, [transactions]);

  const getIncomeByMonth = useCallback(() => {
    const map = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      const month = (t.created_at || '').slice(0, 7);
      if (month) map[month] = (map[month] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [transactions]);

  const getExpenseByMonth = useCallback(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const month = (t.created_at || '').slice(0, 7);
      if (month) map[month] = (map[month] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [transactions]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    getStats,
    getCategoryStats,
    getDailyAverage,
    getBiggestPurchase,
    getIncomeByMonth,
    getExpenseByMonth,
    refresh: load,
  };
}
