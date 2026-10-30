export const SCHEMA_VERSION = 3;
export const IS_DEMO = new URLSearchParams(location.search).has('demo');

const STORAGE_KEY = IS_DEMO ? 'financeiro_data_demo' : 'financeiro_data';
const RESERVE_COLORS = ['#7c3aed', '#0d9488', '#ea580c', '#0369a1', '#db2777'];

export let state = {
  schemaVersion: SCHEMA_VERSION,
  profile: { name: '', color: '#16a34a' },
  account: 0,
  transactions: [],
  reserves: [],
  categories: [],
  cycleStartDay: 6,
};

export function setState(next) {
  state = next;
}

export function newGoal() {
  return { enabled: false, targetAmount: 0, startCycle: '', endCycle: '' };
}

export function defaultProfile() {
  return { name: '', color: '#16a34a' };
}

export function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: defaultProfile(),
    account: 0,
    transactions: [],
    reserves: [
      { id: 'reserve-emergency', name: 'Reserva de Emergência', currentBalance: 0, color: '#7c3aed', goal: newGoal() },
    ],
    categories: [
      { id: 'cat-salario', name: 'Salário', type: 'ENTRY', color: '#15803d' },
      { id: 'cat-extra', name: 'Renda Extra', type: 'ENTRY', color: '#16a34a' },
      { id: 'cat-moradia', name: 'Moradia', type: 'EXPENSE', color: '#dc2626' },
      { id: 'cat-mercado', name: 'Mercado', type: 'EXPENSE', color: '#ea580c' },
      { id: 'cat-transporte', name: 'Transporte', type: 'EXPENSE', color: '#b45309' },
      { id: 'cat-lazer', name: 'Lazer', type: 'EXPENSE', color: '#db2777' },
    ],
    cycleStartDay: 6,
  };
}

function migrateToV2(parsed) {
  parsed.categories = parsed.categories || [];
  parsed.budgets = (parsed.budgets || []).map(b => ({
    color: '#16a34a',
    targetAmount: 0,
    ...b,
    goal: b.goal || newGoal(),
  }));
  parsed.reserves = (parsed.reserves || []).map((r, i) => ({
    color: RESERVE_COLORS[i % RESERVE_COLORS.length],
    ...r,
    goal: r.goal || newGoal(),
  }));
  parsed.transactions = parsed.transactions || [];
  parsed.entryPool = parsed.entryPool || 0;
  parsed.cycleStartDay = parsed.cycleStartDay || 6;
}

// v3 acaba com os orçamentos: o dinheiro de todos eles vira uma conta só, e as
// alocações entre orçamentos deixam de existir porque não movem mais nada.
function migrateToV3(parsed) {
  const budgets = parsed.budgets || [];
  const reserveIds = new Set((parsed.reserves || []).map(r => r.id));

  parsed.account = (parsed.entryPool || 0) + budgets.reduce((a, b) => a + (b.currentBalance || 0), 0);
  parsed.transactions = (parsed.transactions || []).filter(t => {
    if (t.type !== 'ALLOCATION') return true;
    return reserveIds.has(t.toId);
  });
  parsed.profile = parsed.profile || defaultProfile();

  delete parsed.entryPool;
  delete parsed.budgets;
}

export function migrateState(parsed) {
  const v = parsed.schemaVersion || 1;
  if (v < 2) migrateToV2(parsed);
  if (v < 3) migrateToV3(parsed);

  const profile = parsed.profile || {};
  parsed.profile = {
    name: typeof profile.name === 'string' ? profile.name : '',
    color: profile.color || '#16a34a',
  };
  parsed.reserves = (parsed.reserves || []).map((r, i) => ({
    color: RESERVE_COLORS[i % RESERVE_COLORS.length],
    ...r,
    goal: r.goal || newGoal(),
  }));
  parsed.categories = parsed.categories || [];
  parsed.account = Number(parsed.account) || 0;
  parsed.cycleStartDay = parsed.cycleStartDay || 6;
  parsed.schemaVersion = SCHEMA_VERSION;
  return parsed;
}

export function isValidState(data) {
  return data && typeof data === 'object'
    && Array.isArray(data.transactions)
    && Array.isArray(data.reserves)
    && (data.categories === undefined || Array.isArray(data.categories));
}

// Ligado quando havia dados salvos que não puderam ser lidos. Enquanto estiver
// ligado nada é gravado, para não substituir os dados do usuário por um estado vazio.
let readOnly = false;

export function isReadOnly() {
  return readOnly;
}

export function saveState() {
  if (readOnly) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn('Erro ao salvar', e); }
}

export function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;

  try {
    const parsed = JSON.parse(saved);
    keepPreMigrationBackup(saved, parsed.schemaVersion || 1);
    state = migrateState(parsed);
    return true;
  } catch (e) {
    console.error('Não foi possível ler os dados salvos; eles foram preservados.', e);
    readOnly = true;
    return true;
  }
}

// A migração sobrescreve o localStorage, então guarda o JSON original uma vez
// por versão de origem: é a única forma de voltar atrás no aparelho do usuário.
function keepPreMigrationBackup(raw, fromVersion) {
  if (fromVersion >= SCHEMA_VERSION) return;
  const key = `${STORAGE_KEY}_backup_v${fromVersion}`;
  try {
    if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
  } catch (e) { console.warn('Não foi possível guardar o backup da migração', e); }
}
