import { useState } from 'react';
import ProgressBar from '../components/ProgressBar';

export default function GoalsPage({ goals, error, addGoal, contribute, deleteGoal, currency = '₽' }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [contributing, setContributing] = useState(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

  const handleCreate = () => {
    const t = parseFloat(target);
    if (!title || !t || t <= 0) return;
    addGoal({ title, target: t, icon: '🎯' });
    setTitle('');
    setTarget('');
    setShowForm(false);
  };

  const startContribute = (id) => {
    setContributing(id);
    setContributeAmount('');
  };

  const submitContribute = () => {
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) return;
    contribute(contributing, amount);
    setContributing(null);
    setContributeAmount('');
  };

  return (
    <div className="page" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>🎯 Цели</h2>
        <button onClick={() => setShowForm(true)} style={styles.addBtn}>
          + Новая
        </button>
      </div>

      {error && (
        <div style={{ color: 'var(--red, #e55)', fontSize: 13, textAlign: 'center', marginBottom: 12, padding: 8, background: 'var(--secondary-bg)', borderRadius: 10 }}>
          ❌ {error}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: 20, position: 'relative', zIndex: 2 }}>
          <input
            placeholder="Название цели"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ marginBottom: 12 }}
            autoFocus
          />
          <input
            placeholder="Стоимость"
            type="number"
            value={target}
            onChange={e => setTarget(e.target.value)}
            style={{ marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => { setShowForm(false); setTitle(''); setTarget(''); }} style={styles.cancelBtn}>Отмена</button>
            <button
              onClick={handleCreate}
              style={{ ...styles.createBtn, opacity: title && target ? 1 : 0.4 }}
              disabled={!title || !target}
            >
              Создать
            </button>
          </div>
        </div>
      )}

      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--hint-color)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <p>Цели пока нет</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {goals.map(goal => {
            const pct = goal.target > 0 ? (goal.saved / goal.target * 100) : 0;
            return (
              <div key={goal.id} className="card" style={styles.goalCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 28 }}>{goal.icon || '🎯'}</span>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{goal.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--hint-color)', marginTop: 2 }}>
                        {fmt(goal.saved)} {currency} из {fmt(goal.target)} {currency}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} style={styles.deleteBtn}>✕</button>
                </div>
                <ProgressBar current={goal.saved} target={goal.target} />
                {pct < 100 && contributing === goal.id ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <input
                      type="number"
                      placeholder="Сумма"
                      value={contributeAmount}
                      onChange={e => setContributeAmount(e.target.value)}
                      style={{ flex: 1 }}
                      autoFocus
                    />
                    <button onClick={submitContribute} style={styles.contributeBtn}>OK</button>
                    <button onClick={() => setContributing(null)} style={{ ...styles.cancelBtn, flex: 0, padding: '8px 12px' }}>✕</button>
                  </div>
                ) : pct < 100 ? (
                  <button onClick={() => startContribute(goal.id)} style={styles.contributeBtn}>
                    + Добавить
                  </button>
                ) : (
                  <div style={{ color: 'var(--green)', fontSize: 14, fontWeight: 600, marginTop: 8 }}>
                    ✅ Цель достигнута!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  addBtn: {
    padding: '8px 16px',
    borderRadius: 10,
    background: 'var(--accent)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '10px 0',
    borderRadius: 10,
    background: 'var(--secondary-bg)',
    color: 'var(--text-color)',
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    flex: 1,
  },
  createBtn: {
    flex: 1,
    padding: '10px 0',
    borderRadius: 10,
    background: 'var(--button-color)',
    color: 'var(--button-text-color)',
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
  goalCard: {
    position: 'relative',
    zIndex: 1,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--secondary-bg)',
    fontSize: 12,
    color: 'var(--hint-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  contributeBtn: {
    marginTop: 12,
    padding: '10px 16px',
    borderRadius: 10,
    background: 'var(--accent)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
};
