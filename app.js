/* ═══════════════════════════════════════════════
   FEIRA CALC — Application Logic (KISS Version)
   Pure vanilla JS, tab navigation, local persistence
   ═══════════════════════════════════════════════ */

// ── State ──
const STORAGE_KEYS = {
  items: 'feira-calc-items',
  markup: 'feira-calc-markup',
  history: 'feira-calc-history'
};

let confirmCallback = null;

let state = {
  items: [],
  markup: 40,
  history: [],
  searchQuery: '',
  activeTab: 'list',
  editingItemId: null
};

// ── DOM References ──
const dom = {
  addForm: document.getElementById('addItemForm'),
  itemName: document.getElementById('itemName'),
  itemPrice: document.getElementById('itemPrice'),
  itemQty: document.getElementById('itemQty'),
  markupInput: document.getElementById('markupInput'),
  markupMinus: document.getElementById('markupMinus'),
  markupPlus: document.getElementById('markupPlus'),
  searchInput: document.getElementById('searchInput'),
  searchClear: document.getElementById('searchClear'),
  itemsList: document.getElementById('itemsList'),
  emptyState: document.getElementById('emptyState'),
  itemCount: document.getElementById('itemCount'),
  totalValue: document.getElementById('totalValue'),
  totalProfit: document.getElementById('totalProfit'),
  btnShare: document.getElementById('btnShare'),
  btnSave: document.getElementById('btnSave'),
  btnClear: document.getElementById('btnClear'),
  confirmModal: document.getElementById('confirmModal'),
  confirmTitle: document.getElementById('confirmTitle'),
  confirmMessage: document.getElementById('confirmMessage'),
  confirmOk: document.getElementById('confirmOk'),
  confirmCancel: document.getElementById('confirmCancel'),
  editModal: document.getElementById('editModal'),
  editForm: document.getElementById('editForm'),
  editItemName: document.getElementById('editItemName'),
  editItemPrice: document.getElementById('editItemPrice'),
  editItemQty: document.getElementById('editItemQty'),
  editModalCancel: document.getElementById('editModalCancel'),
  toast: document.getElementById('toast'),
  historyList: document.getElementById('historyList'),
  tabButtons: document.querySelectorAll('.tab-button'),
  tabViews: {
    list: document.getElementById('tab-view-list'),
    add: document.getElementById('tab-view-add'),
    history: document.getElementById('tab-view-history')
  }
};

// ── Tab Router ──
function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Update nav buttons
  dom.tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Toggle views
  Object.keys(dom.tabViews).forEach(key => {
    dom.tabViews[key].classList.toggle('hidden', key !== tabId);
  });

  // Render specific content if needed
  if (tabId === 'history') {
    renderHistory();
  } else if (tabId === 'list') {
    render();
  }
}

dom.tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.getAttribute('data-tab'));
  });
});

