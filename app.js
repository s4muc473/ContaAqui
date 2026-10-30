const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

require('./server/env').loadLocalEnv();

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '4mb' }));
app.use(cookieParser());

// Diagnóstico de configuração. Responde só a PRESENÇA das variáveis e os nomes
// das que existem — nunca os valores —, para achar erro de digitação sem vazar nada.
app.get('/api/health', (req, res) => {
  res.json({
    ok: !!process.env.MONGODB_URI && !!process.env.JWT_SECRET,
    temMongodbUri: !!process.env.MONGODB_URI,
    temJwtSecret: !!process.env.JWT_SECRET,
    banco: process.env.MONGODB_DB || 'mycoin',
    naVercel: !!process.env.VERCEL,
    ambiente: process.env.VERCEL_ENV || null,
    nomesParecidos: Object.keys(process.env).filter(k => /mongo|jwt|_db|database/i.test(k)),
  });
});

app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/state', require('./server/routes/state'));

app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

// Só o que é público do front é servido: o código do cliente e os ícones.
// Nada fora dessa lista sai do servidor, para não expor .env nem server/.
const ARQUIVOS_PUBLICOS = new Set([
  '/index.html',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
]);

app.use('/src', express.static(path.join(__dirname, 'src'), { maxAge: '1h' }));

app.get('*', (req, res) => {
  const alvo = ARQUIVOS_PUBLICOS.has(req.path) ? req.path : '/index.html';
  res.sendFile(path.join(__dirname, alvo));
});

app.use((err, req, res, next) => {
  const faltaConfig = /MONGODB_URI|JWT_SECRET/.test(err.message || '');
  console.error('Erro na API:', err);
  res.status(faltaConfig ? 503 : 500).json({
    erro: faltaConfig ? 'Servidor sem configuração: ' + err.message : 'Erro interno',
  });
});

if (require.main === module) {
  const porta = process.env.PORT || 3000;
  app.listen(porta, () => console.log(`MyCoin em http://localhost:${porta}`));
}

module.exports = app;
