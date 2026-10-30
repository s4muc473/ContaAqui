import { $, escapeHtml } from './utils.js';

const dds = new Map();
let openId = null;

export function initDropdown(id, { placeholder = 'Selecione', onChange } = {}) {
  const host = $(id);
  if (!host) return;

  const old = dds.get(id);
  if (old) old.list.remove();

  host.classList.add('dd');
  host.innerHTML = `
    <button type="button" class="dd-btn" id="${id}-btn" aria-haspopup="listbox" aria-expanded="false">
      <span class="dd-dot" hidden></span>
      <span class="dd-label placeholder">${escapeHtml(placeholder)}</span>
      <i class="fas fa-chevron-down dd-caret" aria-hidden="true"></i>
    </button>`;

  const list = document.createElement('div');
  list.className = 'dd-list';
  list.setAttribute('role', 'listbox');
  list.hidden = true;
  document.body.appendChild(list);

  const dd = {
    id, host, list, onChange, placeholder,
    btn: host.querySelector('.dd-btn'),
    options: [], value: '', cursor: -1,
  };
  dds.set(id, dd);

  dd.btn.addEventListener('click', () => (openId === id ? close() : open(id)));
  dd.btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open(id);
    }
  });
  list.addEventListener('keydown', e => onListKey(dd, e));
}

export function setDropdownOptions(id, options, value) {
  const dd = dds.get(id);
  if (!dd) return;
  dd.options = options;
  const keep = value !== undefined ? value : dd.value;
  dd.value = options.some(o => o.value === keep) ? keep : '';
  paint(dd);
}

export function getDropdownValue(id) {
  return dds.get(id)?.value || '';
}

export function setDropdownValue(id, value) {
  const dd = dds.get(id);
  if (!dd) return;
  dd.value = dd.options.some(o => o.value === value) ? value : '';
  paint(dd);
}

function paint(dd) {
  const selected = dd.options.find(o => o.value === dd.value);
  const label = dd.btn.querySelector('.dd-label');
  const dot = dd.btn.querySelector('.dd-dot');

  label.textContent = selected ? selected.label : dd.placeholder;
  label.classList.toggle('placeholder', !selected);
  if (selected && selected.color) {
    dot.hidden = false;
    dot.style.background = selected.color;
  } else {
    dot.hidden = true;
  }

  let html = '';
  let group = null;
  dd.options.forEach((o, i) => {
    if (o.group && o.group !== group) {
      group = o.group;
      html += `<div class="dd-group">${escapeHtml(o.group)}</div>`;
    }
    const isSel = o.value === dd.value;
    html += `
      <button type="button" class="dd-opt" role="option" data-i="${i}" aria-selected="${isSel}">
        ${o.color ? `<span class="dd-dot" style="background:${o.color}"></span>` : ''}
        <span class="dd-text">${escapeHtml(o.label)}</span>
        ${isSel ? '<i class="fas fa-check dd-check" aria-hidden="true"></i>' : ''}
      </button>`;
  });
  dd.list.innerHTML = html || '<div class="dd-group">Nenhuma opção</div>';

  dd.list.querySelectorAll('.dd-opt').forEach(btn => {
    btn.addEventListener('click', () => select(dd, Number(btn.dataset.i)));
  });
}

function select(dd, index) {
  const option = dd.options[index];
  if (!option) return;
  dd.value = option.value;
  paint(dd);
  close();
  dd.btn.focus();
  dd.onChange?.(option.value, option);
}

function place(dd) {
  const r = dd.btn.getBoundingClientRect();
  const width = Math.max(r.width, 180);
  const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
  const below = window.innerHeight - r.bottom - 12;
  const above = r.top - 12;
  const openUp = below < 200 && above > below;

  dd.list.style.width = width + 'px';
  dd.list.style.left = left + 'px';
  dd.list.style.maxHeight = Math.max(140, (openUp ? above : below)) + 'px';
  if (openUp) {
    dd.list.style.top = 'auto';
    dd.list.style.bottom = (window.innerHeight - r.top + 6) + 'px';
  } else {
    dd.list.style.bottom = 'auto';
    dd.list.style.top = (r.bottom + 6) + 'px';
  }
}

function open(id) {
  const dd = dds.get(id);
  if (!dd) return;
  if (openId && openId !== id) close();

  openId = id;
  dd.host.dataset.open = 'true';
  dd.btn.setAttribute('aria-expanded', 'true');
  dd.list.hidden = false;
  place(dd);

  dd.cursor = Math.max(0, dd.options.findIndex(o => o.value === dd.value));
  moveCursor(dd, 0, false);
}

export function close() {
  if (!openId) return;
  const dd = dds.get(openId);
  openId = null;
  if (!dd) return;
  dd.list.hidden = true;
  dd.host.dataset.open = 'false';
  dd.btn.setAttribute('aria-expanded', 'false');
}

function moveCursor(dd, delta, scroll = true) {
  const opts = [...dd.list.querySelectorAll('.dd-opt')];
  if (!opts.length) return;
  dd.cursor = (dd.cursor + delta + opts.length) % opts.length;
  opts.forEach(o => o.classList.remove('cursor'));
  const el = opts[dd.cursor];
  el.classList.add('cursor');
  el.focus({ preventScroll: true });
  if (scroll) el.scrollIntoView({ block: 'nearest' });
}

function onListKey(dd, e) {
  if (e.key === 'Escape') { e.preventDefault(); close(); dd.btn.focus(); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); moveCursor(dd, 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); moveCursor(dd, -1); }
  else if (e.key === 'Tab') close();
}

document.addEventListener('click', e => {
  if (!openId) return;
  const dd = dds.get(openId);
  if (dd && !dd.host.contains(e.target) && !dd.list.contains(e.target)) close();
});
function reposition() {
  if (!openId) return;
  const dd = dds.get(openId);
  if (dd) place(dd);
}

window.addEventListener('resize', reposition);
window.addEventListener('scroll', e => {
  const dd = openId && dds.get(openId);
  if (dd && dd.list.contains(e.target)) return;
  reposition();
}, true);
