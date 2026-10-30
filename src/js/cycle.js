import { state } from './state.js';

export function getCycleRange(day) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  let start = new Date(y, m, day);
  let end = new Date(y, m + 1, day);
  end.setDate(end.getDate() - 1);
  if (now < start) {
    start = new Date(y, m - 1, day);
    end = new Date(y, m, day);
    end.setDate(end.getDate() - 1);
  }
  return { start, end };
}

export function getFinancialCycle(date) {
  const d = new Date(date);
  const day = state.cycleStartDay || 6;
  let year = d.getFullYear();
  let month = d.getMonth();
  if (d.getDate() < day) {
    month -= 1;
    if (month < 0) { month = 11; year -= 1; }
  }
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function formatMonthLabel(cycleKey) {
  const [y, m] = cycleKey.split('-');
  const date = new Date(parseInt(y), parseInt(m) - 1, 1);
  const label = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatMonthShort(cycleKey) {
  const [y, m] = cycleKey.split('-');
  const date = new Date(parseInt(y), parseInt(m) - 1, 1);
  const label = date.toLocaleString('pt-BR', { month: 'short' });
  return label.replace('.', '') + '/' + String(y).slice(2);
}
