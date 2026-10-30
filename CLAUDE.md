# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

MyCoin (repo `ContaAqui`): app de controle financeiro pessoal, sem build, sem bundler,
sem dependências locais e sem testes. Interface e textos em pt-BR — mantenha assim.

Dependências vêm de CDN no `<head>`: Chart.js 4.4.0, Font Awesome 6.4.0, Google Fonts.
`Chart` é global (script clássico); os módulos do app são ES modules.

## Executar

O app é servido pelo próprio Express (`app.js`), que entrega o front e a API na mesma
origem — é isso que faz o cookie de sessão funcionar sem CORS.

```bash
npm install
cp .env.example .env    # preencha MONGODB_URI e JWT_SECRET
npm run dev             # http://localhost:3000
```

Para um banco local em vez do Atlas:

```bash
docker run -d --name mycoin-mongo -p 27018:27017 mongo:7
# no .env: MONGODB_URI=mongodb://127.0.0.1:27018
```

Variáveis (as mesmas no `.env` local e no painel da Vercel): `MONGODB_URI`,
`JWT_SECRET` (≥16 caracteres) e `MONGODB_DB` (opcional, padrão `mycoin`).
**Nenhuma credencial entra no repositório** — o `.env` está no `.gitignore`.

`?demo=1` não passa pelo servidor: carrega dados de exemplo e grava só no localStorage,
numa chave separada. Serve para ver o app sem banco e sem login.

`?demo=1` carrega dados de exemplo numa chave de localStorage separada
(`financeiro_data_demo`), sem tocar nos dados reais (`financeiro_data`). Um selo no
cabeçalho indica o modo e linka de volta.

Não há lint nem suíte de testes. Validação é manual no navegador — e **sempre também em
largura de celular**, já que o layout é mobile-first (`#app` com `max-width:600px`).

## Modelo de dados

Uma **conta única** (`state.account`) é de onde tudo entra e sai. Não existem orçamentos:
o schema 3 removeu `budgets` e `entryPool`. Fora da conta existem apenas **reservas**
(dinheiro guardado), cada uma com saldo próprio e meta opcional.

```
state = {
  schemaVersion: 3,
  profile: { name, color },          // color vira --accent em runtime
  account: 0,                        // saldo disponível
  transactions: [],
  reserves: [],                      // { id, name, color, currentBalance, goal }
  categories: [],
  cycleStartDay: 6,
}
```

Tipos de transação e o que cada um faz com o dinheiro:

| Tipo | Conta | Reserva |
|---|---|---|
| `ENTRY` | + | — |
| `EXPENSE` | − | — |
| `ALLOCATION` (guardar) | − | + (`toId`) |
| `RESERVE_RESCUE` (resgatar) | + | − (`fromId`) |

`historicalAdjustment: true` entra em histórico, cards e gráficos, mas **nunca** toca
saldo nenhum. Edição e exclusão ramificam nessa flag — preserve esse comportamento.

### Invariante central: saldos e log são redundantes

Os saldos (`state.account`, `reserve.currentBalance`) **não** são derivados de
`transactions`. Toda operação precisa mutar os dois lados de forma coerente, e toda
reversão (`deleteTransaction`, `updateTransaction`) precisa desfazer os dois. É onde os
bugs aparecem: ao mexer em fluxo de caixa, confira o par mutação-de-saldo +
push-de-transação. `demo-data.js` tem um `replayBalances()` que deriva os saldos do log —
é só para montar o exemplo, não é a fonte da verdade em runtime.

### Migração

Ao mudar a forma do state: incremente `SCHEMA_VERSION` **e** trate a versão antiga em
`migrateState()`, que roda no `loadState()` e na importação de JSON. A migração para v3
soma `entryPool + Σ budget.currentBalance` em `account` e descarta as alocações entre
orçamentos (elas não movem mais nada); o histórico de entradas e saídas é preservado.

`state` é reatribuído na carga e na importação, então outros módulos importam o binding
vivo (`import { state }`) e só `state.js` troca o valor, via `setState()`.

## Estrutura

```
app.js            servidor Express (é o handler da Vercel: module.exports = app)
server/           backend — db, auth e rotas
index.html        markup de todas as telas e modais (nada é criado do zero em runtime)
src/css/          base → layout → components → screens → goals (a ordem importa: cascata)
src/js/           módulos ES, carregados por src/js/main.js
```

| Módulo | Papel |
|---|---|
| `state.js` | o objeto `state`, localStorage, schema e migração |
| `utils.js` | `$`, formatação, `escapeHtml`, `showToast` |
| `cycle.js` | ciclo financeiro e rótulos de mês |
| `selectors.js` | derivações do state (agregados por ciclo, por categoria, progresso de meta) |
| `ui-state.js` | seleções de interface (mês, reserva aberta, item em edição) |
| `actions.js` | **todas** as mutações de dinheiro |
| `charts.js` | tudo que fala com Chart.js |
| `dropdown.js` | o select customizado (nenhum `<select>` nativo na interface) |
| `nav.js` | troca de tela (`showTab`) e os hooks por aba |
| `render.js` | DOM a partir do state |
| `modals.js` | ler/preencher campos de modal e chamar actions |
| `events.js` | wiring de listeners (`wireEvents()`) |
| `demo-data.js` | dados de exemplo do `?demo=1` |
| `api.js` | cliente HTTP da API |
| `auth-ui.js` | tela de login / criação de acesso |
| `main.js` | `init()` |

