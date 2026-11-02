import { $, formatCurrency, isVisible } from './utils.js';
import { formatMonthLabel, formatMonthShort } from './cycle.js';
import { ui } from './ui-state.js';
import {
  buildMonthlyData,
  buildGoalsAggregateByCycle,
  buildReserveBalanceByCycle,
  buildCategoryTotals,
  buildFlowSeries,
  buildReserveFlowSeries,
} from './selectors.js';

const charts = {};
const GRID = '#e1e7dd';
const MONO = { size: 10, family: 'IBM Plex Mono' };

function shortCurrency(v) {
  const abs = Math.abs(v);
  if (abs >= 1000) return (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k';
  return String(v);
}

export function destroyChart(id) {
  if (charts[id]) {
    try { charts[id].destroy(); } catch (e) {}
    delete charts[id];
  }
}

function box(canvas) {
  return canvas.closest('.chart-box');
}

function showEmpty(canvas, message) {
  destroyChart(canvas.id);
  canvas.style.display = 'none';
  const parent = box(canvas);
  let el = parent.querySelector('.chart-empty');
  if (!el) {
    el = document.createElement('div');
    el.className = 'chart-empty';
    parent.appendChild(el);
  }
  el.textContent = message;
}

function hideEmpty(canvas) {
  canvas.style.display = '';
  box(canvas)?.querySelector('.chart-empty')?.remove();
}

function baseOptions({ legend = true, money = true } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    animation: { duration: 300 },
    plugins: {
      legend: legend
        ? { labels: { boxWidth: 12, boxHeight: 12, padding: 10, font: { size: 11, family: 'IBM Plex Sans' } } }
        : { display: false },
      tooltip: {
        callbacks: money
          ? { label: ctx => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` }
          : {},
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: GRID, drawTicks: false },
        border: { display: false },
        ticks: { font: MONO, padding: 6, maxTicksLimit: 5, callback: shortCurrency },
      },
      x: {
        grid: { display: false },
        border: { color: GRID },
        ticks: { font: { size: 10 }, maxRotation: 0, autoSkipPadding: 12 },
      },
    },
  };
}

function area(color) {
  return {
    borderColor: color,
    backgroundColor: color + '26',
    fill: true,
    tension: 0.35,
    borderWidth: 2,
    pointRadius: 3,
    pointBackgroundColor: color,
    pointHoverRadius: 5,
  };
}

function linha(color) {
  return {
    borderColor: color,
    fill: false,
    tension: 0.35,
    borderWidth: 2,
    pointRadius: 3,
    pointBackgroundColor: color,
    pointHoverRadius: 5,
  };
}

function dashed(color) {
  return {
    borderColor: color,
    borderDash: [6, 5],
    fill: false,
    tension: 0.35,
    borderWidth: 2,
    pointRadius: 3,
    pointBackgroundColor: color,
  };
}

function lineChart(canvas, labels, datasets, options) {
  hideEmpty(canvas);
  destroyChart(canvas.id);
  charts[canvas.id] = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels, datasets },
    options: options || baseOptions(),
  });
}

export function renderAllCharts() {
  const data = buildMonthlyData();
  const labels = data.map(d => formatMonthShort(d.name));

  renderFlowChart();
  renderGoalsChart(data, labels);
  renderGrowthChart(data, labels);
}

export function renderFlowChart() {
  const canvas = $('homeChart');
  if (!canvas || !isVisible(canvas.closest('.tab-content'))) return;

  const serie = buildFlowSeries();
  if (!serie.length) { showEmpty(canvas, 'Registre sua primeira entrada para ver o fluxo mensal.'); return; }

  const temProjecao = serie.some(d => d.projEntradas !== null || d.projSaidas !== null);
  const datasets = [
    { label: 'Entradas', data: serie.map(d => d.entradas), ...area('#16a34a') },
    { label: 'Saídas', data: serie.map(d => d.gastos), ...linha('#dc2626') },
  ];
  if (temProjecao) {
    datasets.push(
      { label: 'Entradas previstas', data: serie.map(d => d.projEntradas), ...dashed('#16a34a') },
      { label: 'Saídas previstas', data: serie.map(d => d.projSaidas), ...dashed('#dc2626') },
    );
  }

  lineChart(canvas, serie.map(d => formatMonthShort(d.name)), datasets);
}

export function renderGoalsChart(data = buildMonthlyData(), labels) {
  const canvas = $('reserveGoalsChart');
  if (!canvas || !isVisible(canvas.closest('.tab-content'))) return;
  if (!data.length) { showEmpty(canvas, 'Sem movimentações para acompanhar.'); return; }

  const goals = buildGoalsAggregateByCycle(data);
  if (!goals.some(g => g.target > 0)) {
    showEmpty(canvas, 'Nenhuma meta ativa. Ative uma meta em alguma reserva.');
    return;
  }

  lineChart(canvas, labels || data.map(d => formatMonthShort(d.name)), [
    { label: 'Guardado', data: buildReserveBalanceByCycle(data), ...area('#16a34a') },
    { label: 'Meta agregada', data: goals.map(g => g.target), ...dashed('#7c3aed') },
  ]);
}

export function renderGrowthChart(data = buildMonthlyData(), labels) {
  const canvas = $('reserveGrowthChart');
  if (!canvas || !isVisible(canvas.closest('.tab-content'))) return;
  if (!data.length) { showEmpty(canvas, 'Sem movimentações para comparar.'); return; }

  lineChart(canvas, labels || data.map(d => formatMonthShort(d.name)), [
    { label: 'Guardado', data: data.map(d => d.crescimento), ...area('#16a34a') },
    { label: 'Resgates', data: data.map(d => d.resgates), ...dashed('#ea580c') },
  ]);
}

export function renderReserveDetailChart(reserveId) {
  const canvas = $('reserveDetailChart');
  if (!canvas || !isVisible(canvas.closest('.tab-content'))) return;

  const serie = buildReserveFlowSeries(reserveId);
  const temMovimento = serie.some(s => s.crescimento || s.resgates || s.projGuardar !== null);
  if (!temMovimento) {
    showEmpty(canvas, 'Esta reserva ainda não tem movimentações.');
    return;
  }

  const temProjecao = serie.some(s => s.projGuardar !== null || s.projResgatar !== null);
  const datasets = [
    { label: 'Guardado', data: serie.map(s => s.crescimento), ...area('#16a34a') },
    { label: 'Resgates', data: serie.map(s => s.resgates), ...linha('#ea580c') },
  ];
  if (temProjecao) {
    datasets.push(
      { label: 'Guardar previsto', data: serie.map(s => s.projGuardar), ...dashed('#16a34a') },
      { label: 'Resgate previsto', data: serie.map(s => s.projResgatar), ...dashed('#ea580c') },
    );
  }

  lineChart(canvas, serie.map(s => formatMonthShort(s.name)), datasets);
}

export function renderMonthFluxChart(monthData) {
  const canvas = $('monthFluxChart');
  if (!canvas) return;
  hideEmpty(canvas);
  destroyChart('monthFluxChart');
  charts['monthFluxChart'] = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Entradas', 'Saídas'],
      datasets: [{
        label: 'Fluxo',
        data: [monthData.entradas, monthData.gastos],
        backgroundColor: ['#16a34a', '#dc2626'],
        borderRadius: 8,
        barPercentage: 0.55,
      }],
    },
    options: {
      ...baseOptions({ legend: false }),
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => formatCurrency(ctx.raw) } },
      },
    },
  });
}

export function renderBalanceBarsChart(data) {
  const canvas = $('balanceBarsChart');
  if (!canvas) return;
  if (!data.length) { showEmpty(canvas, 'Sem dados no período.'); return; }
  hideEmpty(canvas);

  const saldos = data.map(d => d.saldo);
  destroyChart('balanceBarsChart');
  charts['balanceBarsChart'] = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: data.map(d => formatMonthShort(d.name)),
      datasets: [{
        label: 'Saldo',
        data: saldos,
        backgroundColor: saldos.map(s => (s >= 0 ? '#16a34a' : '#dc2626')),
        borderRadius: 6,
        barPercentage: 0.62,
        categoryPercentage: 0.85,
      }],
    },
    options: {
      ...baseOptions({ legend: false }),
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => formatMonthLabel(data[items[0].dataIndex].name),
            label: ctx => 'Saldo: ' + (ctx.raw >= 0 ? '+' : '') + formatCurrency(ctx.raw),
          },
        },
      },
      scales: {
        y: {
          grid: {
            color: ctx => (ctx.tick.value === 0 ? '#1a1f1a' : GRID),
            lineWidth: ctx => (ctx.tick.value === 0 ? 1.5 : 1),
            drawTicks: false,
          },
          border: { display: false },
          ticks: { font: MONO, padding: 6, maxTicksLimit: 5, callback: v => (v > 0 ? '+' : '') + shortCurrency(v) },
        },
        x: { grid: { display: false }, border: { color: GRID }, ticks: { font: { size: 10 }, maxRotation: 0, autoSkipPadding: 8 } },
      },
    },
  });
}

export function renderCategoriesChart() {
  const canvas = $('categoriesChart');
  if (!canvas || !ui.selectedMonth) return;

  const totals = buildCategoryTotals(ui.selectedMonth, ui.selectedCategoryType);
  const isEntry = ui.selectedCategoryType === 'ENTRY';
  if (!totals.length) {
    showEmpty(canvas, `Nenhuma ${isEntry ? 'entrada' : 'saída'} categorizada neste mês.`);
    return;
  }
  hideEmpty(canvas);

  const horizontal = totals.length > 4;
  box(canvas).style.height = horizontal ? Math.min(430, 70 + totals.length * 40) + 'px' : '';

  destroyChart('categoriesChart');
  charts['categoriesChart'] = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: totals.map(t => t.name),
      datasets: [{
        label: isEntry ? 'Entradas' : 'Saídas',
        data: totals.map(t => t.total),
        backgroundColor: totals.map(t => t.color),
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.85,
      }],
    },
    options: {
      ...baseOptions({ legend: false }),
      indexAxis: horizontal ? 'y' : 'x',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => (isEntry ? '+' : '−') + formatCurrency(ctx.raw) } },
      },
      scales: horizontal
        ? {
            x: { beginAtZero: true, grid: { color: GRID, drawTicks: false }, border: { display: false }, ticks: { font: MONO, maxTicksLimit: 4, callback: shortCurrency } },
            y: { grid: { display: false }, border: { color: GRID }, ticks: { font: { size: 11, weight: '600' } } },
          }
        : baseOptions({ legend: false }).scales,
    },
  });
}
