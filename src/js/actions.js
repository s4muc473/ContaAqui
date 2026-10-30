import { state, setState, newGoal, migrateState, isValidState, saveState } from './state.js';
import { $, generateId, formatCurrency, showToast, isVisible } from './utils.js';
import { getFinancialCycle, formatMonthLabel } from './cycle.js';
import { getReserveById } from './selectors.js';
import { ui } from './ui-state.js';
import { renderAll, renderHistory, renderReports, renderMesEditList, renderSelectedMonthReport } from './render.js';
import { renderAllCharts } from './charts.js';

const CATEGORY_COLORS = {
  ENTRY: ['#15803d', '#16a34a', '#0d9488', '#14b8a6', '#22c55e'],
  EXPENSE: ['#ea580c', '#dc2626', '#f97316', '#b45309', '#db2777'],
};

function dateFrom(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr + 'T12:00:00');
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return now.toISOString();
  return d.toISOString();
}

export function addEntry(amount, description, categoryId, dateStr) {
  if (!amount || amount <= 0) { showToast('Valor inválido'); return false; }
  state.transactions.push({
    id: generateId(), amount, date: dateFrom(dateStr),
    type: 'ENTRY', description: description || 'Entrada', categoryId: categoryId || undefined,
  });
  state.account += amount;
  renderAll();
  showToast(`Entrada de ${formatCurrency(amount)} registrada!`);
  return true;
}

export function addExpense(amount, description, categoryId, dateStr) {
  if (!amount || amount <= 0) { showToast('Valor inválido'); return false; }
  if (state.account < amount) { showToast('Saldo insuficiente na conta.'); return false; }
  state.transactions.push({
    id: generateId(), amount, date: dateFrom(dateStr),
    type: 'EXPENSE', description: description || 'Saída', categoryId: categoryId || undefined,
  });
  state.account -= amount;
  renderAll();
  showToast(`Saída de ${formatCurrency(amount)} registrada!`);
  return true;
}

export function depositToReserve(reserveId, amount) {
  if (!reserveId) { showToast('Selecione uma reserva'); return false; }
  if (!amount || amount <= 0) { showToast('Valor inválido'); return false; }
  const reserve = getReserveById(reserveId);
  if (!reserve) { showToast('Reserva não encontrada'); return false; }
  if (state.account < amount) { showToast('Saldo insuficiente na conta.'); return false; }

  state.account -= amount;
  reserve.currentBalance = (reserve.currentBalance || 0) + amount;
  state.transactions.push({
    id: generateId(), amount, date: new Date().toISOString(),
    type: 'ALLOCATION', description: `Guardado em ${reserve.name}`,
    toId: reserve.id, label: reserve.name,
  });
  renderAll();
  showToast(`${formatCurrency(amount)} guardado em ${reserve.name}`);
  return true;
}

export function rescueFromReserve(reserveId, amount) {
  if (!reserveId) { showToast('Selecione uma reserva'); return false; }
  if (!amount || amount <= 0) { showToast('Valor inválido'); return false; }
  const reserve = getReserveById(reserveId);
  if (!reserve) { showToast('Reserva não encontrada'); return false; }
  if (reserve.currentBalance < amount) { showToast('Saldo insuficiente na reserva'); return false; }

  reserve.currentBalance -= amount;
  state.account += amount;
  state.transactions.push({
    id: generateId(), amount, date: new Date().toISOString(),
    type: 'RESERVE_RESCUE', description: `Resgate de ${reserve.name}`,
    fromId: reserve.id, label: reserve.name,
  });
  renderAll();
  showToast(`Resgate de ${formatCurrency(amount)} realizado!`);
  return true;
}

export function addHistoricalAdjustment(type, amount, dateStr, description, categoryId) {
  if (!amount || amount <= 0) { showToast('Valor inválido'); return false; }
  if (!dateStr) { showToast('Informe a data'); return false; }
  const date = new Date(dateStr + 'T12:00:00');
  if (getFinancialCycle(date) !== ui.selectedMonth) {
    showToast('A data precisa pertencer ao ciclo ' + formatMonthLabel(ui.selectedMonth) + '.');
    return false;
  }
  state.transactions.push({
    id: generateId(), amount, date: date.toISOString(),
    type, description, categoryId: categoryId || undefined,
    historicalAdjustment: true, label: 'Ajuste histórico',
  });
  saveState();
  renderMesEditList();
  renderAllCharts();
  renderHistory();
  renderReports();
  if (isVisible($('tabReports'))) renderSelectedMonthReport();
  showToast('Ajuste histórico adicionado!');
  return true;
}

