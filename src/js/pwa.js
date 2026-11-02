import { $ } from './utils.js';

// O navegador só dispara beforeinstallprompt quando o app é instalável e ainda
// não foi instalado. Guardamos o evento para disparar na hora que o usuário pedir.
let promptGuardado = null;

export function estaInstalado() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

function ehIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function registrarServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(e => {
      console.warn('Service worker não registrado:', e.message);
    });
  });
}

export function iniciarPwa() {
  registrarServiceWorker();

  window.addEventListener('beforeinstallprompt', evento => {
    evento.preventDefault();
    promptGuardado = evento;
    atualizarUiInstalacao();
  });

  window.addEventListener('appinstalled', () => {
    promptGuardado = null;
    atualizarUiInstalacao();
  });

  atualizarUiInstalacao();
}

export function atualizarUiInstalacao() {
  const botao = $('instalarAppBtn');
  const texto = $('pwaTexto');
  if (!botao || !texto) return;

  if (estaInstalado()) {
    botao.hidden = true;
    texto.textContent = 'O app já está instalado neste aparelho.';
    return;
  }

  if (promptGuardado) {
    botao.hidden = false;
    texto.textContent = 'Instale para abrir direto da tela inicial, sem a barra do navegador.';
    return;
  }

  botao.hidden = true;
  texto.textContent = ehIOS()
    ? 'No iPhone, toque em Compartilhar e escolha "Adicionar à Tela de Início".'
    : 'Abra o menu do navegador (⋮) e escolha "Instalar app" ou "Adicionar à tela inicial".';
}

export async function instalarApp() {
  if (!promptGuardado) return false;
  promptGuardado.prompt();
  const { outcome } = await promptGuardado.userChoice;
  promptGuardado = null;
  atualizarUiInstalacao();
  return outcome === 'accepted';
}
