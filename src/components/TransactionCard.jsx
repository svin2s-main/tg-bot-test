const icons = {
  'Продукты': '🛒',
  'Кафе': '☕',
  'Транспорт': '🚗',
  'Дом': '🏠',
  'Коммунальные услуги': '💡',
  'Развлечения': '🎮',
  'Подписки': '📋',
  'Здоровье': '💊',
  'Одежда': '👕',
  'Путешествия': '✈️',
  'Зарплата': '💰',
  'Фриланс': '💻',
  'Подарок': '🎁',
  'Продажа': '🏷️',
  'Инвестиции': '📊',
  'Другое': '📌',
};

export default function TransactionCard({ type, category, amount, description, date, currency = '₽' }) {
  const icon = icons[category] || '📌';
  const isExpense = type === 'expense';
  const sign = isExpense ? '-' : '+';
  const color = isExpense ? 'var(--red)' : 'var(--green)';

  const fmtDate = (d) => {
    const dateObj = new Date(d + 'T00:00:00');
    const now = new Date();
    const diff = (now - dateObj) / 86400000;
    if (diff < 1) return 'Сегодня';
    if (diff < 2) return 'Вчера';
    return dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={styles.card}>
      <div style={styles.iconWrap}>{icon}</div>
      <div style={styles.info}>
        <span style={styles.category}>{description || category}</span>
        <span style={styles.date}>{fmtDate(date)}</span>
      </div>
      <span style={{ ...styles.amount, color }}>
        {sign}{Math.round(amount).toLocaleString('ru-RU')} {currency}
      </span>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    animation: 'slideUp 200ms ease',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'var(--secondary-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  category: {
    fontSize: 15,
    fontWeight: 500,
    color: 'var(--text-color)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  date: {
    fontSize: 12,
    color: 'var(--hint-color)',
  },
  amount: {
    fontSize: 15,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
};
