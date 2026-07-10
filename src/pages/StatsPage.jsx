import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

export default function StatsPage({ transactions, getCategoryStats, getDailyAverage, getBiggestPurchase, getIncomeByMonth, getExpenseByMonth, currency = '₽' }) {
  const categoryData = getCategoryStats();
  const dailyAvg = getDailyAverage();
  const biggest = getBiggestPurchase();
  const incomeByMonth = getIncomeByMonth();
  const expenseByMonth = getExpenseByMonth();

  const totalExpense = categoryData.reduce((s, c) => s + c.amount, 0);
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

  return (
    <div className="page">
      <h2 style={{ marginBottom: 24 }}>📈 Статистика</h2>

      {categoryData.length > 0 && (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title">Расходы по категориям</div>
            <PieChart data={categoryData} />
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categoryData.slice(0, 5).map((c, i) => {
                const pct = (c.amount / totalExpense * 100).toFixed(0);
                return (
                  <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: ['#2481cc','#34c759','#ff9500','#ff3b30','#af52de'][i],
                    }} />
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--text-color)' }}>{c.category}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-color)' }}>{fmt(c.amount)} {currency}</span>
                    <span style={{ fontSize: 12, color: 'var(--hint-color)' }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {incomeByMonth.length > 1 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-title">Доходы по месяцам</div>
              <BarChart data={incomeByMonth} color="var(--green)" />
            </div>
          )}

          {expenseByMonth.length > 1 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-title">Расходы по месяцам</div>
              <BarChart data={expenseByMonth} color="var(--red)" />
            </div>
          )}
        </>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Общая статистика</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--hint-color)' }}>Всего операций</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{transactions.length}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--hint-color)' }}>Категорий</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>
              {new Set(transactions.map(t => t.category)).size}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--hint-color)' }}>Средний расход в день</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: 'var(--red)' }}>
              {fmt(dailyAvg)} {currency}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--hint-color)' }}>Самая большая покупка</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: 'var(--red)' }}>
              {biggest ? fmt(biggest.amount) : '—'} {currency}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
