import {
  IS_DEMO,
  loadState,
  setState,
  defaultState,
  saveState,
  isReadOnly,
  onSync,
  gravarNoServidor,
  recarregarDoServidor,
} from './state.js';
import { $, showToast } from './utils.js';
import { api } from './api.js';
import { ui } from './ui-state.js';
import { renderAll } from './render.js';
import { wireEvents } from './events.js';
import { mostrarLogin, wireAuthForm } from './auth-ui.js';

async function carregarDemo() {
  const { buildDemoState } = await import('./demo-data.js');
  return buildDemoState();
}

function ligarIndicadorSync() {
  const el = $('syncStatus');

  onSync(async (situacao, detalhe) => {
    if (situacao === 'salvando') {
      el.hidden = false;
      el.className = 'sync';
      el.textContent = 'salvando…';
      return;
    }
    if (situacao === 'ok') {
      el.hidden = true;
      return;
    }
    if (situacao === 'erro') {
      el.hidden = false;
      el.className = 'sync erro';
      el.textContent = 'sem salvar';
      showToast('Não consegui salvar: ' + detalhe);
      return;
    }
    if (situacao === 'conflito') {
      el.hidden = true;
      await recarregarDoServidor();
      renderAll();
      showToast('Os dados mudaram em outro aparelho. Recarreguei a versão mais recente.');
      return;
    }
    if (situacao === 'deslogado') {
      el.hidden = true;
      mostrarLogin(false, 'Sua sessão expirou. Entre de novo.');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') gravarNoServidor();
  });
}

async function abrirApp() {
  $('authScreen').hidden = true;
  $('app').hidden = false;

  if (!(await loadState())) {
    setState(defaultState());
    saveState();
  }
  renderAll();

  if (isReadOnly()) {
    showToast('Não consegui ler seus dados salvos. Eles estão intactos — nada foi alterado.');
  }
}

async function init() {
  wireEvents();
  wireAuthForm(abrirApp);
  ligarIndicadorSync();

  if (IS_DEMO) {
    if (!(await loadState())) setState(await carregarDemo());
    $('demoBadge').hidden = false;
    $('app').hidden = false;
    renderAll();
    return;
  }

  try {
    const status = await api.status();
    ui.usuario = status.usuario;
    if (status.autenticado) await abrirApp();
    else mostrarLogin(status.precisaSetup);
  } catch (e) {
    mostrarLogin(false, e.message);
  }
}

init();
