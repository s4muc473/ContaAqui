import { state } from './state.js';
import { getFinancialCycle } from './cycle.js';

export function getCategoryById(id) {
  return state.categories.find(c => c.id === id) || null;
}

export function getCategoriesByType(type) {
  return state.categories.filter(c => c.type === type);
}

export function getReserveById(id) {
  return state.reserves.find(r => r.id === id) || null;
}

export function totalReserves() {
  return state.reserves.reduce((a, r) => a + (r.currentBalance || 0), 0);
}

export function goalIsActiveInCycle(goal, cycleKey) {
  if (!goal || !goal.enabled) return false;
  if (goal.startCycle && cycleKey < goal.startCycle) return false;
  if (goal.endCycle && cycleKey > goal.endCycle) return false;
  return true;
}

export function computeGoalProgress(entity) {
  if (!entity.goal || !entity.goal.enabled) return null;
  const target = Number(entity.goal.targetAmount) || 0;
  if (target <= 0) return null;
  const current = Number(entity.currentBalance) || 0;
  return {
    target,
    current,
    pct: Math.min(100, Math.round((current / target) * 100)),
    remaining: Math.max(0, target - current),
    reached: current >= target,
    over: current > target,
  };
}

export function buildMonthlyData() {
  const cycles = {};
  state.transactions.forEach(t => {
    const cycle = getFinancialCycle(new Date(t.date));
    if (!cycles[cycle]) cycles[cycle] = { name: cycle, entradas: 0, gastos: 0, crescimento: 0, resgates: 0, economia: 0, saldo: 0 };
    const c = cycles[cycle];
    if (t.type === 'ENTRY') c.entradas += t.amount;
    else if (t.type === 'EXPENSE') c.gastos += t.amount;
    else if (t.type === 'ALLOCATION') c.crescimento += t.amount;
    else if (t.type === 'RESERVE_RESCUE') c.resgates += t.amount;
  });
  Object.values(cycles).forEach(c => {
    c.saldo = c.entradas - c.gastos;
    c.economia = Math.max(0, c.crescimento - c.resgates);
  });
  return Object.values(cycles)
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(c => c.entradas > 0 || c.gastos > 0 || c.crescimento > 0 || c.resgates > 0);
}

export function buildGoalsAggregateByCycle(cycles) {
  return cycles.map(c => {
    let target = 0;
    state.reserves.forEach(r => {
      if (goalIsActiveInCycle(r.goal, c.name)) target += Number(r.goal.targetAmount) || 0;
    });
    return { cycle: c.name, target };
  });
}

export function buildReserveBalanceByCycle(cycles) {
  return cycles.map(c => {
    let total = 0;
    state.transactions.forEach(t => {
      if (getFinancialCycle(new Date(t.date)) > c.name) return;
      if (t.type === 'ALLOCATION') total += t.amount;
      if (t.type === 'RESERVE_RESCUE') total -= t.amount;
    });
    return Math.max(0, total);
  });
}

export function reserveTransactions(reserveId) {
  return state.transactions
    .filter(t => (t.type === 'ALLOCATION' && t.toId === reserveId) || (t.type === 'RESERVE_RESCUE' && t.fromId === reserveId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function buildReserveCycleSeries(reserveId, cycles) {
  return cycles.map(c => {
    let crescimento = 0;
    let resgates = 0;
    state.transactions.forEach(t => {
      if (getFinancialCycle(new Date(t.date)) !== c.name) return;
      if (t.type === 'ALLOCATION' && t.toId === reserveId) crescimento += t.amount;
      if (t.type === 'RESERVE_RESCUE' && t.fromId === reserveId) resgates += t.amount;
    });
    return { crescimento, resgates };
  });
}

export function buildCategoryTotals(monthKey, type) {
  const totals = {};
  state.transactions.forEach(t => {
    if (t.type !== type) return;
    if (getFinancialCycle(new Date(t.date)) !== monthKey) return;
    const catId = t.categoryId || '__none__';
    totals[catId] = (totals[catId] || 0) + t.amount;
  });
  return Object.keys(totals).map(catId => {
    const cat = catId === '__none__' ? null : getCategoryById(catId);
    return { id: catId, name: cat ? cat.name : 'Sem categoria', color: cat ? cat.color : '#94a3b8', total: totals[catId] };
  }).sort((a, b) => b.total - a.total);
}
