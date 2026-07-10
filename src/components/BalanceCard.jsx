export default function BalanceCard({ balance, income, expense, currency = '₽' }) {
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

  return (
    <div className="card" style={styles.card}>
      <div className="card-title">Баланс</div>
      <h1 style={{ color: balance >= 0 ? 'var(--text-color)' : 'var(--red)', marginTop: 4 }}>
        {fmt(balance)} {currency}
      </h1>
      <div style={styles.row}>
        <div style={styles.item}>
          <span style={styles.label}>Доходы</span>
          <span style={{ ...styles.value, color: 'var(--green)' }}>+{fmt(income)} {currency}</span>
        </div>
        <div style={styles.divider} />
        <div style={styles.item}>
          <span style={styles.label}>Расходы</span>
          <span style={{ ...styles.value, color: 'var(--red)' }}>-{fmt(expense)} {currency}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    animation: 'scaleIn 200ms ease',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid var(--secondary-bg)',
  },
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: 'var(--hint-color)',
  },
  value: {
    fontSize: 17,
    fontWeight: 600,
  },
  divider: {
    width: 1,
    height: 32,
    background: 'var(--secondary-bg)',
    margin: '0 16px',
  },
};
