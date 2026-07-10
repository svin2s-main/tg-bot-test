const tabs = [
  { key: 'home', label: 'Главная', icon: '🏠' },
  { key: 'stats', label: 'Статистика', icon: '📈' },
  { key: 'goals', label: 'Цели', icon: '🎯' },
  { key: 'profile', label: 'Профиль', icon: '👤' },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={styles.nav}>
      {tabs.map(tab => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              ...styles.tab,
              opacity: isActive ? 1 : 0.4,
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.icon}</span>
            <span style={styles.label}>{tab.label}</span>
            {isActive && <span style={styles.indicator} />}
          </button>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    padding: '6px 0 12px',
    background: 'var(--bg-color)',
    borderTop: '1px solid var(--secondary-bg)',
    zIndex: 100,
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '4px 16px',
    position: 'relative',
    transition: 'opacity 200ms ease',
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: 500,
    color: 'var(--text-color)',
  },
  indicator: {
    position: 'absolute',
    top: -1,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 20,
    height: 3,
    borderRadius: 2,
    background: 'var(--accent)',
  },
};
