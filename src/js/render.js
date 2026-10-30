import { state, saveState } from './state.js';
import { $, formatCurrency, escapeHtml, isVisible, readableInk } from './utils.js';
import { getCycleRange, getFinancialCycle, formatMonthLabel } from './cycle.js';
import { ui } from './ui-state.js';
import {
  getCategoryById,
  getCategoriesByType,
  getReserveById,
  totalReserves,
  computeGoalProgress,
  goalIsActiveInCycle,
  buildMonthlyData,
  reserveTransactions,
} from './selectors.js';
import {
  renderAllCharts,
  renderMonthFluxChart,
  renderBalanceBarsChart,
  renderCategoriesChart,
  renderReserveDetailChart,
} from './charts.js';
import { deleteCategory } from './actions.js';
import { setDropdownOptions } from './dropdown.js';
import { showTab } from './nav.js';
import { openTxModal, openEditMesModal } from './modals.js';

const TX_STYLE = {
  ENTRY: { icon: 'arrow-down', kind: 'in', sign: '+', tone: 'positive' },
  EXPENSE: { icon: 'arrow-up', kind: 'out', sign: '−', tone: 'negative' },
  ALLOCATION: { icon: 'piggy-bank', kind: 'save', sign: '', tone: 'neutral' },
  RESERVE_RESCUE: { icon: 'hand-holding-dollar', kind: 'back', sign: '', tone: 'neutral' },
};

function goalProgressHtml(prog) {
  if (!prog) return '';
  return `
    <div class="goal-progress"><div class="bar${prog.over ? ' over' : ''}" style="width:${prog.pct}%"></div></div>
    <div class="goal-meta">
      <span>Meta: ${formatCurrency(prog.target)} · ${prog.pct}%</span>
      <span>${prog.reached ? '✓ atingida' : 'faltam ' + formatCurrency(prog.remaining)}</span>
    </div>`;
}

function goalBadgeHtml(prog) {
  if (!prog) return '';
  return `<span class="goal-badge${prog.reached ? ' reached' : ''}"><i class="fas fa-bullseye"></i> meta</span>`;
}

function emptyState(icon, text) {
  return `<div class="empty-state"><i class="fas fa-${icon}"></i>${text}</div>`;
}

export function renderAll() {
  saveState();
  renderProfile();
  renderAccount();
  renderHistory();
  renderReserveList();
  renderSettings();
  updateJsonTextarea();
  renderMonthFilter();

  if (ui.currentReserveId && isVisible($('tabReserveDetail'))) renderReserveDetail(ui.currentReserveId);
  if (isVisible($('tabReports'))) renderSelectedMonthReport();

  const modalMes = $('modalEditMes');
  if (modalMes.classList.contains('open') && ui.selectedMonth) renderMesEditList();

  renderAllCharts();
}

export function renderProfile() {
  const name = state.profile.name.trim();
  const root = document.documentElement.style;
  root.setProperty('--accent', state.profile.color);
  root.setProperty('--accent-ink', readableInk(state.profile.color));

  const avatar = $('avatarBtn');
  if (name) avatar.textContent = [...name][0].toUpperCase();
  else avatar.innerHTML = '<i class="fas fa-user"></i>';

  const greeting = $('profileName').parentElement;
  greeting.classList.toggle('no-name', !name);
  $('profileName').textContent = name || 'Olá!';
}

export function renderAccount() {
  $('accountBalance').textContent = formatCurrency(state.account);
  $('savedTotal').textContent = formatCurrency(totalReserves());
  $('reserveTotal').textContent = formatCurrency(totalReserves());

  const cycle = getCycleRange(state.cycleStartDay || 6);
  const sum = type => state.transactions
    .filter(t => t.type === type && new Date(t.date) >= cycle.start && new Date(t.date) <= cycle.end)
    .reduce((acc, t) => acc + t.amount, 0);
  $('totalEntries').textContent = formatCurrency(sum('ENTRY'));
  $('totalExpenses').textContent = formatCurrency(sum('EXPENSE'));
}

