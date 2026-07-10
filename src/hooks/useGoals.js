import { useState, useEffect, useCallback } from 'react';
import { fetchGoals, addGoal as apiAddGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from '../api';

export function useGoals(userId) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await fetchGoals(userId);
      setGoals(data || []);
      setError(null);
    } catch (e) {
      setError(e.message);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const addGoal = useCallback(async (data) => {
    if (!userId) return;
    try {
      const newGoal = await apiAddGoal(userId, data);
      setGoals(prev => [newGoal, ...prev]);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [userId]);

  const updateGoal = useCallback(async (id, updates) => {
    if (!userId) return;
    try {
      await apiUpdateGoal(userId, id, updates);
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [userId]);

  const deleteGoal = useCallback(async (id) => {
    if (!userId) return;
    try {
      await apiDeleteGoal(userId, id);
      setGoals(prev => prev.filter(g => g.id !== id));
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [userId]);

  const contribute = useCallback(async (id, amount) => {
    if (!userId) return;
    try {
      const goal = goals.find(g => String(g.id) === String(id));
      if (!goal) { setError('Goal not found'); return; }
      const newSaved = Math.min(goal.saved + amount, goal.target);
      await updateGoal(id, { saved: newSaved });
    } catch (e) {
      setError(e.message);
    }
  }, [userId, goals, updateGoal]);

  return { goals, loading, error, addGoal, updateGoal, deleteGoal, contribute, refresh: load };
}
