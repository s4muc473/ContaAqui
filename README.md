# MyCoin - Controle Financeiro Pessoal

## O que é?

MyCoin é um **app web de controle financeiro pessoal** que roda direto no navegador. Você
anota o que entra e o que sai de uma conta única e separa dinheiro em reservas — tudo
salvo no seu próprio navegador.

---

## Como funciona?

### 📱 Estrutura
- `index.html` com o markup das telas
- `src/css/` com os estilos e `src/js/` com os módulos JavaScript
- `app.js` e `server/` com a API em Express
- Seus dados ficam no **MongoDB**, protegidos por usuário e senha

```
app.js     servidor (API + entrega do front)
server/    db, autenticação e rotas
index.html
src/css/   base, layout, components, screens, goals
src/js/    state, actions, render, charts, modals, dropdown, nav, events, api, main…
```

---

## Como rodar

```bash
npm install
cp .env.example .env    # preencha MONGODB_URI e JWT_SECRET
npm run dev
```

Depois acesse `http://localhost:3000`. No primeiro acesso o app pede para **criar o
usuário e a senha**; nos seguintes, mostra a tela de login.

Precisa de um banco local em vez do Atlas?

```bash
docker run -d --name mycoin-mongo -p 27018:27017 mongo:7
# no .env: MONGODB_URI=mongodb://127.0.0.1:27018
```

Para dar uma olhada com **dados de exemplo**, acesse `http://localhost:3000/?demo=1`.
Esse modo não pede login nem usa o banco: roda só no navegador, num armazenamento
separado, e um selo no topo mostra quando está ativo.

---

## Publicar na Vercel

O projeto já vem com `vercel.json` pronto. Na Vercel, configure em
**Settings → Environment Variables**:

| Variável | Valor |
|---|---|
| `MONGODB_URI` | string completa do Atlas (`mongodb+srv://usuario:senha@cluster.../`) |
| `JWT_SECRET` | segredo longo e aleatório, 16+ caracteres |
| `MONGODB_DB` | opcional, padrão `mycoin` |

Gere o segredo com:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

No Atlas, libere o acesso de rede para a Vercel em **Network Access** (as funções não têm
IP fixo, então o normal é liberar `0.0.0.0/0` e proteger pela senha do banco).

Nenhuma credencial fica no repositório: o `.env` está no `.gitignore`.

---

## Funcionalidades

### 1. 🏠 Início
- **Saldo da conta** em destaque, no topo
- Ações rápidas: **Entrada**, **Saída**, **Guardar** e **Resgatar**
- **Total guardado** somando todas as reservas
- Entradas e saídas do ciclo atual
- Gráfico de **fluxo mensal** (entradas x saídas)

### 2. 🕐 Histórico
Todas as transações, com filtro por tipo. Entradas em verde, saídas em vermelho.
Clique em qualquer linha para ver os detalhes, editar ou excluir.

### 3. 💰 Guardado
Lista das suas reservas com saldo e progresso da meta. Clicando em uma reserva você abre
a tela dela, com:
- saldo e meta
- botões para **guardar**, **resgatar**, definir **meta** e **editar**
- gráfico de crescimento x resgates só daquela reserva
- as movimentações dela

Abaixo da lista ficam os gráficos de acompanhamento de metas e de crescimento x resgates
de todas as reservas juntas.

### 4. 📊 Fluxo Mensal
Relatório por ciclo: entradas x saídas, metas ativas, saldo de cada mês e os valores por
categoria.

### 5. 📋 Dados
- **Baixar backup**: salva um arquivo `.json` com tudo
- **Importar arquivo**: restaura de um backup
- Também dá para ver e colar o JSON na mão

### 6. ⚙️ Configurações
- **Perfil**: seu nome e a **cor principal** do app (qualquer cor). O avatar mostra a
  inicial do seu nome
- **Conta**: trocar a senha e sair do aparelho
- **Ciclo financeiro**: o dia do mês em que seu ciclo começa (padrão: dia 6)
- **Categorias**: para classificar entradas e saídas

---

## Como usar?

1. Em **Configurações**, coloque seu nome, escolha a cor e crie suas categorias.
2. Em **Início**, registre uma **Entrada** quando receber dinheiro.
3. Registre as **Saídas** conforme for gastando.
4. Use **Guardar** para separar dinheiro numa reserva, e **Resgatar** para trazer de volta.
5. Em **Guardado**, abra uma reserva e defina uma **meta** para acompanhar o progresso.

---

## Dicas importantes

- **Seus dados ficam no servidor**, ligados ao seu usuário — dá para abrir de outro
  aparelho fazendo login
- **Baixe o backup** de vez em quando, em **Dados**
- **O ciclo financeiro** define como os meses são contados (seu mês pode não começar no dia 1)

---

## Tecnologias usadas
- **HTML5** - estrutura
- **CSS3** - estilização (com variáveis de cor)
- **JavaScript (módulos ES)** - lógica e interatividade
- **Chart.js** - gráficos
- **Font Awesome** - ícones
- **Express + MongoDB** - API e armazenamento
- **Vercel** - hospedagem

---

Desenvolvido como ferramenta pessoal de gestão financeira 💚