export function renderReports() {
  renderAccount();
}

function historyItemHtml(t) {
  const style = TX_STYLE[t.type] || TX_STYLE.ENTRY;
  const cat = t.categoryId ? getCategoryById(t.categoryId) : null;
  const label = t.label || t.budgetName;
  return `
    <button class="history-item" data-tx="${t.id}">
      <span class="history-icon ${style.kind}"><i class="fas fa-${style.icon}"></i></span>
      <span class="history-body">
        <span class="desc">${escapeHtml(t.description || t.type)}</span>
        <span class="history-meta">
          <span class="history-date">${new Date(t.date).toLocaleDateString('pt-BR')}</span>
          ${cat ? `<span class="history-tag" style="background:${cat.color}1f;color:${cat.color}">${escapeHtml(cat.name)}</span>` : ''}
          ${label ? `<span class="history-tag">${escapeHtml(label)}</span>` : ''}
        </span>
      </span>
      <span class="val ${style.tone}">${style.sign} ${formatCurrency(t.amount)}</span>
    </button>`;
}

function wireHistoryItems(container) {
  container.querySelectorAll('[data-tx]').forEach(btn => {
    btn.addEventListener('click', () => openTxModal(btn.dataset.tx));
  });
}

export function renderHistory() {
  const container = $('historyList');
  const filter = document.querySelector('#tabHistory .active-filter')?.dataset.filter || 'all';

  let list = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (filter !== 'all') list = list.filter(t => t.type === filter);

  if (!list.length) {
    container.innerHTML = emptyState('inbox', 'Nenhuma transação por aqui.');
    return;
  }
  container.innerHTML = list.map(historyItemHtml).join('');
  wireHistoryItems(container);
}

export function renderReserveList() {
  const container = $('reserveArea');
  if (!state.reserves.length) {
    container.innerHTML = emptyState('piggy-bank', 'Nenhuma reserva ainda. Crie a primeira abaixo.');
    return;
  }

  container.innerHTML = state.reserves.map(r => {
    const prog = computeGoalProgress(r);
    return `
      <button class="reserve-card" data-reserve="${r.id}">
        <span class="reserve-color" style="background:${r.color}"></span>
        <span class="info">
          <span class="name">${escapeHtml(r.name)} ${goalBadgeHtml(prog)}</span>
          <span class="balance">${formatCurrency(r.currentBalance)}</span>
          ${goalProgressHtml(prog)}
        </span>
        <i class="fas fa-chevron-right chev"></i>
      </button>`;
  }).join('');

  container.querySelectorAll('[data-reserve]').forEach(btn => {
    btn.addEventListener('click', () => openReserveDetail(btn.dataset.reserve));
  });
}

export function openReserveDetail(reserveId) {
  if (!getReserveById(reserveId)) return;
  ui.currentReserveId = reserveId;
  showTab('tabReserveDetail');
  renderReserveDetail(reserveId);
}

export function renderReserveDetail(reserveId) {
  const r = getReserveById(reserveId);
  if (!r) return;
  const prog = computeGoalProgress(r);

  $('reserveDetailHead').innerHTML = `
    <div class="reserve-head">
      <span class="name"><span class="reserve-color" style="background:${r.color}"></span>${escapeHtml(r.name)} ${goalBadgeHtml(prog)}</span>
      <span class="balance">${formatCurrency(r.currentBalance)}</span>
      ${goalProgressHtml(prog)}
    </div>`;

  const list = reserveTransactions(reserveId);
  const container = $('reserveDetailHistory');
  container.innerHTML = list.length
    ? list.map(historyItemHtml).join('')
    : emptyState('inbox', 'Nenhuma movimentação nesta reserva.');
  if (list.length) wireHistoryItems(container);

  renderReserveDetailChart(reserveId);
}

