import { useState } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { useTransactions } from './hooks/useTransactions';
import { useGoals } from './hooks/useGoals';
import { useProfile } from './hooks/useProfile';
import { getCurrency } from './shared/currencies';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import GoalsPage from './pages/GoalsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { user, ready } = useTelegram();
  const userId = String(user?.id || '1');
  const [page, setPage] = useState('home');

  const { profile, loading: profileLoading, updateProfile } = useProfile(userId);
  const cur = getCurrency(profile?.main_currency || 'RUB');

  const {
    transactions, loading: txLoading, error: txError,
    addTransaction, getStats, getCategoryStats,
    getDailyAverage, getBiggestPurchase,
    getIncomeByMonth, getExpenseByMonth,
  } = useTransactions(userId);

  const {
    goals, loading: goalsLoading, error: goalsError,
    addGoal, contribute, deleteGoal,
  } = useGoals(userId);

  if (txLoading || goalsLoading || profileLoading) {
    return (
      <div style={{
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--hint-color)', fontSize: 15,
      }}>
        Загрузка...
      </div>
    );
  }

  const pages = {
    home: (
      <HomePage
        user={user}
        transactions={transactions}
        getStats={getStats}
        addTransaction={addTransaction}
        onNavigate={setPage}
        currency={cur.symbol}
      />
    ),
    stats: (
      <StatsPage
        transactions={transactions}
        getCategoryStats={getCategoryStats}
        getDailyAverage={getDailyAverage}
        getBiggestPurchase={getBiggestPurchase}
        getIncomeByMonth={getIncomeByMonth}
        getExpenseByMonth={getExpenseByMonth}
        currency={cur.symbol}
      />
    ),
    goals: (
      <GoalsPage
        goals={goals}
        error={goalsError}
        addGoal={addGoal}
        contribute={contribute}
        deleteGoal={deleteGoal}
        currency={cur.symbol}
      />
    ),
    profile: (
      <ProfilePage
        user={user}
        transactions={transactions}
        getStats={getStats}
        profile={profile}
        updateProfile={updateProfile}
      />
    ),
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {pages[page] || pages.home}
      </div>
      <BottomNav active={page} onChange={setPage} />
    </div>
  );
}
