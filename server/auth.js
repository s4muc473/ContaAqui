const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const COOKIE_NAME = 'mycoin_token';
const DIAS = 30;
const ROUNDS = 10;

function segredo() {
  const valor = process.env.JWT_SECRET;
  if (!valor || valor.length < 16) {
    throw new Error('JWT_SECRET ausente ou com menos de 16 caracteres');
  }
  return valor;
}

function emProducao() {
  return process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
}

async function hashSenha(senha) {
  return bcrypt.hash(senha, ROUNDS);
}

async function conferirSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}

function darToken(res, usuario) {
  const token = jwt.sign({ sub: String(usuario._id) }, segredo(), { expiresIn: `${DIAS}d` });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: emProducao(),
    path: '/',
    maxAge: DIAS * 24 * 60 * 60 * 1000,
  });
}

function limparToken(res) {
  res.clearCookie(COOKIE_NAME, { path: '/', sameSite: 'lax', secure: emProducao() });
}

function lerToken(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, segredo()).sub;
  } catch (e) {
    return null;
  }
}

function exigirLogin(req, res, next) {
  const id = lerToken(req);
  if (!id || !ObjectId.isValid(id)) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }
  req.userId = new ObjectId(id);
  next();
}

// Freio simples de força bruta. Em serverless vale por instância, então não é
// uma barreira forte — é só para encarecer tentativas repetidas no mesmo processo.
const tentativas = new Map();
const JANELA_MS = 15 * 60 * 1000;
const LIMITE = 10;

function registrarTentativa(chave) {
  const agora = Date.now();
  const atual = tentativas.get(chave);
  if (!atual || agora - atual.inicio > JANELA_MS) {
    tentativas.set(chave, { inicio: agora, total: 1 });
    return 1;
  }
  atual.total += 1;
  return atual.total;
}

function limparTentativas(chave) {
  tentativas.delete(chave);
}

function excedeuTentativas(chave) {
  const atual = tentativas.get(chave);
  if (!atual) return false;
  if (Date.now() - atual.inicio > JANELA_MS) {
    tentativas.delete(chave);
    return false;
  }
  return atual.total >= LIMITE;
}

module.exports = {
  COOKIE_NAME,
  hashSenha,
  conferirSenha,
  darToken,
  limparToken,
  lerToken,
  exigirLogin,
  registrarTentativa,
  limparTentativas,
  excedeuTentativas,
};