export function renderSettings() {
  const nameInput = $('settingsName');
  if (nameInput && document.activeElement !== nameInput) nameInput.value = state.profile.name;

  const colorInput = $('settingsColor');
  if (colorInput && document.activeElement !== colorInput) {
    colorInput.value = state.profile.color;
    $('settingsColorHex').textContent = state.profile.color;
  }

  const cycleInput = $('settingsCycleDay');
  if (cycleInput && document.activeElement !== cycleInput) cycleInput.value = state.cycleStartDay || 6;

  renderSettingsCategories();
}

function renderSettingsCategories() {
  const cList = $('settingsCatList');
  if (!state.categories.length) {
    cList.innerHTML = '<div class="cat-group-title">Nenhuma categoria criada.</div>';
    return;
  }

  cList.innerHTML = [['Entradas', 'ENTRY'], ['Saídas', 'EXPENSE']].map(([title, tipo]) => {
    const cats = getCategoriesByType(tipo);
    if (!cats.length) return '';
    return `
      <div class="cat-group-title"><i class="fas fa-${tipo === 'ENTRY' ? 'arrow-down' : 'arrow-up'}"></i> ${title}</div>
      ${cats.map(c => `
        <div class="category-item">
          <div class="cat-left">
            <span class="cat-dot" style="background:${c.color}"></span>
            <span class="cat-name">${escapeHtml(c.name)}</span>
          </div>
          <span class="cat-type">${tipo === 'ENTRY' ? 'entrada' : 'saída'}</span>
          <button class="cat-delete" data-del-cat="${c.id}" aria-label="Excluir ${escapeHtml(c.name)}"><i class="fas fa-trash"></i></button>
        </div>`).join('')}`;
  }).join('');

  cList.querySelectorAll('[data-del-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Excluir esta categoria?')) deleteCategory(btn.dataset.delCat);
    });
  });
}

export function updateJsonTextarea() {
  const ta = $('jsonTextarea');
  if (ta && document.activeElement !== ta) ta.value = JSON.stringify(state, null, 2);
}

export function renderMonthFilter() {
  const data = buildMonthlyData();
  const options = data.map(d => ({ value: d.name, label: formatMonthLabel(d.name) }));

  if (!options.length) ui.selectedMonth = '';
  else if (!options.some(o => o.value === ui.selectedMonth)) ui.selectedMonth = options[options.length - 1].value;

  setDropdownOptions('ddMonthFilter', options, ui.selectedMonth);
}

export function renderSelectedMonthReport() {
  const container = $('reportsContainer');
  if (!container) return;

  const data = buildMonthlyData();
  if (!data.length) {
    container.innerHTML = emptyState('chart-line', 'Nenhum dado para exibir ainda.');
    return;
  }

  const monthData = data.find(d => d.name === ui.selectedMonth);
  if (!monthData) {
    container.innerHTML = emptyState('calendar-xmark', 'Selecione um mês acima.');
    return;
  }

  container.innerHTML = `
    <div class="month-report-block">
      <div class="month-report-header">
        <h4>${formatMonthLabel(monthData.name)}</h4>
        <div class="month-totals">
          <span class="in"><i class="fas fa-arrow-down"></i> ${formatCurrency(monthData.entradas)}</span>
          <span class="out"><i class="fas fa-arrow-up"></i> ${formatCurrency(monthData.gastos)}</span>
        </div>
      </div>
      <div class="chart-box"><canvas id="monthFluxChart"></canvas></div>
      ${monthData.economia > 0 ? `<div class="month-economy-badge"><i class="fas fa-piggy-bank"></i> Guardado no ciclo: ${formatCurrency(monthData.economia)}</div>` : ''}
      <button class="mk-btn block sm" id="btn-edit-mes" style="margin-top:12px">
        <i class="fas fa-pen"></i> Editar entradas e saídas do mês
      </button>
    </div>
    ${goalsBlockHtml(monthData)}
    <div class="month-report-block">
      <div class="month-report-header"><h4><i class="fas fa-chart-bar" style="color:var(--info)"></i> Saldo mensal</h4></div>
      <div class="chart-box"><canvas id="balanceBarsChart"></canvas></div>
    </div>
    <div class="month-report-block">
      <div class="month-report-header"><h4><i class="fas fa-tags" style="color:var(--violet)"></i> Por categoria</h4></div>
      <div class="cat-type-toggle" id="catTypeToggle">
        <button data-type="EXPENSE" class="${ui.selectedCategoryType === 'EXPENSE' ? 'active' : ''}"><i class="fas fa-arrow-up"></i> Saídas</button>
        <button data-type="ENTRY" class="${ui.selectedCategoryType === 'ENTRY' ? 'active' : ''}"><i class="fas fa-arrow-down"></i> Entradas</button>
      </div>
      <div class="chart-box"><canvas id="categoriesChart"></canvas></div>
    </div>`;

  $('btn-edit-mes').addEventListener('click', () => openEditMesModal(monthData.name));

  container.querySelectorAll('#catTypeToggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.selectedCategoryType = btn.dataset.type;
      container.querySelectorAll('#catTypeToggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCategoriesChart();
    });
  });

  renderMonthFluxChart(monthData);
  renderBalanceBarsChart(data);
  renderCategoriesChart();
}

