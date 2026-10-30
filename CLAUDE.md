# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

MyCoin (repo `ContaAqui`): app de controle financeiro pessoal, sem build, sem bundler,
sem dependências locais e sem testes. Interface e textos em pt-BR — mantenha assim.

Dependências vêm de CDN no `<head>`: Chart.js 4.4.0, Font Awesome 6.4.0, Google Fonts.
`Chart` é global (script clássico); os módulos do app são ES modules.

## Executar

O JS usa ES modules, então **precisa ser servido por HTTP** — abrir o arquivo via
`file://` não funciona.

```bash
python3 -m http.server 8777
```

Há um `.claude/launch.json` com essa configuração (nome `mycoin`). Em GitHub Pages
funciona direto.

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
| `main.js` | `init()` |

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
