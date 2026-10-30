import { SCHEMA_VERSION, newGoal } from './state.js';

const CYCLE_START_DAY = 6;
const CYCLES = 5;

const RESERVES = [
  { id: 'reserve-emergency', name: 'Reserva de Emergência', color: '#7c3aed', meta: 20000 },
  { id: 'reserve-trip', name: 'Viagem de Férias', color: '#0369a1', meta: 8000 },
];

const CATEGORIES = [
  { id: 'cat-salario', name: 'Salário', type: 'ENTRY', color: '#15803d' },
  { id: 'cat-extra', name: 'Renda Extra', type: 'ENTRY', color: '#16a34a' },
  { id: 'cat-moradia', name: 'Moradia', type: 'EXPENSE', color: '#dc2626' },
  { id: 'cat-mercado', name: 'Mercado', type: 'EXPENSE', color: '#ea580c' },
  { id: 'cat-transporte', name: 'Transporte', type: 'EXPENSE', color: '#b45309' },
  { id: 'cat-alimentacao', name: 'Alimentação', type: 'EXPENSE', color: '#f97316' },
  { id: 'cat-saude', name: 'Saúde', type: 'EXPENSE', color: '#0d9488' },
  { id: 'cat-assinaturas', name: 'Assinaturas', type: 'EXPENSE', color: '#7c3aed' },
  { id: 'cat-lazer', name: 'Lazer', type: 'EXPENSE', color: '#db2777' },
];

const SALARIO = 7200;
const FREELAS = [0, 1500, 0, 1500, 0];

const GUARDADOS = [
  { reserve: 'reserve-emergency', valor: 900 },
  { reserve: 'reserve-trip', valor: 400 },
];

const SAIDAS = [
  { cat: 'cat-moradia', desc: 'Aluguel', dia: 8, valores: [1850, 1850, 1850, 1920, 1920] },
  { cat: 'cat-moradia', desc: 'Conta de luz', dia: 12, valores: [168, 201, 187, 243, 196] },
  { cat: 'cat-moradia', desc: 'Internet', dia: 12, valores: [120, 120, 120, 120, 129] },
  { cat: 'cat-assinaturas', desc: 'Celular', dia: 15, valores: [70, 70, 70, 70, 70] },
  { cat: 'cat-mercado', desc: 'Mercado do mês', dia: 8, valores: [812, 768, 845, 903, 874] },
  { cat: 'cat-transporte', desc: 'Combustível', dia: 15, valores: [260, 310, 245, 288, 272] },
  { cat: 'cat-saude', desc: 'Farmácia', dia: 18, valores: [140, 96, 210, 88, 154] },
  { cat: 'cat-alimentacao', desc: 'Delivery e lanches', dia: 22, valores: [186, 224, 198, 251, 167] },
  { cat: 'cat-lazer', desc: 'Cinema', dia: 18, valores: [92, 0, 96, 0, 104] },
  { cat: 'cat-assinaturas', desc: 'Streaming', dia: 22, valores: [55, 55, 55, 65, 65] },
  { cat: 'cat-lazer', desc: 'Restaurante', dia: 25, valores: [0, 318, 0, 274, 0] },
];

let seq = 0;
function demoId() {
  seq += 1;
  return 'demo-' + String(seq).padStart(3, '0');
}

function currentCycleStart() {
  const now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();
  if (now.getDate() < CYCLE_START_DAY) {
    month -= 1;
    if (month < 0) { month = 11; year -= 1; }
  }
  return { year, month };
}

export function buildDemoState() {
  seq = 0;
  const { year, month } = currentCycleStart();
  const now = new Date();
  const transactions = [];

  const dateAt = (cyclesAgo, dia, hora) => {
    const d = new Date(year, month - cyclesAgo, dia, hora, 0, 0, 0);
    return (d > now ? now : d).toISOString();
  };
  const cycleKey = cyclesAgo => {
    const d = new Date(year, month - cyclesAgo, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };
  const reserveName = id => RESERVES.find(r => r.id === id).name;

  for (let i = 0; i < CYCLES; i++) {
    const cyclesAgo = CYCLES - 1 - i;

    transactions.push({
      id: demoId(), amount: SALARIO, date: dateAt(cyclesAgo, CYCLE_START_DAY, 9),
      type: 'ENTRY', description: 'Salário', categoryId: 'cat-salario',
    });

    if (FREELAS[i] > 0) {
      transactions.push({
        id: demoId(), amount: FREELAS[i], date: dateAt(cyclesAgo, CYCLE_START_DAY + 4, 14),
        type: 'ENTRY', description: 'Projeto freelance', categoryId: 'cat-extra',
      });
    }

    GUARDADOS.forEach(({ reserve, valor }) => {
      transactions.push({
        id: demoId(), amount: valor, date: dateAt(cyclesAgo, CYCLE_START_DAY, 10),
        type: 'ALLOCATION', description: `Guardado em ${reserveName(reserve)}`,
        toId: reserve, label: reserveName(reserve),
      });
    });

    SAIDAS.forEach(saida => {
      const amount = saida.valores[i];
      if (!amount) return;
      transactions.push({
        id: demoId(), amount, date: dateAt(cyclesAgo, saida.dia, 12),
        type: 'EXPENSE', description: saida.desc, categoryId: saida.cat,
      });
    });

    if (i === 1) {
      transactions.push({
        id: demoId(), amount: 450, date: dateAt(cyclesAgo, 14, 11),
        type: 'ENTRY', description: 'Reembolso do plano de saúde', categoryId: 'cat-extra',
        historicalAdjustment: true, label: 'Ajuste histórico',
      });
    }

    if (i === 2) {
      transactions.push({
        id: demoId(), amount: 600, date: dateAt(cyclesAgo, 20, 16),
        type: 'RESERVE_RESCUE', description: 'Resgate de Reserva de Emergência',
        fromId: 'reserve-emergency', label: 'Reserva de Emergência',
      });
    }
  }

  transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  const primeiroCiclo = cycleKey(CYCLES - 1);
  const state = {
    schemaVersion: SCHEMA_VERSION,
    profile: { name: 'Visitante', color: '#16a34a' },
    account: 0,
    transactions,
    reserves: RESERVES.map(r => ({
      id: r.id, name: r.name, color: r.color, currentBalance: 0,
      goal: { ...newGoal(), enabled: true, targetAmount: r.meta, startCycle: primeiroCiclo },
    })),
    categories: CATEGORIES,
    cycleStartDay: CYCLE_START_DAY,
  };

  replayBalances(state);
  return state;
}

function replayBalances(state) {
  const reserve = id => state.reserves.find(r => r.id === id);

  state.transactions.forEach(t => {
    if (t.historicalAdjustment) return;
    if (t.type === 'ENTRY') {
      state.account += t.amount;
    } else if (t.type === 'EXPENSE') {
      state.account -= t.amount;
    } else if (t.type === 'ALLOCATION') {
      state.account -= t.amount;
      const r = reserve(t.toId);
      if (r) r.currentBalance += t.amount;
    } else if (t.type === 'RESERVE_RESCUE') {
      state.account += t.amount;
      const r = reserve(t.fromId);
      if (r) r.currentBalance -= t.amount;
    }
  });
}
