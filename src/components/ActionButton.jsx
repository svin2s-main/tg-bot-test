export default function ActionButton({ icon, label, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.card,
        background: accent || 'var(--card-bg)',
      }}
    >
      <span style={styles.icon}>{icon}</span>
      <span style={styles.label}>{label}</span>
    </button>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '16px 8px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow)',
    flex: 1,
    transition: 'transform 200ms ease, opacity 200ms ease',
    minHeight: 80,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text-color)',
    textAlign: 'center',
    lineHeight: 1.2,
  },
};