export function updateTransaction(txId, amount, description, categoryId, dateStr) {
  const t = state.transactions.find(x => x.id === txId);
  if (!t) return true;
  if (!amount || amount <= 0) { showToast('Valor inválido'); return false; }
  if (!dateStr) { showToast('Data inválida'); return false; }

  const diff = amount - t.amount;
  if (!t.historicalAdjustment) {
    if (t.type === 'ENTRY') {
      if (state.account + diff < 0) { showToast('Não é possível reduzir: o dinheiro já foi usado.'); return false; }
      state.account += diff;
    } else if (t.type === 'EXPENSE') {
      if (state.account - diff < 0) { showToast('Saldo insuficiente para esse novo valor.'); return false; }
      state.account -= diff;
    }
  }

  t.amount = amount;
  t.description = description || t.description;
  t.categoryId = categoryId || undefined;
  const d = new Date(dateStr + 'T00:00:00');
  const hora = new Date(t.date);
  d.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
  t.date = d.toISOString();

  renderAll();
  showToast('Transação atualizada!');
  return true;
}

export function deleteTransaction(transactionId) {
  const t = state.transactions.find(tx => tx.id === transactionId);
  if (!t) return;

  if (!t.historicalAdjustment) {
    if (t.type === 'ENTRY') {
      state.account = Math.max(0, state.account - t.amount);
    } else if (t.type === 'EXPENSE') {
      state.account += t.amount;
    } else if (t.type === 'ALLOCATION') {
      const r = getReserveById(t.toId);
      if (r) r.currentBalance = Math.max(0, r.currentBalance - t.amount);
      state.account += t.amount;
    } else if (t.type === 'RESERVE_RESCUE') {
      const r = getReserveById(t.fromId);
      if (r) r.currentBalance += t.amount;
      state.account = Math.max(0, state.account - t.amount);
    }
  }

  state.transactions = state.transactions.filter(tx => tx.id !== transactionId);
  renderAll();
  showToast('Transação excluída!');
}

export function createReserve(name, color) {
  if (!name) { showToast('Nome obrigatório'); return false; }
  state.reserves.push({
    id: 'reserve-' + generateId(), name, currentBalance: 0,
    color: color || '#7c3aed', goal: newGoal(),
  });
  renderAll();
  showToast('Reserva criada!');
  return true;
}

export function updateReserve(reserveId, name, color) {
  const r = getReserveById(reserveId);
  if (!r) return false;
  if (name) r.name = name;
  if (color) r.color = color;
  renderAll();
  showToast('Reserva atualizada.');
  return true;
}

export function deleteReserve(reserveId) {
  const r = getReserveById(reserveId);
  if (!r) return;
  if (r.currentBalance > 0) state.account += r.currentBalance;
  state.transactions = state.transactions.filter(t => t.toId !== reserveId && t.fromId !== reserveId);
  state.reserves = state.reserves.filter(x => x.id !== reserveId);
  renderAll();
  showToast('Reserva excluída. O saldo voltou para a conta.');
}

export function createCategory(name, type) {
  if (!name) { showToast('Digite o nome da categoria'); return false; }
  const palette = CATEGORY_COLORS[type] || CATEGORY_COLORS.EXPENSE;
  state.categories.push({
    id: 'cat-' + generateId(), name, type,
    color: palette[Math.floor(Math.random() * palette.length)],
  });
  renderAll();
  showToast('Categoria criada!');
  return true;
}

export function deleteCategory(categoryId) {
  state.categories = state.categories.filter(c => c.id !== categoryId);
  renderAll();
  showToast('Categoria excluída!');
}

export function saveGoal(reserveId, enabled, targetAmount, startCycle, endCycle) {
  const reserve = getReserveById(reserveId);
  if (!reserve) return false;
  if (enabled && (!targetAmount || targetAmount <= 0)) { showToast('Informe um valor alvo > 0.'); return false; }
  if (enabled && !startCycle) { showToast('Informe o ciclo inicial.'); return false; }
  if (enabled && endCycle && endCycle < startCycle) { showToast('Ciclo final deve ser depois do inicial.'); return false; }
  reserve.goal = { enabled, targetAmount, startCycle, endCycle };
  renderAll();
  showToast(enabled ? 'Meta salva!' : 'Meta desativada.');
  return true;
}

export function setCycleDay(day) {
  if (!day || day < 1 || day > 28) { showToast('Dia entre 1 e 28'); return false; }
  state.cycleStartDay = day;
  renderAll();
  showToast('Dia do ciclo atualizado!');
  return true;
}

export function updateProfile(name, color) {
  state.profile = {
    name: name ?? state.profile.name,
    color: color || state.profile.color,
  };
  renderAll();
  showToast('Perfil atualizado.');
  return true;
}

export function applyImportedState(data) {
  if (!isValidState(data)) { showToast('JSON inválido: campos obrigatórios ausentes.'); return false; }
  setState(migrateState(data));
  renderAll();
  showToast('Dados importados com sucesso!');
  return true;
}
