const express = require('express');
const { states } = require('../db');
const { exigirLogin } = require('../auth');

const router = express.Router();

const LIMITE_BYTES = 2 * 1024 * 1024;

// Guardamos o state exatamente como o app usa: um JSON por usuário, sem
// transformação. O que validamos aqui é só a forma mínima e o tamanho.
function validarState(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Formato inválido';
  if (!Array.isArray(data.transactions)) return 'transactions precisa ser uma lista';
  if (!Array.isArray(data.reserves)) return 'reserves precisa ser uma lista';
  if (data.categories !== undefined && !Array.isArray(data.categories)) {
    return 'categories precisa ser uma lista';
  }
  if (Buffer.byteLength(JSON.stringify(data), 'utf8') > LIMITE_BYTES) {
    return 'Os dados passaram do tamanho máximo';
  }
  return null;
}

router.get('/', exigirLogin, async (req, res, next) => {
  try {
    const col = await states();
    const doc = await col.findOne({ userId: req.userId });
    res.json({
      data: doc?.data ?? null,
      version: doc?.version ?? 0,
      updatedAt: doc?.updatedAt ?? null,
    });
  } catch (e) { next(e); }
});

router.put('/', exigirLogin, async (req, res, next) => {
  try {
    const { data, version } = req.body || {};
    const erro = validarState(data);
    if (erro) return res.status(400).json({ erro });

    const col = await states();
    const atual = await col.findOne({ userId: req.userId }, { projection: { version: 1 } });
    const versaoAtual = atual?.version ?? 0;

    // Concorrência otimista: se outro aparelho gravou no meio do caminho, o
    // cliente recebe 409 e recarrega em vez de sobrescrever às cegas.
    if (typeof version === 'number' && version !== versaoAtual) {
      return res.status(409).json({
        erro: 'Os dados foram alterados em outro lugar',
        version: versaoAtual,
      });
    }

    const novaVersao = versaoAtual + 1;
    const agora = new Date();
    await col.updateOne(
      { userId: req.userId },
      {
        $set: { data, version: novaVersao, updatedAt: agora },
        $setOnInsert: { userId: req.userId, createdAt: agora },
      },
      { upsert: true },
    );

    res.json({ version: novaVersao, updatedAt: agora });
  } catch (e) { next(e); }
});

module.exports = router;
