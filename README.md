# 🛒 Calculadora da Feira PWA

[![PWA](https://img.shields.io/badge/PWA-Offline--First-orange.svg?style=flat-square)](https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20Vanilla-blue.svg?style=flat-square)]()
[![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-green.svg?style=flat-square)](https://PauloHenrrq.github.io/calculadora_feira/)

Uma ferramenta web responsiva, rápida e focada em utilidade para planejamento de compras e revenda de feira com cálculo de lucro e margem de lucro (markup) integrada. Desenvolvida sob o conceito de **PWA (Progressive Web App)**, funciona 100% offline direto no celular da cliente.

---

## ✨ Funcionalidades Principais

*   **⚡ Cálculo de Margem Comercial (Markup)**: Defina a porcentagem de lucro desejada e veja o preço sugerido na etiqueta de venda por quilo ser calculado instantaneamente.
*   **📊 Indicador de Lucro Projetado**: Mostra em destaque no rodapé o ganho líquido real gerado pela diferença entre o custo pago e a venda projetada.
*   **✏️ Edição de Itens via Modal**: Edite preços e pesos de forma simples em um modal dedicado que evita quebras de layout na visualização móvel.
*   **🛡️ Exclusão Segura (Dois Cliques)**: Previne toques acidentais exigindo dois cliques com confirmação visual no botão "✕" para apagar um item.
*   **💾 Histórico com Deduplicação Inteligente**: Salve e recupere listas anteriores. Se você tentar salvar uma lista idêntica, o sistema evita duplicatas e apenas traz a antiga de volta para o topo com a data atualizada.
*   **💬 Compartilhamento Direto (WhatsApp)**: Gera um texto perfeitamente formatado e limpo contendo todos os itens, custos e lucros projetados pronto para envio.
*   **🌐 PWA & Offline First**: Funciona sem internet na feira. Instale diretamente como aplicativo nativo no celular.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias puras (Vanilla) para maximizar a performance, compatibilidade e tempo de carregamento em redes móveis instáveis:

*   **HTML5** estruturado e semântico.
*   **CSS3** responsivo com variáveis de cores (tema vibrante laranja/âmbar).
*   **Javascript (ES6+)** puro para gerenciamento de estado e reatividade de DOM.
*   **Service Workers** para cache local completo de assets e execução offline.
*   **Web App Manifest** para habilitar a instalação PWA no celular.

---

## 📱 Instalação no Celular

### **Android (Chrome)**
1. Abra o link do deploy no navegador.
2. Clique no banner inferior **"Adicionar à tela inicial"** ou nos três pontinhos superiores e selecione **"Instalar aplicativo"**.

### **iOS (Safari)**
1. Abra o link do deploy no navegador Safari.
2. Clique no botão de **Compartilhar** (ícone de quadrado com seta para cima no rodapé).
3. Role as opções para baixo e clique em **"Adicionar à Tela de Início"**.

---

## ⚙️ Como Executar Localmente

Se você deseja rodar e testar o projeto no seu computador:

1. Clone este repositório dedicado:
   ```bash
   git clone https://github.com/PauloHenrrq/calculadora_feira.git
   ```
2. Navegue até a pasta:
   ```bash
   cd calculadora_feira
   ```
3. Abra o arquivo `index.html` diretamente no seu navegador, ou suba um servidor local simples usando Python ou NPM:
   ```bash
   # Utilizando NPM
   npx serve -l 3030
   
   # Ou utilizando Python
   python -m http.server 3030
   ```
4. Acesse `http://localhost:3030` no seu navegador.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Sinta-se livre para usar, clonar e modificar para suas próprias necessidades.

---

*Desenvolvido com carinho para otimizar as compras de feira da família! 🧡*
