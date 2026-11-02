import { $ } from './utils.js';
import { api } from './api.js';
import { ui } from './ui-state.js';

let modoCriar = false;
let exigeConvite = false;
let aoEntrar = null;

export function definirExigeConvite(valor) {
  exigeConvite = !!valor;
}

export function wireAuthForm(callback) {
  aoEntrar = callback;
  $('authForm').addEventListener('submit', enviar);
  $('authTrocaBtn').addEventListener('click', () => mostrarLogin({ criar: !modoCriar }));
}

export function mostrarLogin({ criar = false, mensagem = '' } = {}) {
  modoCriar = criar;

  $('authTitle').textContent = criar ? 'Criar conta' : 'Entrar';
  $('authSub').textContent = criar
    ? 'Escolha um usuário e uma senha. Sua conta começa zerada e é só sua.'
    : 'Acesse com seu usuário e senha.';
  $('authSubmit').textContent = criar ? 'Criar conta' : 'Entrar';
  $('authConfirmWrap').hidden = !criar;
  $('authConviteWrap').hidden = !(criar && exigeConvite);
  $('authPass').setAttribute('autocomplete', criar ? 'new-password' : 'current-password');
  $('authTrocaTexto').textContent = criar ? 'Já tem conta?' : 'Ainda não tem conta?';
  $('authTrocaBtn').textContent = criar ? 'Entrar' : 'Criar conta';

  $('authPass').value = '';
  $('authPass2').value = '';
  $('authConvite').value = '';
  mostrarErro(mensagem);

  $('app').hidden = true;
  $('authScreen').hidden = false;
  $('authUser').focus();
}

function mostrarErro(mensagem) {
  const el = $('authErro');
  el.textContent = mensagem || '';
  el.hidden = !mensagem;
}

async function enviar(evento) {
  evento.preventDefault();

  const usuario = $('authUser').value.trim().toLowerCase();
  const senha = $('authPass').value;
  const botao = $('authSubmit');

  if (modoCriar && senha !== $('authPass2').value) {
    mostrarErro('As senhas não conferem');
    return;
  }

  botao.disabled = true;
  mostrarErro('');
  try {
    const resposta = modoCriar
      ? await api.registrar(usuario, senha, $('authConvite').value.trim())
      : await api.login(usuario, senha);

    ui.usuario = resposta.usuario;
    $('authPass').value = '';
    $('authPass2').value = '';
    $('authScreen').hidden = true;
    await aoEntrar?.();
  } catch (e) {
    mostrarErro(e.message);
  } finally {
    botao.disabled = false;
  }
}
