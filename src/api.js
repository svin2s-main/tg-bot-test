const API_BASE = '/api';

export async function fetchTransactions(userId) {
  const res = await fetch(`${API_BASE}/transactions?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function addTransaction(userId, data) {
  const res = await fetch(`${API_BASE}/transactions?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add transaction');
  return res.json();
}

export async function fetchStats(userId) {
  const res = await fetch(`${API_BASE}/stats?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchGoals(userId) {
  const res = await fetch(`${API_BASE}/goals?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch goals');
  return res.json();
}

export async function addGoal(userId, data) {
  const res = await fetch(`${API_BASE}/goals?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add goal');
  return res.json();
}

export async function updateGoal(userId, goalId, data) {
  const res = await fetch(`${API_BASE}/goals?id=${goalId}&user_id=${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update goal');
  return res.json();
}

export async function deleteGoal(userId, goalId) {
  const res = await fetch(`${API_BASE}/goals?id=${goalId}&user_id=${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete goal');
  return res.json();
}

export async function fetchProfile(userId) {
  const res = await fetch(`${API_BASE}/profile?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(userId, data) {
  const res = await fetch(`${API_BASE}/profile?user_id=${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function clearUserData(userId) {
  const res = await fetch(`${API_BASE}/clear-data?user_id=${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to clear data');
  return res.json();
}
