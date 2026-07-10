import { useState, useEffect, useCallback } from 'react';
import { fetchProfile, updateProfile as apiUpdateProfile } from '../api';

export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await fetchProfile(userId);
      setProfile(data);
    } catch {
      setProfile({ main_currency: 'RUB', salary_currency: 'RUB' });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const updateProfile = useCallback(async (updates) => {
    if (!userId) return;
    try {
      await apiUpdateProfile(userId, updates);
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (e) {
      console.error('Failed to update profile', e);
    }
  }, [userId]);

  return { profile, loading, updateProfile, refresh: load };
}
