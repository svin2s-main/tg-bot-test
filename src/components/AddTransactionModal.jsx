import { useState } from 'react';

const EXPENSE_CATEGORIES = [
  'Продукты', 'Кафе', 'Транспорт', 'Дом', 'Коммунальные услуги',
  'Развлечения', 'Подписки', 'Здоровье', 'Одежда', 'Путешествия', 'Другое',
];

const INCOME_CATEGORIES = [
  'Зарплата', 'Фриланс', 'Подарок', 'Продажа', 'Инвестиции', 'Другое',
];

export default function AddTransactionModal({ type, onClose, onSave }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [customCat, setCustomCat] = useState('');
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    onSave({
      type,
      category: category === 'Другое' ? (customCat || 'Другое') : category,
      amount: num,
      description: category === 'Другое' ? (customCat || 'Другое') : category,
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 20 }}>
          {type === 'income' ? '➕ Добавить доход' : '➖ Добавить расход'}
        </h3>

        <div className="card-title mb-8">Категория</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                ...styles.chip,
                background: category === c ? 'var(--accent)' : 'var(--secondary-bg)',
                color: category === c ? '#fff' : 'var(--text-color)',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {category === 'Другое' && (
          <input
            placeholder="Своя категория"
            value={customCat}
            onChange={e => setCustomCat(e.target.value)}
            style={{ marginBottom: 16 }}
          />
        )}

        <input
          placeholder="Сумма"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ marginBottom: 20 }}
        />

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={styles.cancelBtn}>Отмена</button>
          <button
            onClick={handleSave}
            style={{
              ...styles.saveBtn,
              opacity: amount && category ? 1 : 0.4,
            }}
            disabled={!amount || !category}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 200,
    animation: 'fadeIn 200ms ease',
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    background: 'var(--bg-color)',
    borderRadius: '20px 20px 0 0',
    padding: '24px 20px 32px',
    animation: 'slideUp 200ms ease',
  },
  chip: {
    padding: '8px 14px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 500,
    transition: 'all 200ms ease',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px 0',
    borderRadius: 12,
    background: 'var(--secondary-bg)',
    color: 'var(--text-color)',
    fontSize: 15,
    fontWeight: 600,
  },
  saveBtn: {
    flex: 1,
    padding: '12px 0',
    borderRadius: 12,
    background: 'var(--button-color)',
    color: 'var(--button-text-color)',
    fontSize: 15,
    fontWeight: 600,
  },
};
