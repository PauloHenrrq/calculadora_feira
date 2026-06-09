# LOGS.md — Calculadora da Feira History

---

## [2026-06-09] Deduplicação e Comparador no Histórico

### What was done
1. **listsAreEqual**:
   - Criação da função de comparação lógica de conteúdo de itens de duas listas separadas.
2. **Prevenção de Duplicatas**:
   - Refatoração do salvamento de histórico para trazer a lista existente para o topo caso seja idêntica, atualizando apenas a data.

---

## [2026-06-09] Edição Baseada em Modal Simples

### What was done
1. **Modal de Edição**:
   - Adicionada estrutura `<div id="editModal">` no HTML.
   - Integração com `openEditModal`, `closeEditModal` e `saveEditModal` no JS.
   - Remoção dos inputs inline, retornando os cards ao layout normal sem quebras de linha indesejadas.

---

## [2026-06-09] Resolução do SyntaxError

### What was done
1. **Consertado Crash do Script**:
   - Removida a linha `let confirmCallback = null;` duplicada na linha 459 do `app.js` que crashava o carregamento do Javascript no navegador.

---

## [2026-06-09] Melhorias de Robustez & UX (Check Final)

### What was done
1. **Edição Inline**:
   - Criação de botão de lápis e renderização inline de formulário de alteração de preço e quantidade por item.
2. **Exclusão com Confirmação Visual**:
   - Botão "✕" agora exige confirmação visual ("Apagar?") para evitar cliques acidentais.
3. **Bloqueador no Carregamento de Histórico**:
   - Exibição de modal de alerta antes de carregar listas antigas caso a lista ativa contenha produtos.

---

## [2026-06-09] Posicionamento Vertical da Etiqueta

### What was done
1. **Verticalização**:
   - Posicionamos a Etiqueta debaixo das informações de Custo, facilitando o espaçamento e a leitura vertical no card do produto.

---

## [2026-06-09] Ajuste de Tipografia & Sinais do Lucro

### What was done
1. **Limpeza do indicador de Lucro**:
   - Sinal `+` removido da frente do valor de Lucro do card do item.
   - Tamanho da fonte do valor de Lucro do card do item reduzido de `1.2rem` para `1.05rem` (redução de ~2px).

---

## [2026-06-09] Otimização Visual do Card

### What was done
1. **Redesenho do Grid do Item**:
   - Nome e peso unificados na primeira linha.
   - Custo total e Preço da Etiqueta dispostos em uma única linha inline secundária separados por `|` com `white-space: nowrap` para evitar quebras em telas compactas.
   - Lucro do item e exclusão mantidos à direita de forma limpa.

---

## [2026-06-09] Exibição de Lucro Estimado

### What was done
1. **Lucro Líquido no Item**:
   - Trocamos "Venda Total" para **"Lucro"** nos cards da lista. O ganho líquido é exibido em verde (Ex: `+ R$ 3,00`).
2. **Rodapé com duas colunas**:
   - O rodapé agora expõe o **Total a Pagar (Custo)** e o **Lucro Projetado** lado a lado.
3. **WhatsApp e Histórico**:
   - Ajustamos o texto de compartilhamento e o histórico de compras salvas para reportarem o Lucro Estimado de forma clara.

---

## [2026-06-09] Lógica de Custos & Laranja Forte

### What was done
1. **Lógica de Margem de Venda vs Custo**:
   - O total do rodapé agora soma apenas o custo da feira (sem margem).
   - O item exibe:
     - Custo real (Kg × Preço original).
     - Preço na etiqueta (Preço original + % aplicada).
     - Retorno do mercadinho (Total original + % aplicada).
2. **Cores do Laranja Fortalecidas**:
   - Ajustamos as variáveis CSS da margem de acréscimo para um laranja escuro (`#c2410c`) e claro (`#ffedd5`) de alto contraste.
3. **Compartilhamento & Histórico**:
   - O WhatsApp envia os dois totais (Compra e Vendas) e detalha o custo de cada item e o valor de venda.
   - O histórico armazena e exibe a distinção de Custo e Retorno.

---

## [2026-06-09] UI/UX & Acessibilidade — Refatoração KISS

### What was done
1. **Redução de carga cognitiva (KISS)**: Separamos o formulário de inserção da lista de produtos e do histórico através de uma navegação por abas (`Ver Lista`, `Novo Item`, `Histórico`).
2. **Nítido focus state**: Adicionamos bordas de `2px` nos inputs e destacamos o campo com um anel de foco verde visível.
3. **Fundo confortável**: Alteramos o fundo da tela para um tom suave de off-white (`#f1f5f9`) que diminui o brilho e cansaço visual.
4. **Ícones SVG**: Emojis substituídos por ícones SVG inline limpos.
5. **Redirecionamento automático**: O usuário é levado de volta à aba `Ver Lista` logo após adicionar um produto com sucesso.

---

## [2026-06-09] Initial Build — MVP Complete

### What was done
1. **Experiment structure created** — `GEMINI.md` with inheritance from root
2. **Complete PWA built** (HTML + CSS + JS):
   - Premium light theme with Inter font, green/amber accent system
   - Add items: Name + Price/KG + Quantity
   - Global configurable markup % (default 40%) with +/- buttons
   - Real-time total calculation
   - Item search/filter
   - History system (localStorage, up to 20 saved lists)
   - Share via WhatsApp (Web Share API with clipboard fallback)
   - Confirm modal for destructive actions
   - Toast notifications
   - Slide-in/out animations for items
3. **PWA support** — manifest.json + service worker for offline use
4. **App icon generated** — 512px PNG for PWA installation

### Technical Stack
- HTML5 (semantic, mobile-optimized)
- CSS3 (custom properties, animations, mobile-first)
- Vanilla JavaScript (zero dependencies)
- Service Worker (cache-first offline strategy)
- localStorage (data persistence)

### Verified
- ✅ Calculations correct: 1.5kg × R$5.00 × 1.40 = R$10.50
- ✅ Items add/remove with animations
- ✅ Markup adjustment recalculates all items
- ✅ Mobile layout clean and accessible
