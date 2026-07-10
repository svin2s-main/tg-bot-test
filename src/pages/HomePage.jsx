import { useState } from 'react';
import BalanceCard from '../components/BalanceCard';
import ActionButton from '../components/ActionButton';
import TransactionCard from '../components/TransactionCard';
import EmptyState from '../components/EmptyState';
import AddTransactionModal from '../components/AddTransactionModal';

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

export default function HomePage({ user, transactions, getStats, addTransaction, onNavigate, currency = '₽' }) {
  const [modalType, setModalType] = useState(null);
  const stats = getStats();
  const today = new Date();
  const dateStr = `${today.getDate()} ${MONTHS[today.getMonth()]} ${today.getFullYear()}`;
  const recent = transactions.slice(0, 5);

  const handleSave = (data) => {
    addTransaction(data);
    setModalType(null);
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: 'var(--hint-color)', marginBottom: 2 }}>
          👋 Привет
        </div>
        <h2 style={{ fontWeight: 700 }}>
          {user?.first_name || 'Пользователь'}
        </h2>
        <div style={{ fontSize: 13, color: 'var(--hint-color)', marginTop: 2 }}>
          {dateStr}
        </div>
      </div>

      <BalanceCard
        balance={stats.balance}
        income={stats.totalIncome}
        expense={stats.totalExpense}
        currency={currency}
      />

      <div className="card-title mt-24 mb-8">Быстрые действия</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <ActionButton icon="➕" label="Доход" onClick={() => setModalType('income')} />
        <ActionButton icon="➖" label="Расход" onClick={() => setModalType('expense')} />
        <ActionButton icon="📊" label="Статистика" onClick={() => onNavigate('stats')} />
        <ActionButton icon="🎯" label="Цели" onClick={() => onNavigate('goals')} />
      </div>

      <div className="card-title mt-24 mb-8">Последние операции</div>

      {recent.length === 0 ? (
        <EmptyState onAdd={() => setModalType('expense')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recent.map(tx => (
            <TransactionCard key={tx.id} {...tx} currency={currency} />
          ))}
        </div>
      )}

      {modalType && (
        <AddTransactionModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
