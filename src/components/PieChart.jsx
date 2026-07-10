import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#2481cc', '#34c759', '#ff9500', '#ff3b30', '#af52de',
  '#5ac8fa', '#ff2d55', '#5856d6', '#8e8e93', '#00c7be',
];

export default function PieChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map(d => d.category),
    datasets: [{
      data: data.map(d => d.amount),
      backgroundColor: COLORS.slice(0, data.length),
      borderWidth: 0,
    }],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(0);
            return `${ctx.label}: ${Math.round(ctx.parsed).toLocaleString('ru-RU')} ₽ (${pct}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: 200, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 200, height: 200 }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
