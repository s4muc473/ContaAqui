const fs = require('fs');
const path = require('path');

// Em produção a Vercel injeta as variáveis; localmente lemos o .env sem depender de pacote.
function loadLocalEnv() {
  if (process.env.VERCEL) return;
  try {
    const raw = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
    raw.split('\n').forEach(linha => {
      const texto = linha.trim();
      if (!texto || texto.startsWith('#')) return;
      const corte = texto.indexOf('=');
      if (corte < 1) return;
      const chave = texto.slice(0, corte).trim();
      const valor = texto.slice(corte + 1).trim().replace(/^["']|["']$/g, '');
      if (!(chave in process.env)) process.env[chave] = valor;
    });
  } catch (e) {
    if (e.code !== 'ENOENT') console.warn('Não foi possível ler o .env:', e.message);
  }
}

module.exports = { loadLocalEnv };
