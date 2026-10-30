export function $(id) {
  return document.getElementById(id);
}

export function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v) || 0);
}

export function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function toISODateLocal(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

// Tinta legível sobre uma cor qualquer: o cruzamento de contraste WCAG fica em L ≈ 0.205.
export function readableInk(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const lum = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map(v => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    })
    .reduce((acc, c, i) => acc + c * [0.2126, 0.7152, 0.0722][i], 0);
  return lum > 0.205 ? '#1a1f1a' : '#ffffff';
}

export function isVisible(el) {
  return !!(el && el.offsetParent !== null);
}

export function showToast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => el.classList.remove('show'), 2500);
}
