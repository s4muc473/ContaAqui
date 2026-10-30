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
- Usa o **localStorage do navegador** para salvar seus dados
- Sem build, sem instalação de pacotes

```
index.html
src/css/   base, layout, components, screens, goals
src/js/    state, actions, render, charts, modals, dropdown, nav, events, main…
```

---

## Como rodar

O JavaScript usa módulos ES, então o app precisa ser aberto por um servidor (abrir o
arquivo direto pelo `file://` não funciona):

```bash
python3 -m http.server 8777
```

Depois acesse `http://localhost:8777`.

Para dar uma olhada com **dados de exemplo**, acesse `http://localhost:8777/?demo=1`.
O modo de exemplo usa um armazenamento separado e não mexe nos seus dados reais — um selo
no topo mostra quando ele está ativo.

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

- **Tudo fica salvo no navegador**: se limpar os dados do navegador, perde tudo
- **Baixe o backup** de vez em quando
- **O ciclo financeiro** define como os meses são contados (seu mês pode não começar no dia 1)

---

## Tecnologias usadas
- **HTML5** - estrutura
- **CSS3** - estilização (com variáveis de cor)
- **JavaScript (módulos ES)** - lógica e interatividade
- **Chart.js** - gráficos
- **Font Awesome** - ícones
- **localStorage** - salvamento de dados

---

Desenvolvido como ferramenta pessoal de gestão financeira 💚