// ── Utility Functions ──
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} às ${hours}:${mins}`;
}

function showToast(message, duration = 2000) {
  dom.toast.textContent = message;
  dom.toast.classList.remove('hidden');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => dom.toast.classList.add('hidden'), duration);
}

// ── Storage ──
function saveToStorage() {
  localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(state.items));
  localStorage.setItem(STORAGE_KEYS.markup, state.markup.toString());
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
}

function loadFromStorage() {
  try {
    const items = localStorage.getItem(STORAGE_KEYS.items);
    const markup = localStorage.getItem(STORAGE_KEYS.markup);
    const history = localStorage.getItem(STORAGE_KEYS.history);
    if (items) state.items = JSON.parse(items);
    if (markup) state.markup = parseFloat(markup);
    if (history) state.history = JSON.parse(history);
  } catch (e) {
    console.warn('Failed to load from storage:', e);
  }
}

// ── Calculation ──
function calculateItemTotal(pricePerKg, quantity, markup) {
  // Retorna o custo real sem margem
  return pricePerKg * quantity;
}

function getListTotal() {
  // Retorna a soma do custo real de todos os itens (sem acréscimo)
  return state.items.reduce((sum, item) => {
    return sum + (item.pricePerKg * item.quantity);
  }, 0);
}

function getListVendaTotal() {
  // Retorna a soma do valor de venda com acréscimo de todos os itens
  return state.items.reduce((sum, item) => {
    return sum + (item.pricePerKg * item.quantity * (1 + state.markup / 100));
  }, 0);
}

function getListProfitTotal() {
  // Retorna o lucro total acumulado
  return getListVendaTotal() - getListTotal();
}

// ── CRUD Operations ──
function addItem(name, pricePerKg, quantity) {
  const item = {
    id: generateId(),
    name: name.trim(),
    pricePerKg: parseFloat(pricePerKg),
    quantity: parseFloat(quantity)
  };
  state.items.unshift(item);
  saveToStorage();
  render();
  showToast(`✅ ${item.name} adicionado!`);
}

// Global functions for inline onclick events
window.handleDeleteClick = function(id, btn) {
  if (btn.classList.contains('confirming')) {
    window.removeItem(id);
  } else {
    // Reset all other pending deletions first
    document.querySelectorAll('.item-delete.confirming').forEach(b => {
      b.classList.remove('confirming');
      b.innerHTML = '✕';
      if (b.dataset.timeoutId) clearTimeout(parseInt(b.dataset.timeoutId));
    });
    
    btn.classList.add('confirming');
    btn.innerHTML = 'Apagar?';
    
    const timeoutId = setTimeout(() => {
      btn.classList.remove('confirming');
      btn.innerHTML = '✕';
    }, 3500);
    btn.dataset.timeoutId = timeoutId;
  }
};

window.removeItem = function(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    const btn = card.querySelector('.item-delete');
    if (btn && btn.dataset.timeoutId) {
      clearTimeout(parseInt(btn.dataset.timeoutId));
    }
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';
    setTimeout(() => {
      state.items = state.items.filter(item => item.id !== id);
      saveToStorage();
      render();
    }, 150);
  }
};

window.openEditModal = function(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  state.editingItemId = id;
  dom.editItemName.value = item.name;
  dom.editItemPrice.value = item.pricePerKg;
  dom.editItemQty.value = item.quantity;
  
  dom.editModal.classList.remove('hidden');
};

window.closeEditModal = function() {
  dom.editModal.classList.add('hidden');
  state.editingItemId = null;
};

window.saveEditModal = function() {
  const id = state.editingItemId;
  if (!id) return;

  const newPrice = parseFloat(dom.editItemPrice.value);
  const newQty = parseFloat(dom.editItemQty.value);

  if (isNaN(newPrice) || newPrice <= 0 || isNaN(newQty) || newQty <= 0) {
    showToast('⚠️ Preço e quantidade inválidos');
    return;
  }

  const item = state.items.find(i => i.id === id);
  if (item) {
    item.pricePerKg = newPrice;
    item.quantity = newQty;
    saveToStorage();
    render();
    window.closeEditModal();
    showToast('✏️ Item atualizado!');
  }
};

function clearList() {
  state.items = [];
  saveToStorage();
  render();
  showToast('🗑️ Lista limpa!');
}

function listsAreEqual(listA, listB) {
  if (listA.length !== listB.length) return false;
  const sortedA = [...listA].sort((a, b) => a.name.localeCompare(b.name));
  const sortedB = [...listB].sort((a, b) => a.name.localeCompare(b.name));
  return sortedA.every((itemA, idx) => {
    const itemB = sortedB[idx];
    return (
      itemA.name.toLowerCase().trim() === itemB.name.toLowerCase().trim() &&
      itemA.pricePerKg === itemB.pricePerKg &&
      itemA.quantity === itemB.quantity
    );
  });
}

function saveListToHistory() {
  if (state.items.length === 0) {
    showToast('⚠️ Lista vazia — nada para salvar');
    return;
  }

  // Verifica se já existe uma lista com os mesmos itens e markup
  const existingIdx = state.history.findIndex(entry => 
    entry.markup === state.markup && listsAreEqual(entry.items, state.items)
  );

  if (existingIdx !== -1) {
    // Atualiza a data e traz para a frente do histórico (topo)
    const existingEntry = state.history[existingIdx];
    existingEntry.date = new Date().toISOString();
    state.history.splice(existingIdx, 1);
    state.history.unshift(existingEntry);
    saveToStorage();
    showToast('💾 Lista idêntica encontrada! Trazida para o topo.');
    return;
  }

  const entry = {
    id: generateId(),
    date: new Date().toISOString(),
    markup: state.markup,
    total: getListTotal(), // Salva o custo real da compra
    vendaTotal: getListVendaTotal(), // Salva o total de vendas projetado
    items: JSON.parse(JSON.stringify(state.items))
  };
  state.history.unshift(entry);
  if (state.history.length > 20) state.history = state.history.slice(0, 20);
  saveToStorage();
  showToast('💾 Lista salva no histórico!');
}

window.loadFromHistory = function(historyId) {
  const entry = state.history.find(h => h.id === historyId);
  if (!entry) return;
  
  const loadAction = () => {
    state.items = JSON.parse(JSON.stringify(entry.items));
    state.markup = entry.markup;
    dom.markupInput.value = state.markup;
    saveToStorage();
    render();
    switchTab('list');
    showToast('📋 Lista carregada!');
  };

  if (state.items.length > 0) {
    showConfirm(
      'Substituir Lista Atual?',
      'Sua lista atual possui produtos. Quer substituí-la pela lista salva no histórico?',
      loadAction
    );
  } else {
    loadAction;
    loadAction();
  }
};

window.deleteFromHistory = function(historyId) {
  state.history = state.history.filter(h => h.id !== historyId);
  saveToStorage();
  renderHistory();
  showToast('🗑️ Entrada removida');
};

// ── Rendering ──
function render() {
  renderItems();
  renderTotal();
  renderItemCount();
}

function renderItems() {
  const filtered = state.searchQuery
    ? state.items.filter(item =>
        item.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
    : state.items;

  if (state.items.length === 0) {
    dom.itemsList.innerHTML = '';
    dom.emptyState.classList.remove('hidden');
    return;
  }

  dom.emptyState.classList.add('hidden');

  if (filtered.length === 0) {
    dom.itemsList.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">Nenhum produto encontrado</p>
      </div>`;
    return;
  }

  dom.itemsList.innerHTML = filtered.map(item => {
    const custoTotal = item.pricePerKg * item.quantity;
    const precoVendaKg = item.pricePerKg * (1 + state.markup / 100);
    const lucro = (item.pricePerKg * (state.markup / 100)) * item.quantity;

    return `
      <div class="item-card" data-id="${item.id}">
        <div class="item-info">
          <div class="item-name">${escapeHtml(item.name)}</div>
          <div class="item-detail">
            <div>Custo: ${item.quantity} kg × ${formatCurrency(item.pricePerKg)}/kg = <strong>${formatCurrency(custoTotal)}</strong></div>
            <div style="color: var(--amber); font-weight: 700; margin-top: 3px; font-size: 0.9rem;">
              Etiqueta: ${formatCurrency(precoVendaKg)}/kg
            </div>
          </div>
        </div>
        <div style="text-align: right; display: flex; flex-direction: column; justify-content: center; align-items: flex-end; flex-shrink: 0; margin-right: 2px;">
          <div class="item-price" style="color: var(--green); font-size: 1.05rem; font-weight: 800;">${formatCurrency(lucro)}</div>
          <div style="font-size: 0.65rem; color: var(--green); font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1px;">Lucro</div>
        </div>
        <div class="item-actions">
          <button class="item-edit" onclick="openEditModal('${item.id}')" aria-label="Editar ${escapeHtml(item.name)}">
            <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button class="item-delete" onclick="handleDeleteClick('${item.id}', this)" aria-label="Remover ${escapeHtml(item.name)}">✕</button>
        </div>
      </div>`;
  }).join('');
}