## Backend

| Arquivo | Papel |
|---|---|
| `app.js` | Express: monta a API, serve o front e exporta o handler da Vercel |
| `server/env.js` | lê o `.env` local sem depender de pacote (na Vercel as vars já vêm do ambiente) |
| `server/db.js` | conexão Mongo com cache no `global` e criação dos índices |
| `server/auth.js` | bcrypt, JWT em cookie httpOnly e o middleware `exigirLogin` |
| `server/routes/auth.js` | `/api/auth` — status, setup, login, logout, troca de senha |
| `server/routes/state.js` | `/api/state` — lê e grava o state do usuário |

Duas coleções, preparadas para vários usuários desde já:

```
users   { _id, username (único), passwordHash, createdAt, updatedAt }
states  { _id, userId (único), data, version, updatedAt }
```

`states.data` é **o mesmo JSON que o app usa em memória**, gravado sem transformação —
é isso que mantém a fidelidade e deixa o documento pequeno (o histórico real dá ~25 KB,
contra 16 MB por documento e 512 MB do plano gratuito). O servidor valida só a forma
mínima (`transactions` e `reserves` como listas) e o tamanho; ele não conhece as regras
de negócio, que continuam no front.

Hoje só existe um usuário: `/api/auth/setup` funciona apenas enquanto a coleção `users`
estiver vazia. Para abrir para mais usuários, basta liberar essa rota — o resto já é por
`userId`.

### Gravação e concorrência

O front não faz uma chamada por operação: `saveState()` agenda um PUT do state inteiro
(700 ms de debounce, mais um flush quando a aba é escondida). Cada gravação incrementa
`version`; se outro aparelho gravou no meio, o PUT volta 409 e o cliente recarrega do
servidor em vez de sobrescrever.

Na primeira carga, se o servidor ainda não tem nada e existe state no localStorage
daquele aparelho, ele é enviado para o servidor — é a migração de quem já usava o app
offline. A cópia local **não** é apagada, serve de rede de segurança.

### Cuidados na Vercel

- O handler é `module.exports = app` em `app.js`, com `builds`/`routes` no `vercel.json`.
- `includeFiles` precisa listar `index.html`, `src/**` e os ícones, senão eles não entram
  no bundle da função e o app não carrega.
- A conexão do Mongo fica em cache no `global` porque a mesma instância atende várias
  requisições; abrir um pool por invocação estoura o limite de conexões do Atlas.
- O Express **não** serve o diretório inteiro: só `/src` e uma lista fixa de ícones; todo
  o resto cai no `index.html`. É o que impede `.env`, `server/` e `.git/` de vazarem.

Regra que mantém isso navegável: **só `actions.js` muda dinheiro**. `modals.js` lê o DOM e
delega; `render.js` só desenha. Actions validam, mostram toast em erro e retornam
`true`/`false` — o chamador usa o retorno para fechar o modal ou limpar os campos.

Há import circular entre `render.js`, `actions.js` e `modals.js`. É intencional e seguro
(só há chamadas em tempo de execução, nunca na avaliação do módulo). Não adicione código
de topo de módulo que chame funções importadas.

## Telas

`tabHome` (saldo da conta + ações rápidas + total guardado + fluxo mensal), `tabHistory`,
`tabReserve` (lista de reservas), `tabReserveDetail` (fora do menu: aberta ao clicar numa
reserva), `tabReports`, `tabData`, `tabSettings`.

Nova tela = `div.tab-content#tabX` no `index.html` + `<button data-tab="tabX">` no
`.menu-panel` + entrada em `TAB_HOOKS` (`events.js`).

## Convenções ao editar

- Toda string de usuário interpolada em `innerHTML` passa por `escapeHtml()`.
- Nada de `<select>` nativo: use `initDropdown` / `setDropdownOptions` de `dropdown.js`.
  A lista é renderizada em `position:fixed` no `body` para não ser cortada por modais.
- Gráficos vivem dentro de `.chart-box` (altura fixa) e usam `responsive: true` — não
  dimensione canvas na mão nem crie scroll horizontal.
- Valores em tela via `formatCurrency()` (Intl, BRL); datas via `toISODateLocal()`.
- Feedback com `showToast(msg)` — não use `alert`.
- `renderAll()` é o ponto de commit: chama `saveState()` e re-renderiza tudo.
- Cores sempre pelos tokens de `:root` (`src/css/base.css`). `--accent` é definido em
  runtime a partir de `profile.color`, e os tons derivados saem de `color-mix()` — então
  um hex fixo no CSS de componente quebra a personalização do usuário. O usuário escolhe
  qualquer cor num `input[type=color]`, então **nunca** escreva texto sobre `--accent`
  com uma cor fixa: use `--accent-ink`, que `renderProfile()` calcula com `readableInk()`
  para manter contraste.
- Visual é **flat**: componentes não têm borda. Agrupamento é por fundo `--sunk` e
  espaçamento; dentro de um card `--sunk`, campos e botões usam `--surface`. Não
  reintroduza `border:1px solid var(--line)` em card, input, botão ou item de lista.
- `#app` não pode ter altura travada (`height:100%` em `html,body` quebrava o painel
  branco no meio da página ao rolar). Só `min-height:100vh` no `body`.
