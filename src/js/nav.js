import { $ } from './utils.js';

let hooks = {};

export function setTabHooks(next) {
  hooks = next;
}

export function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  $(tabId).classList.add('active');
  document.querySelectorAll('.menu-panel button[data-tab]').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  $('menuOverlay').classList.remove('open');
  window.scrollTo({ top: 0 });
  hooks[tabId]?.();
}
