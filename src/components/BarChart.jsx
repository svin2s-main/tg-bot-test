import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const MONTH_NAMES = {
  '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр',
  '05': 'Май', '06': 'Июн', '07': 'Июл', '08': 'Авг',
  '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек',
};

export default function BarChart({ data, label, color }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => {
      const m = d.month.slice(5);
      return MONTH_NAMES[m] || m;
    }),
    datasets: [{
      label: label || '',
      data: data.map(d => d.amount),
      backgroundColor: color || 'var(--accent)',
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${Math.round(ctx.parsed.y).toLocaleString('ru-RU')} ₽`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'var(--hint-color)', font: { size: 11 } },
      },
      y: {
        grid: { color: 'var(--secondary-bg)' },
        ticks: {
          color: 'var(--hint-color)',
          font: { size: 11 },
          callback: (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: 200 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
