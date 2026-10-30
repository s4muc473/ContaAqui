import { IS_DEMO, loadState, setState, defaultState, isReadOnly } from './state.js';
import { $, showToast } from './utils.js';
import { buildDemoState } from './demo-data.js';
import { renderAll } from './render.js';
import { wireEvents } from './events.js';

function init() {
  if (!loadState()) setState(IS_DEMO ? buildDemoState() : defaultState());
  if (IS_DEMO) $('demoBadge').hidden = false;

  wireEvents();
  renderAll();

  if (isReadOnly()) {
    showToast('Não consegui ler seus dados salvos. Eles estão intactos — nada foi alterado.');
  }
}

init();
