import { state, gravarNoServidor } from './state.js';
import { api } from './api.js';
import { $, showToast } from './utils.js';
import { ui } from './ui-state.js';
import { showTab, setTabHooks } from './nav.js';
import { getReserveById } from './selectors.js';
import { initDropdown, setDropdownOptions, getDropdownValue } from './dropdown.js';
import {
  renderHistory,
  renderSettings,
  renderMonthFilter,
  renderSelectedMonthReport,
  renderReserveList,
} from './render.js';
import {
  renderFlowChart,
  renderGoalsChart,
  renderGrowthChart,
  renderReserveDetailChart,
} from './charts.js';
import {
  createCategory,
  setCycleDay,
  updateProfile,
  applyImportedState,
} from './actions.js';
import {
  openMoneyModal,
  confirmMoney,
  openMoveModal,
  confirmMove,
  confirmTx,
  deleteTx,
  closeTxModal,
  openReserveModal,
  confirmReserve,
  deleteReserveFromModal,
  openGoalModal,
  confirmGoal,
  fillMesAddCategories,
  addMesAdjustment,
  closeModal,
} from './modals.js';

const TAB_HOOKS = {
  tabHome: () => renderFlowChart(),
  tabHistory: () => renderHistory(),
  tabReserve: () => {
    renderReserveList();
    renderGoalsChart();
    renderGrowthChart();
  },
  tabReserveDetail: () => {
    if (ui.currentReserveId) renderReserveDetailChart(ui.currentReserveId);
  },
  tabReports: () => {
    renderMonthFilter();
    renderSelectedMonthReport();
  },
  tabSettings: () => openSettings(),
};

function on(id, event, handler) {
  $(id)?.addEventListener(event, handler);
}

function openSettings() {
  renderSettings();
}

function wireHeaderAndMenu() {
  on('menuToggle', 'click', () => $('menuOverlay').classList.add('open'));
  on('menuClose', 'click', () => $('menuOverlay').classList.remove('open'));
  on('settingsBtn', 'click', () => showTab('tabSettings'));
  on('avatarBtn', 'click', () => showTab('tabSettings'));

  document.querySelectorAll('.menu-panel button[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });

  $('menuOverlay').addEventListener('click', e => {
    if (e.target === $('menuOverlay')) $('menuOverlay').classList.remove('open');
  });

  document.querySelectorAll('.modal-mask').forEach(mask => {
    mask.addEventListener('click', e => {
      if (e.target === mask) closeModal(mask.id);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = [...document.querySelectorAll('.modal-mask.open')].pop();
    if (open) closeModal(open.id);
    else $('menuOverlay').classList.remove('open');
  });
}

function wireHome() {
  on('actEntry', 'click', () => openMoneyModal('ENTRY'));
  on('actExpense', 'click', () => openMoneyModal('EXPENSE'));
  on('actSave', 'click', () => openMoveModal('save'));
  on('actRescue', 'click', () => openMoveModal('rescue'));
  on('savedRow', 'click', () => showTab('tabReserve'));
  on('newReserveBtn', 'click', () => openReserveModal(null));
}

function wireReserveDetail() {
  on('reserveBack', 'click', () => {
    ui.currentReserveId = null;
    showTab('tabReserve');
  });
  on('detailSave', 'click', () => openMoveModal('save', ui.currentReserveId));
  on('detailRescue', 'click', () => openMoveModal('rescue', ui.currentReserveId));
  on('detailGoal', 'click', () => {
    const r = getReserveById(ui.currentReserveId);
    if (r) openGoalModal(r);
  });
  on('detailEdit', 'click', () => openReserveModal(ui.currentReserveId));
}

function wireModals() {
  on('moneyCancel', 'click', () => closeModal('modalMoney'));
  on('moneyConfirm', 'click', confirmMoney);

  on('moveCancel', 'click', () => closeModal('modalMove'));
  on('moveConfirm', 'click', confirmMove);

  on('txClose', 'click', closeTxModal);
  on('txConfirm', 'click', confirmTx);
  on('txDelete', 'click', deleteTx);

  on('reserveCancel', 'click', () => closeModal('modalReserve'));
  on('reserveConfirm', 'click', confirmReserve);
  on('reserveDelete', 'click', deleteReserveFromModal);

  on('editGoalCancel', 'click', () => closeModal('modalEditGoal'));
  on('editGoalConfirm', 'click', confirmGoal);
  on('editGoalEnabled', 'change', e => {
    $('editGoalFields').style.display = e.target.checked ? 'block' : 'none';
  });

  on('editMesClose', 'click', () => {
    closeModal('modalEditMes');
    renderSelectedMonthReport();
  });
  on('mesAddBtn', 'click', addMesAdjustment);
  document.querySelectorAll('#mesAddTipoToggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.mesAddTipo = btn.dataset.tipo;
      document.querySelectorAll('#mesAddTipoToggle button').forEach(b => b.classList.toggle('active', b === btn));
      fillMesAddCategories();
    });
  });
}

