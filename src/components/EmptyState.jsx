export default function EmptyState({ onAdd }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.icon}>💰</div>
      <h3 style={{ marginTop: 16, color: 'var(--text-color)' }}>Добавьте первую операцию</h3>
      <p style={{ marginTop: 8, fontSize: 14, color: 'var(--hint-color)', textAlign: 'center', maxWidth: 240 }}>
        Начните учитывать свои финансы — записывайте доходы и расходы
      </p>
      <button onClick={onAdd} style={styles.btn}>
        Добавить
      </button>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    animation: 'fadeIn 200ms ease',
  },
  icon: {
    fontSize: 64,
    opacity: 0.6,
  },
  btn: {
    marginTop: 24,
    padding: '12px 32px',
    background: 'var(--button-color)',
    color: 'var(--button-text-color)',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    transition: 'opacity 200ms ease',
  },
};
