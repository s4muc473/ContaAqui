async function pedir(metodo, url, corpo) {
  let resposta;
  try {
    resposta = await fetch(url, {
      method: metodo,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      credentials: 'same-origin',
    });
  } catch (e) {
    const erro = new Error('Sem conexão com o servidor');
    erro.offline = true;
    throw erro;
  }

  let dados = null;
  try { dados = await resposta.json(); } catch (e) { /* resposta sem corpo */ }

  if (!resposta.ok) {
    const erro = new Error(dados?.erro || `Erro ${resposta.status}`);
    erro.status = resposta.status;
    erro.dados = dados;
    throw erro;
  }
  return dados;
}

export const api = {
  status: () => pedir('GET', '/api/auth/status'),
  setup: (username, password) => pedir('POST', '/api/auth/setup', { username, password }),
  login: (username, password) => pedir('POST', '/api/auth/login', { username, password }),
  logout: () => pedir('POST', '/api/auth/logout'),
  trocarSenha: (currentPassword, newPassword) => pedir('POST', '/api/auth/password', { currentPassword, newPassword }),
  lerState: () => pedir('GET', '/api/state'),
  gravarState: (data, version) => pedir('PUT', '/api/state', { data, version }),
};