function wireFilters() {
  document.querySelectorAll('#tabHistory .filter-group button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tabHistory .filter-group button').forEach(b => b.classList.remove('active-filter'));
      btn.classList.add('active-filter');
      renderHistory();
    });
  });
}

function wireSettings() {
  on('settingsColor', 'input', e => { $('settingsColorHex').textContent = e.target.value; });
  on('reserveColor', 'input', e => { $('reserveColorHex').textContent = e.target.value; });
  on('settingsProfileSave', 'click', () => {
    updateProfile($('settingsName').value.trim(), $('settingsColor').value);
  });
  on('settingsCycleSave', 'click', () => setCycleDay(parseInt($('settingsCycleDay').value, 10)));
  on('settingsCatSave', 'click', () => {
    const name = $('settingsCatName').value.trim();
    const type = getDropdownValue('ddCatType') || 'EXPENSE';
    if (createCategory(name, type)) $('settingsCatName').value = '';
  });

  on('trocarSenhaBtn', 'click', async () => {
    const atual = $('senhaAtual').value;
    const nova = $('senhaNova').value;
    if (nova.length < 8) { showToast('A nova senha precisa de pelo menos 8 caracteres'); return; }
    try {
      await api.trocarSenha(atual, nova);
      $('senhaAtual').value = '';
      $('senhaNova').value = '';
      showToast('Senha alterada!');
    } catch (e) {
      showToast(e.message);
    }
  });

  on('sairBtn', 'click', async () => {
    if (!confirm('Sair da conta neste aparelho?')) return;
    await gravarNoServidor();
    try { await api.logout(); } catch (e) { /* segue para a tela de login mesmo assim */ }
    ui.usuario = null;
    location.reload();
  });
}

function wireData() {
  on('downloadJsonBtn', 'click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mycoin-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Backup baixado!');
  });

  on('importJsonBtn', 'click', () => $('fileInput').click());
  on('fileInput', 'change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try { applyImportedState(JSON.parse(ev.target.result)); }
      catch (err) { showToast('Erro ao ler o arquivo: ' + err.message); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  on('copyJsonBtn', 'click', () => {
    const json = JSON.stringify(state, null, 2);
    $('jsonTextarea').value = json;
    navigator.clipboard?.writeText(json)
      .then(() => showToast('JSON copiado!'))
      .catch(() => {
        $('jsonTextarea').select();
        document.execCommand('copy');
        showToast('JSON copiado!');
      });
  });

  on('applyJsonBtn', 'click', () => {
    try { applyImportedState(JSON.parse($('jsonTextarea').value)); }
    catch (err) { showToast('Erro no JSON: ' + err.message); }
  });
}

function wireDropdowns() {
  initDropdown('ddMonthFilter', {
    placeholder: 'Selecione um mês',
    onChange: value => {
      ui.selectedMonth = value;
      renderSelectedMonthReport();
    },
  });
  initDropdown('ddMoneyCategory', { placeholder: 'Sem categoria' });
  initDropdown('ddTxCategory', { placeholder: 'Sem categoria' });
  initDropdown('ddMesAddCategory', { placeholder: 'Sem categoria' });
  initDropdown('ddMoveReserve', { placeholder: 'Escolha a reserva' });
  initDropdown('ddCatType', { placeholder: 'Tipo' });
  setDropdownOptions('ddCatType', [
    { value: 'EXPENSE', label: 'Saída' },
    { value: 'ENTRY', label: 'Entrada' },
  ], 'EXPENSE');
}

export function wireEvents() {
  setTabHooks(TAB_HOOKS);
  wireDropdowns();
  wireHeaderAndMenu();
  wireHome();
  wireReserveDetail();
  wireModals();
  wireFilters();
  wireSettings();
  wireData();
}
