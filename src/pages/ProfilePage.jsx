import { useState } from 'react';
import { CURRENCIES, getCurrency } from '../shared/currencies';
import { clearUserData } from '../api';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ProfilePage({ user, transactions, getStats, profile, updateProfile }) {
  const [exported, setExported] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState(null);
  const stats = getStats();
  const cur = getCurrency(profile?.main_currency || 'RUB');
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

  const handleCurrencyChange = (e) => {
    updateProfile({ main_currency: e.target.value });
  };

  const handleClearData = async () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    setClearing(true);
    setClearError(null);
    try {
      await clearUserData(user?.id || '1');
      window.location.reload();
    } catch (e) {
      setClearError(e.message);
      setClearing(false);
    }
  };

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      stats,
      transactions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finances-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="page">
      <h2 style={{ marginBottom: 24 }}>👤 Профиль</h2>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: '#fff', fontWeight: 600, flexShrink: 0,
          }}>
            {user?.first_name?.[0] || 'П'}
          </div>
          <div>
            <h3>{user?.first_name || 'Пользователь'}</h3>
            {user?.username && (
              <div style={{ fontSize: 13, color: 'var(--hint-color)', marginTop: 2 }}>
                @{user.username}
              </div>
            )}
            <div style={{ fontSize: 12, color: 'var(--hint-color)', marginTop: 2 }}>
              {user?.language_code?.toUpperCase() || 'RU'}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Валюта</div>
        <label style={{ fontSize: 13, color: 'var(--hint-color)', marginTop: 8, display: 'block' }}>
          Основная валюта
        </label>
        <select
          value={profile?.main_currency || 'RUB'}
          onChange={handleCurrencyChange}
          style={styles.select}
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code} ({c.symbol}) — {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Статистика</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--hint-color)' }}>Всего операций</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{transactions.length}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--hint-color)' }}>Общий доход</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: 'var(--green)' }}>
              +{fmt(stats.totalIncome)} {cur.symbol}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--hint-color)' }}>Общий расход</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: 'var(--red)' }}>
              -{fmt(stats.totalExpense)} {cur.symbol}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--hint-color)' }}>Накопления</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
              {fmt(stats.balance)} {cur.symbol}
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleExport} style={styles.exportBtn}>
        {exported ? '✅ Экспортировано' : '📥 Экспорт данных'}
      </button>

      {clearError && (
        <div style={{ color: 'var(--red)', fontSize: 13, marginTop: 12, textAlign: 'center' }}>
          ❌ {clearError}
        </div>
      )}

      <button
        onClick={handleClearData}
        disabled={clearing}
        style={{
          ...styles.dangerBtn,
          background: confirmClear ? 'var(--red, #e55)' : 'var(--card-bg)',
          color: confirmClear ? '#fff' : 'var(--red, #e55)',
        }}
      >
        {clearing ? 'Очистка...' : confirmClear ? '⚠️ Точно удалить все данные?' : '🗑 Очистить все данные'}
      </button>

      {confirmClear && (
        <button
          onClick={() => setConfirmClear(false)}
          style={{ ...styles.exportBtn, marginTop: 8, color: 'var(--hint-color)', fontSize: 13 }}
        >
          Отмена
        </button>
      )}
    </div>
  );
}

const styles = {
  exportBtn: {
    width: '100%',
    padding: '14px 0',
    borderRadius: 12,
    background: 'var(--card-bg)',
    color: 'var(--text-color)',
    fontSize: 15,
    fontWeight: 600,
    boxShadow: 'var(--shadow)',
    transition: 'opacity 200ms ease',
    border: 'none',
    cursor: 'pointer',
    display: 'block',
    marginTop: 12,
  },
  dangerBtn: {
    width: '100%',
    padding: '14px 0',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    display: 'block',
    marginTop: 12,
    transition: 'all 200ms ease',
  },
  select: {
    width: '100%',
    marginTop: 8,
    padding: '12px 14px',
    borderRadius: 10,
    background: 'var(--secondary-bg)',
    color: 'var(--text-color)',
    fontSize: 15,
    border: 'none',
    cursor: 'pointer',
    appearance: 'auto',
  },
};
