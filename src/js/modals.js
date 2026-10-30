import { state } from './state.js';
import { $, showToast, toISODateLocal, formatCurrency } from './utils.js';
import { formatMonthLabel } from './cycle.js';
import { ui } from './ui-state.js';
import { getCategoriesByType, getCategoryById, getReserveById } from './selectors.js';
import { setDropdownOptions, getDropdownValue, close as closeDropdown } from './dropdown.js';
import { renderMesEditList } from './render.js';
import { showTab } from './nav.js';
import {
  addEntry,
  addExpense,
  depositToReserve,
  rescueFromReserve,
  updateTransaction,
  deleteTransaction,
  createReserve,
  updateReserve,
  deleteReserve,
  saveGoal,
  addHistoricalAdjustment,
} from './actions.js';

const TX_LABEL = {
  ENTRY: 'Entrada',
  EXPENSE: 'Saída',
  ALLOCATION: 'Guardado em reserva',
  RESERVE_RESCUE: 'Resgate de reserva',
};

function openModal(id) {
  $(id).classList.add('open');
}

export function closeModal(id) {
  closeDropdown();
  $(id).classList.remove('open');
}

function categoryOptions(type) {
  return getCategoriesByType(type).map(c => ({ value: c.id, label: c.name, color: c.color }));
}

function reserveOptions() {
  return state.reserves.map(r => ({
    value: r.id,
    label: `${r.name} · ${formatCurrency(r.currentBalance)}`,
    color: r.color,
  }));
}

/* ---------- entrada / saída ---------- */

export function openMoneyModal(type) {
  ui.moneyType = type;
  const isEntry = type === 'ENTRY';
  $('modalMoneyTitle').textContent = isEntry ? 'Nova entrada' : 'Nova saída';
  $('moneyConfirm').textContent = isEntry ? 'Registrar entrada' : 'Registrar saída';
  $('moneyAmount').value = '';
  $('moneyDesc').value = '';
  $('moneyDesc').placeholder = isEntry ? 'Ex.: salário, freela' : 'Ex.: mercado, aluguel';
  $('moneyDate').value = toISODateLocal(new Date());
  setDropdownOptions('ddMoneyCategory', categoryOptions(type), '');
  openModal('modalMoney');
}

export function confirmMoney() {
  const amount = parseFloat($('moneyAmount').value);
  const description = $('moneyDesc').value.trim();
  const categoryId = getDropdownValue('ddMoneyCategory');
  const dateStr = $('moneyDate').value;

  const ok = ui.moneyType === 'ENTRY'
    ? addEntry(amount, description, categoryId, dateStr)
    : addExpense(amount, description, categoryId, dateStr);
  if (ok) closeModal('modalMoney');
}

/* ---------- guardar / resgatar ---------- */

export function openMoveModal(direction, reserveId) {
  if (!state.reserves.length) { showToast('Crie uma reserva primeiro.'); return; }

  ui.moveDirection = direction;
  ui.moveReserveLocked = !!reserveId;
  const isSave = direction === 'save';

  $('modalMoveTitle').textContent = isSave ? 'Guardar na reserva' : 'Resgatar da reserva';
  $('modalMoveSub').textContent = isSave
    ? `Disponível na conta: ${formatCurrency(state.account)}`
    : 'O valor volta para a conta.';
  $('moveConfirm').textContent = isSave ? 'Guardar' : 'Resgatar';
  $('moveAmount').value = '';

  setDropdownOptions('ddMoveReserve', reserveOptions(), reserveId || state.reserves[0].id);
  openModal('modalMove');
}

export function confirmMove() {
  const reserveId = getDropdownValue('ddMoveReserve');
  const amount = parseFloat($('moveAmount').value);
  const ok = ui.moveDirection === 'save'
    ? depositToReserve(reserveId, amount)
    : rescueFromReserve(reserveId, amount);
  if (ok) closeModal('modalMove');
}

/* ---------- detalhe / edição de transação ---------- */

export function openTxModal(txId, fromMesModal) {
  const t = state.transactions.find(x => x.id === txId);
  if (!t) return;

  ui.editingTxId = txId;
  const editable = t.type === 'ENTRY' || t.type === 'EXPENSE';
  const cat = t.categoryId ? getCategoryById(t.categoryId) : null;

  $('txTitle').textContent = TX_LABEL[t.type] || 'Transação';
  $('txDetail').innerHTML = `
    <div class="row"><span>Valor</span><span>${formatCurrency(t.amount)}</span></div>
    <div class="row"><span>Data</span><span>${new Date(t.date).toLocaleDateString('pt-BR')}</span></div>
    ${cat ? `<div class="row"><span>Categoria</span><span>${cat.name}</span></div>` : ''}
    ${t.label || t.budgetName ? `<div class="row"><span>Origem</span><span>${t.label || t.budgetName}</span></div>` : ''}
    ${t.historicalAdjustment ? '<div class="row"><span>Tipo</span><span>Ajuste histórico</span></div>' : ''}`;

  $('txEditFields').hidden = !editable;
  $('txConfirm').hidden = !editable;

  if (editable) {
    $('txAmount').value = t.amount;
    $('txDesc').value = t.description || '';
    $('txDate').value = toISODateLocal(t.date);
    setDropdownOptions('ddTxCategory', categoryOptions(t.type), t.categoryId || '');
  }

  $('modalTx').classList.toggle('top-modal', !!fromMesModal);
  openModal('modalTx');
}