function goalsBlockHtml(monthData) {
  const goals = state.reserves.filter(r => goalIsActiveInCycle(r.goal, monthData.name));
  if (!goals.length) return '';
  return `
    <div class="month-report-block">
      <div class="month-report-header"><h4><i class="fas fa-bullseye" style="color:var(--violet)"></i> Metas ativas no ciclo</h4></div>
      <div style="display:grid;gap:14px">
        ${goals.map(r => {
          const prog = computeGoalProgress(r);
          return `
            <div class="goal-row">
              <div class="top">
                <div class="who">
                  <span class="reserve-color" style="background:${r.color}"></span>
                  <strong>${escapeHtml(r.name)}</strong>
                </div>
                <span class="nums${prog.reached ? ' reached' : ''}">${formatCurrency(r.currentBalance)} / ${formatCurrency(prog.target)}</span>
              </div>
              <div class="goal-progress"><div class="bar${prog.over ? ' over' : ''}" style="width:${prog.pct}%"></div></div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

export function renderMesEditList() {
  const container = $('mesEditList');
  if (!container || !ui.selectedMonth) return;

  const lista = state.transactions
    .filter(t => (t.type === 'ENTRY' || t.type === 'EXPENSE') && getFinancialCycle(new Date(t.date)) === ui.selectedMonth)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!lista.length) {
    container.innerHTML = '<div class="mes-edit-vazio"><i class="fas fa-inbox"></i><br>Nenhuma entrada ou saída neste mês.</div>';
    return;
  }

  container.innerHTML = lista.map(t => {
    const isEntry = t.type === 'ENTRY';
    const cat = t.categoryId ? getCategoryById(t.categoryId) : null;
    return `
      <div class="mes-edit-linha">
        <div class="mes-edit-info">
          <div class="mes-edit-desc">${escapeHtml(t.description || (isEntry ? 'Entrada' : 'Saída'))}</div>
          <div class="mes-edit-meta">
            <span class="mes-edit-tipo ${isEntry ? 'entry' : 'expense'}">${isEntry ? 'Entrada' : 'Saída'}</span>
            ${t.historicalAdjustment ? '<span class="mes-edit-tipo" style="background:var(--warn-soft);color:var(--warn)">Ajuste</span>' : ''}
            ${cat ? `<span class="mes-edit-tipo" style="background:${cat.color}1f;color:${cat.color}">${escapeHtml(cat.name)}</span>` : ''}
            <span>${new Date(t.date).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <div>
          <div class="mes-edit-val ${isEntry ? 'pos' : 'neg'}">${isEntry ? '+' : '−'} ${formatCurrency(t.amount)}</div>
          <div class="mes-edit-acoes">
            <button data-edit-mes="${t.id}" aria-label="Editar"><i class="fas fa-pen"></i></button>
          </div>
        </div>
      </div>`;
  }).join('');

  container.querySelectorAll('[data-edit-mes]').forEach(btn => {
    btn.addEventListener('click', () => openTxModal(btn.dataset.editMes, true));
  });
}
