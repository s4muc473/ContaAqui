const express = require('express');
const { users } = require('../db');
const {
  hashSenha,
  conferirSenha,
  darToken,
  limparToken,
  lerToken,
  exigirLogin,
  registrarTentativa,
  limparTentativas,
  excedeuTentativas,
} = require('../auth');

const router = express.Router();

const USUARIO_REGEX = /^[a-z0-9._-]{3,32}$/;
const SENHA_MINIMA = 8;

function normalizarUsuario(valor) {
  return typeof valor === 'string' ? valor.trim().toLowerCase() : '';
}

function validarCredenciais(usuario, senha) {
  if (!USUARIO_REGEX.test(usuario)) {
    return 'Usuário deve ter de 3 a 32 caracteres: letras minúsculas, números, ponto, hífen ou _';
  }
  if (typeof senha !== 'string' || senha.length < SENHA_MINIMA) {
    return `A senha precisa de pelo menos ${SENHA_MINIMA} caracteres`;
  }
  return null;
}

router.get('/status', async (req, res, next) => {
  try {
    const col = await users();
    const total = await col.countDocuments({}, { limit: 1 });
    const id = lerToken(req);
    let usuario = null;

    if (id) {
      const { ObjectId } = require('mongodb');
      if (ObjectId.isValid(id)) {
        const doc = await col.findOne({ _id: new ObjectId(id) }, { projection: { username: 1 } });
        if (doc) usuario = { id: String(doc._id), username: doc.username };
      }
    }

    res.json({ precisaSetup: total === 0, autenticado: !!usuario, usuario });
  } catch (e) { next(e); }
});

router.post('/setup', async (req, res, next) => {
  try {
    const col = await users();
    const total = await col.countDocuments({}, { limit: 1 });
    if (total > 0) {
      return res.status(409).json({ erro: 'Já existe um usuário. Use a tela de login.' });
    }

    const usuario = normalizarUsuario(req.body?.username);
    const senha = req.body?.password;
    const erro = validarCredenciais(usuario, senha);
    if (erro) return res.status(400).json({ erro });

    const agora = new Date();
    const doc = {
      username: usuario,
      passwordHash: await hashSenha(senha),
      createdAt: agora,
      updatedAt: agora,
    };
    const { insertedId } = await col.insertOne(doc);

    darToken(res, { _id: insertedId });
    res.status(201).json({ usuario: { id: String(insertedId), username: usuario } });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const usuario = normalizarUsuario(req.body?.username);
    const senha = req.body?.password;
    const chave = `${req.ip}:${usuario}`;

    if (excedeuTentativas(chave)) {
      return res.status(429).json({ erro: 'Muitas tentativas. Tente de novo em alguns minutos.' });
    }
    if (!usuario || typeof senha !== 'string') {
      return res.status(400).json({ erro: 'Informe usuário e senha' });
    }

    const col = await users();
    const doc = await col.findOne({ username: usuario });
    const confere = doc ? await conferirSenha(senha, doc.passwordHash) : false;

    if (!confere) {
      registrarTentativa(chave);
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    limparTentativas(chave);
    darToken(res, doc);
    res.json({ usuario: { id: String(doc._id), username: doc.username } });
  } catch (e) { next(e); }
});

router.post('/logout', (req, res) => {
  limparToken(res);
  res.json({ ok: true });
});

router.post('/password', exigirLogin, async (req, res, next) => {
  try {
    const atual = req.body?.currentPassword;
    const nova = req.body?.newPassword;

    if (typeof nova !== 'string' || nova.length < SENHA_MINIMA) {
      return res.status(400).json({ erro: `A nova senha precisa de pelo menos ${SENHA_MINIMA} caracteres` });
    }

    const col = await users();
    const doc = await col.findOne({ _id: req.userId });
    if (!doc) return res.status(404).json({ erro: 'Usuário não encontrado' });

    if (!(await conferirSenha(typeof atual === 'string' ? atual : '', doc.passwordHash))) {
      return res.status(401).json({ erro: 'Senha atual incorreta' });
    }

    await col.updateOne(
      { _id: req.userId },
      { $set: { passwordHash: await hashSenha(nova), updatedAt: new Date() } },
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
