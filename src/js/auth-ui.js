import { $ } from './utils.js';
import { api } from './api.js';
import { ui } from './ui-state.js';

let modoSetup = false;
let aoEntrar = null;

export function wireAuthForm(callback) {
  aoEntrar = callback;
  $('authForm').addEventListener('submit', enviar);
}

export function mostrarLogin(precisaSetup, mensagem) {
  modoSetup = !!precisaSetup;

  $('authTitle').textContent = modoSetup ? 'Criar acesso' : 'Entrar';
  $('authSub').textContent = modoSetup
    ? 'Defina o usuário e a senha que vão proteger seus dados.'
    : 'Acesse com seu usuário e senha.';
  $('authSubmit').textContent = modoSetup ? 'Criar acesso' : 'Entrar';
  $('authConfirmWrap').hidden = !modoSetup;
  $('authPass').setAttribute('autocomplete', modoSetup ? 'new-password' : 'current-password');
  $('authPass').value = '';
  $('authPass2').value = '';

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

  if (modoSetup && senha !== $('authPass2').value) {
    mostrarErro('As senhas não conferem');
    return;
  }

  botao.disabled = true;
  mostrarErro('');
  try {
    const resposta = modoSetup
      ? await api.setup(usuario, senha)
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
