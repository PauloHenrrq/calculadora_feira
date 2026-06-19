# LOGS.md — Calculadora da Feira History

---

## [2026-06-19] Simplificação e Alinhamento das Labels do Formulário de Peso

### What was done
1. **Labels de Peso Simplificadas**:
   - Modificado o rótulo do formulário de criação de "Quantidade / Peso" para apenas "Peso".
   - Modificado o rótulo no formulário de edição do modal de "Peso / Qtd" para apenas "Peso".
   - O ajuste garante que os elements de label fiquem concisos, mantendo perfeita proporção de alinhamento com as caixas de input nas colunas laterais.
2. **Service Worker v12**:
   - Atualizado o cache local do Service Worker em `sw.js` para a versão `v12` para garantir que o navegador da cliente detecte e ative a nova versão do layout HTML e estilos.

---

## [2026-06-19] Correção de Fechamento do CSS e Redesenho do Switch Pill Selector

### What was done
1. **Correção de Chave do CSS**:
   - Corrigida a falta de fechamento (`}`) na classe `.hidden` em `style.css` que estava quebrando silenciosamente todo o processamento de regras CSS declaradas após a linha 855.
2. **Redesenho do Pill Switch Selector (KG / g)**:
   - Remodelado o `.unit-selector` e `.unit-option` para criar um switch pill totalmente arredondado com bordas discretas e fundo off-white.
   - Definida a cor ativa do botão como verde (`var(--green)`) com texto em branco e sombra leve.
   - O alinhamento horizontal com o label "Quantidade / Peso" foi normalizado e posicionado de forma proporcional e atrativa.

---

## [2026-06-19] Máscara Decimal em Tempo Real, Conversão em Cliques e Upgrade de Exclusão

### What was done
1. **Máscara Decimal em Tempo Real**:
   - Implementada a máscara `applyDecimalMask` atrelada aos quatro inputs numéricos (Preço, Peso, e os respectivos campos no Modal de Edição). O usuário digita apenas inteiros e o input formata de trás para frente como decimal (ex: `600` vira `6,00`).
   - Atualizada a helper `parseInputNumber` para limpar separadores de milhares (pontos) e converter vírgulas em pontos, garantindo a integridade dos cálculos no parser.
2. **Conversão de Unidade em Tempo Real**:
   - Atualizado o seletor de unidade (`KG` / `g`) para converter o valor atual digitado no input de peso instantaneamente no clique (multiplicando ou dividindo por 1000) e formatar o valor convertido na máscara.
3. **Upgrade no Botão de Apagar (Double Click)**:
   - Removido o delay de animação e expansão de texto. O botão mantém o tamanho circular original (`34x34px`) e o ícone `✕`. 
   - Ao primeiro clique, o botão muda de cor para vermelho sólido com efeito de escala (pulso) e sombra pulsante. O segundo clique dentro de 3 segundos efetiva a remoção imediata do item.
4. **Service Worker com Auto-Reload**:
   - Configurado o fluxo de escuta ao Service Worker no `app.js`. Quando detectada e instalada uma nova versão (cache versionado `feira-calc-v11`), o app recarrega a página automaticamente para garantir que a cliente obtenha as melhorias sem ação manual.

---

## [2026-06-19] Alternância de Unidade (KG/g) & Tratamento de Entrada com Vírgula

### What was done
1. **Alternância de Unidade (KG/g)**:
   - Adicionada estrutura visual de botões de unidade (`KG` ou `g`) no formulário de inserção e no modal de edição.
   - Atualizados os métodos `addItem`, `openEditModal` e `saveEditModal` em `app.js` para ler e salvar a unidade escolhida (`unit`).
   - Adicionada a helper `getItemQtyInKg` para converter gramas (`g`) para quilos (`kg`) antes de realizar os cálculos matemáticos.
   - Renderização dinâmica do peso na lista de itens e no compartilhamento do WhatsApp (`350 g` ou `1.2 kg`).
2. **Tratamento de Entrada com Vírgula**:
   - Criação da helper `parseInputNumber` para converter inputs de texto numérico substituindo vírgulas por pontos (`replace(/,/g, '.')`), garantindo alta resiliência e suporte a teclados numéricos móveis do Brasil.
   - Mudança dos tipos de inputs numéricos no HTML de `number` para `text` com `inputmode="decimal"`, resolvendo bloqueios de digitação em celulares e arredondando cálculos centesimais.
3. **Compatibilidade com Dados Antigos**:
   - O carregamento do local storage foi projetado para manter a unidade `'kg'` como padrão caso `item.unit` esteja ausente, garantindo compatibilidade reversa total com as listas gravadas pela cliente.
4. **Precisão de Arredondamento**:
   - Implementado arredondamento manual das contas matemáticas e totais para no máximo duas casas decimais no JavaScript para evitar discrepâncias geradas por dízimas de ponto flutuante.

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