function renderTotal() {
  const total = getListTotal();
  const profit = getListProfitTotal();
  dom.totalValue.textContent = formatCurrency(total);
  dom.totalProfit.textContent = formatCurrency(profit);
}

function renderItemCount() {
  const count = state.items.length;
  dom.itemCount.textContent = count === 1 ? '1 item' : `${count} itens`;
}

function renderHistory() {
  if (state.history.length === 0) {
    dom.historyList.innerHTML = `
      <div class="empty-state">
        <div class="empty-illustration">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-svg-illustration"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <p class="empty-title">Nenhuma compra salva</p>
        <p class="empty-sub">Toque em <strong>"Salvar"</strong> no rodapé para guardar uma lista</p>
      </div>`;
    return;
  }

  dom.historyList.innerHTML = state.history.map(entry => {
    const itemNames = entry.items.slice(0, 3).map(i => i.name).join(', ');
    const more = entry.items.length > 3 ? ` +${entry.items.length - 3}` : '';
    
    const totalCompra = entry.total;
    const totalVenda = entry.vendaTotal || (entry.total * (1 + entry.markup / 100));
    const lucroTotal = totalVenda - totalCompra;

    return `
      <div class="history-card">
        <div class="history-date">${formatDate(entry.date)}</div>
        <div class="history-summary">${escapeHtml(itemNames)}${more} · Acréscimo: ${entry.markup}%</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Custo Feira</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-secondary);">${formatCurrency(totalCompra)}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Lucro Estimado</div>
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--green);">${formatCurrency(lucroTotal)}</div>
          </div>
        </div>
        <div class="history-actions" style="margin-top: 14px;">
          <button class="history-btn load" onclick="loadFromHistory('${entry.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2v15"/></svg>
            Carregar
          </button>
          <button class="history-btn delete" onclick="deleteFromHistory('${entry.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Excluir
          </button>
        </div>
      </div>`;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Confirm Modal ──

function showConfirm(title, message, onConfirm) {
  dom.confirmTitle.textContent = title;
  dom.confirmMessage.textContent = message;
  confirmCallback = onConfirm;
  dom.confirmModal.classList.remove('hidden');
}

function closeConfirm() {
  dom.confirmModal.classList.add('hidden');
  confirmCallback = null;
}

// ── Share ──
function shareList() {
  if (state.items.length === 0) {
    showToast('⚠️ Lista vazia — nada para compartilhar');
    return;
  }

  let text = `🥬 *Feira Calc — Lista de Compras & Margens*\n`;
  text += `📅 ${new Date().toLocaleDateString('pt-BR')}\n`;
  text += `📊 Acréscimo do mercadinho: ${state.markup}%\n\n`;

  state.items.forEach(item => {
    const custoTotal = item.pricePerKg * item.quantity;
    const precoVendaKg = item.pricePerKg * (1 + state.markup / 100);
    const lucro = (item.pricePerKg * (state.markup / 100)) * item.quantity;

    text += `• *${item.name}* (${item.quantity}kg)\n`;
    text += `  └ Custo Feira: ${formatCurrency(item.pricePerKg)}/kg (Total: ${formatCurrency(custoTotal)})\n`;
    text += `  └ Etiqueta Venda: *${formatCurrency(precoVendaKg)}/kg* (Lucro: *+${formatCurrency(lucro)}*)\n\n`;
  });

  const totalFeira = getListTotal();
  const totalLucro = getListProfitTotal();

  text += `💰 *TOTAL A PAGAR (Custo Feira): ${formatCurrency(totalFeira)}*\n`;
  text += `📈 *LUCRO TOTAL ESTIMADO: ${formatCurrency(totalLucro)}*`;

  if (navigator.share) {
    navigator.share({ title: 'Lista de Compras & Margens — Feira Calc', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Copiado! Envie no WhatsApp');
    }).catch(() => {
      showToast('⚠️ Erro ao copiar');
    });
  }
}

// ── Event Handlers ──
dom.addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = dom.itemName.value.trim();
  const price = dom.itemPrice.value;
  const qty = dom.itemQty.value;

  if (!name || !price || !qty) return;

  addItem(name, price, qty);
  dom.addForm.reset();
  
  // Visual feedback and redirect to list tab automatically (KISS)
  setTimeout(() => {
    switchTab('list');
  }, 300);
});

dom.markupInput.addEventListener('input', () => {
  const val = parseFloat(dom.markupInput.value);
  if (!isNaN(val) && val >= 0) {
    state.markup = val;
    saveToStorage();
    render();
  }
});

dom.markupMinus.addEventListener('click', () => {
  if (state.markup >= 5) {
    state.markup -= 5;
    dom.markupInput.value = state.markup;
    saveToStorage();
    render();
  }
});

dom.markupPlus.addEventListener('click', () => {
  state.markup += 5;
  dom.markupInput.value = state.markup;
  saveToStorage();
  render();
});

dom.searchInput.addEventListener('input', () => {
  state.searchQuery = dom.searchInput.value;
  dom.searchClear.classList.toggle('hidden', !state.searchQuery);
  renderItems();
});

dom.searchClear.addEventListener('click', () => {
  dom.searchInput.value = '';
  state.searchQuery = '';
  dom.searchClear.classList.add('hidden');
  renderItems();
});

dom.btnShare.addEventListener('click', shareList);
dom.btnSave.addEventListener('click', saveListToHistory);

dom.btnClear.addEventListener('click', () => {
  if (state.items.length === 0) return;
  showConfirm('Limpar Lista', 'Quer mesmo apagar todos os produtos da sua lista?', clearList);
});

dom.confirmOk.addEventListener('click', () => {
  if (confirmCallback) confirmCallback();
  closeConfirm();
});

dom.confirmCancel.addEventListener('click', closeConfirm);

dom.confirmModal.addEventListener('click', (e) => {
  if (e.target === dom.confirmModal) closeConfirm();
});

dom.editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveEditModal();
});

dom.editModalCancel.addEventListener('click', closeEditModal);

dom.editModal.addEventListener('click', (e) => {
  if (e.target === dom.editModal) closeEditModal();
});

// ── Initialize ──
function init() {
  loadFromStorage();
  dom.markupInput.value = state.markup;
  render();

  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

init();
