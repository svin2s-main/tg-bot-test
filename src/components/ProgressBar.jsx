export default function ProgressBar({ current, target }) {
  const pct = Math.min((current / target) * 100, 100);
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

  return (
    <div style={styles.wrap}>
      <div style={styles.bg}>
        <div
          style={{
            ...styles.fill,
            width: `${pct}%`,
            background: pct >= 100 ? 'var(--green)' : 'var(--accent)',
          }}
        />
      </div>
      <div style={styles.row}>
        <span style={styles.text}>{fmt(current)} ₽</span>
        <span style={styles.text}>{pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    marginTop: 12,
  },
  bg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    background: 'var(--secondary-bg)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 400ms ease',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  text: {
    fontSize: 12,
    color: 'var(--hint-color)',
    fontWeight: 500,
  },
};