export function confirmTx() {
  const amount = parseFloat($('txAmount').value);
  const description = $('txDesc').value.trim();
  const categoryId = getDropdownValue('ddTxCategory');
  const dateStr = $('txDate').value;
  if (updateTransaction(ui.editingTxId, amount, description, categoryId, dateStr)) closeTxModal();
}

export function deleteTx() {
  if (!confirm('Excluir esta transação? O saldo será revertido.')) return;
  deleteTransaction(ui.editingTxId);
  closeTxModal();
}

export function closeTxModal() {
  closeModal('modalTx');
  ui.editingTxId = null;
}

/* ---------- reserva ---------- */

export function openReserveModal(reserveId) {
  const r = reserveId ? getReserveById(reserveId) : null;
  ui.editingReserveId = r ? r.id : null;

  $('modalReserveTitle').textContent = r ? 'Editar reserva' : 'Nova reserva';
  $('reserveName').value = r ? r.name : '';
  $('reserveColor').value = r ? r.color : '#7c3aed';
  $('reserveColorHex').textContent = $('reserveColor').value;
  $('reserveDelete').hidden = !r;
  openModal('modalReserve');
}

export function confirmReserve() {
  const name = $('reserveName').value.trim();
  const color = $('reserveColor').value;
  if (!name) { showToast('Nome obrigatório'); return; }
  const ok = ui.editingReserveId
    ? updateReserve(ui.editingReserveId, name, color)
    : createReserve(name, color);
  if (ok) closeModal('modalReserve');
}

export function deleteReserveFromModal() {
  const r = getReserveById(ui.editingReserveId);
  if (!r) return;
  if (!confirm(`Excluir a reserva "${r.name}"? O saldo guardado volta para a conta.`)) return;
  deleteReserve(r.id);
  closeModal('modalReserve');
  ui.currentReserveId = null;
  showTab('tabReserve');
}

/* ---------- meta ---------- */

export function openGoalModal(reserve) {
  ui.editingReserveId = reserve.id;
  const g = reserve.goal || { enabled: false, targetAmount: 0, startCycle: '', endCycle: '' };
  $('editGoalTitle').textContent = 'Meta da reserva';
  $('editGoalSub').textContent = reserve.name;
  $('editGoalEnabled').checked = !!g.enabled;
  $('editGoalTarget').value = g.targetAmount || '';
  $('editGoalStart').value = g.startCycle || '';
  $('editGoalEnd').value = g.endCycle || '';
  $('editGoalFields').style.display = g.enabled ? 'block' : 'none';
  openModal('modalEditGoal');
}

export function confirmGoal() {
  if (!ui.editingReserveId) return;
  const ok = saveGoal(
    ui.editingReserveId,
    $('editGoalEnabled').checked,
    parseFloat($('editGoalTarget').value) || 0,
    $('editGoalStart').value || '',
    $('editGoalEnd').value || '',
  );
  if (ok) closeModal('modalEditGoal');
}

/* ---------- editor do mês ---------- */

export function openEditMesModal(mesKey) {
  if (!mesKey) { showToast('Selecione um mês primeiro.'); return; }
  ui.selectedMonth = mesKey;
  $('editMesTitle').textContent = 'Editar ' + formatMonthLabel(mesKey);
  $('editMesSub').textContent = 'Edite, exclua ou crie ajustes históricos. Nada aqui afeta o saldo da conta.';

  const [y, m] = mesKey.split('-');
  const dia = Math.min(Math.max(15, state.cycleStartDay || 6), 28);
  $('mesAddDate').value = toISODateLocal(new Date(Number(y), Number(m) - 1, dia));
  $('mesAddAmount').value = '';
  $('mesAddDesc').value = '';

  ui.mesAddTipo = 'ENTRY';
  document.querySelectorAll('#mesAddTipoToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.tipo === 'ENTRY');
  });
  fillMesAddCategories();
  renderMesEditList();
  openModal('modalEditMes');
}

export function fillMesAddCategories() {
  setDropdownOptions('ddMesAddCategory', categoryOptions(ui.mesAddTipo), '');
}

export function addMesAdjustment() {
  const amount = parseFloat($('mesAddAmount').value);
  const dateStr = $('mesAddDate').value;
  const description = $('mesAddDesc').value.trim()
    || (ui.mesAddTipo === 'ENTRY' ? 'Ajuste de entrada' : 'Ajuste de saída');
  const categoryId = getDropdownValue('ddMesAddCategory');

  if (addHistoricalAdjustment(ui.mesAddTipo, amount, dateStr, description, categoryId)) {
    $('mesAddAmount').value = '';
    $('mesAddDesc').value = '';
    setDropdownOptions('ddMesAddCategory', categoryOptions(ui.mesAddTipo), '');
  }
}
