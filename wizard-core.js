/* ============================================================
   FTTH/FTTB Installation Wizard — Shared Core
   wizard-core.js  |  Nigerian ISP Standard
   Handles: state persistence, validation, field registry, utils
   ============================================================ */

const STORAGE_KEY = 'ftth_wizard_v1';

/* ── Field registry ─────────────────────────────────────── */
const FIELDS = {
  // Step 0 — Customer
  customer_name:        { label: 'Customer full name',          step: 0, required: true },
  customer_type:        { label: 'Customer type',               step: 0, required: true },
  address:              { label: 'Service address',             step: 0, required: true },
  landmark:             { label: 'Nearest landmark',            step: 0, required: true },
  phone:                { label: 'Phone number',                step: 0, required: true },
  alt_phone:            { label: 'Alternate contact',           step: 0, required: false },
  email:                { label: 'Email address',               step: 0, required: false },
  building_type:        { label: 'Building type',               step: 0, required: true },
  ticket_number:        { label: 'Installation ticket number',  step: 0, required: true },
  install_date:         { label: 'Installation date',           step: 0, required: true },
  gps_coords:           { label: 'GPS coordinates',             step: 0, required: false },
  technician:           { label: 'Technician name',             step: 0, required: true },

  // Step 1 — Service
  service_plan:         { label: 'Service plan / package',      step: 1, required: true },
  service_status:       { label: 'Service status',              step: 1, required: true },
  cir:                  { label: 'CIR',                         step: 1, required: true },
  burst_rate:           { label: 'Burst rate',                  step: 1, required: false },
  vlan_id:              { label: 'VLAN ID',                     step: 1, required: true },
  ip_type:              { label: 'IP address type',             step: 1, required: true },
  ip_address:           { label: 'Assigned IP address',         step: 1, required: false },
  subnet:               { label: 'Subnet mask / prefix',        step: 1, required: false },
  contract_duration:    { label: 'Contract duration',           step: 1, required: true },
  monthly_fee:          { label: 'Monthly subscription (₦)',    step: 1, required: true },
  bgp_asn:              { label: 'BGP ASN',                     step: 1, required: false },
  public_subnet:        { label: 'Public subnet',               step: 1, required: false },
  vrf_name:             { label: 'VRF name',                    step: 1, required: false },
  nat_type:             { label: 'NAT type',                    step: 1, required: false },

  // Step 2 — ODN
  olt_name:             { label: 'OLT name / location',         step: 2, required: true },
  olt_ip:               { label: 'OLT IP address',              step: 2, required: true },
  olt_port:             { label: 'OLT port / card / slot',      step: 2, required: true },
  pon_tech:             { label: 'PON technology',              step: 2, required: true },
  splitter_ratio:       { label: 'Splitter ratio',              step: 2, required: true },
  splitter_location:    { label: 'Splitter location / label',   step: 2, required: true },
  fat_id:               { label: 'FAT ID',                      step: 2, required: true },
  fiber_core_num:       { label: 'Fiber core number',           step: 2, required: true },
  fiber_core_status:    { label: 'Fiber core status',           step: 2, required: true },
  feeder_cable:         { label: 'Feeder cable type',           step: 2, required: false },
  dist_cable:           { label: 'Distribution cable type',     step: 2, required: false },
  ont_serial_odn:       { label: 'ONT serial number',           step: 2, required: true },

  // Step 3 — Optical
  olt_tx_power:         { label: 'OLT Tx power (dBm)',          step: 3, required: true },
  olt_pre_power:        { label: 'OLT port power (pre)',        step: 3, required: true },
  ont_rx_pre:           { label: 'ONT Rx power (pre)',          step: 3, required: true },
  olt_post_power:       { label: 'OLT port power (post)',       step: 3, required: true },
  ont_rx_post:          { label: 'ONT Rx power (post)',         step: 3, required: true },
  otdr_available:       { label: 'OTDR trace available',        step: 3, required: false },
  loss_olt_splitter:    { label: 'Loss OLT → Splitter (dB)',    step: 3, required: true },
  loss_splitter_fat:    { label: 'Loss Splitter → FAT (dB)',    step: 3, required: true },
  loss_fat_ont:         { label: 'Loss FAT → ONT (dB)',         step: 3, required: true },
  loss_total:           { label: 'Total end-to-end loss (dB)',  step: 3, required: false },
  optical_budget:       { label: 'Optical budget (dB)',         step: 3, required: false },
  power_margin:         { label: 'Power margin (dB)',           step: 3, required: false },

  // Step 4 — ONT / Router
  ont_model:            { label: 'ONT make / model',            step: 4, required: true },
  ont_serial:           { label: 'ONT serial number',           step: 4, required: true },
  ont_asset:            { label: 'ONT asset tag / ID',          step: 4, required: true },
  device_ownership:     { label: 'Device ownership',            step: 4, required: true },
  router_model:         { label: 'Router make / model',         step: 4, required: false },
  router_asset:         { label: 'Router asset ID',             step: 4, required: false },
  wifi_band:            { label: 'WiFi band',                   step: 4, required: true },
  wifi_ssid:            { label: 'WiFi SSID',                   step: 4, required: false },
  lan_ports_used:       { label: 'LAN ports used',              step: 4, required: false },
  ups_model:            { label: 'UPS make / model',            step: 4, required: false },
  ups_asset:            { label: 'UPS asset ID',                step: 4, required: false },
  ont_firmware:         { label: 'ONT firmware version',        step: 4, required: false },
  mgmt_ip:              { label: 'ONT management IP',           step: 4, required: false },
  tr069:                { label: 'TR-069 / CWMP enabled',       step: 4, required: false },

  // Step 5 — Physical
  pole_id:              { label: 'Pole ID / label',             step: 5, required: true },
  pole_gps:             { label: 'Pole GPS coordinates',        step: 5, required: false },
  pole_condition:       { label: 'Pole condition',              step: 5, required: true },
  drop_cable_type:      { label: 'Drop cable type',             step: 5, required: true },
  drop_cable_length:    { label: 'Drop cable length (m)',       step: 5, required: true },
  drop_cable_route:     { label: 'Drop cable route',            step: 5, required: true },
  fiber_protection:     { label: 'Fiber protection method',     step: 5, required: true },
  earthing_status:      { label: 'Earthing / grounding status', step: 5, required: true },
  ups_installed:        { label: 'UPS installed',               step: 5, required: false },
  surge_installed:      { label: 'Surge protector installed',   step: 5, required: false },
  enclosure_installed:  { label: 'Outdoor enclosure installed', step: 5, required: false },

  // Step 6 — Testing
  speed_server:         { label: 'Speed test server',           step: 6, required: true },
  test_timestamp:       { label: 'Test timestamp',              step: 6, required: true },
  download_speed:       { label: 'Download speed (Mbps)',       step: 6, required: true },
  upload_speed:         { label: 'Upload speed (Mbps)',         step: 6, required: true },
  ping_ms:              { label: 'Ping / latency (ms)',         step: 6, required: true },
  jitter_ms:            { label: 'Jitter (ms)',                 step: 6, required: false },
  packet_loss:          { label: 'Packet loss (%)',             step: 6, required: false },
  mos_score:            { label: 'MOS score (VoIP)',            step: 6, required: false },
  nearest_fat:          { label: 'Nearest FAT (recovery)',      step: 6, required: true },
  nearest_handhole:     { label: 'Nearest handhole',            step: 6, required: false },
  alt_core:             { label: 'Alternate fiber core',        step: 6, required: false },
  spare_olt_port:       { label: 'Spare OLT port available',    step: 6, required: false },
  escalation_engineer:  { label: 'Escalation engineer',         step: 6, required: true },
  test_notes:           { label: 'Test notes',                  step: 6, required: false },

  // Step 9 — Acceptance
  accept_customer_name: { label: 'Customer name (acceptance)',  step: 9, required: true },
  accept_designation:   { label: 'Customer designation',        step: 9, required: false },
  accept_datetime:      { label: 'Acceptance date & time',      step: 9, required: true },
  customer_comments:    { label: 'Customer comments',           step: 9, required: false },
  handover_notes:       { label: 'Handover notes',              step: 9, required: true },
  engineer_name:        { label: 'Engineer name',               step: 9, required: true },
  engineer_id:          { label: 'Engineer ID / badge',         step: 9, required: true },
};

/* ── Step metadata ──────────────────────────────────────── */
const STEP_META = [
  { name: 'Customer',   title: 'Customer Information',     icon: 'ti-building' },
  { name: 'Service',    title: 'Service Information',      icon: 'ti-world' },
  { name: 'ODN',        title: 'ODN Information',          icon: 'ti-timeline' },
  { name: 'Optical',    title: 'Optical Measurements',     icon: 'ti-antenna' },
  { name: 'ONT/Router', title: 'ONT / Router Information', icon: 'ti-router' },
  { name: 'Physical',   title: 'Physical Installation',    icon: 'ti-tool' },
  { name: 'Testing',    title: 'Testing & Verification',   icon: 'ti-flask' },
  { name: 'Photos',     title: 'Photo Documentation',      icon: 'ti-camera' },
  { name: 'Assets',     title: 'Asset Tracking',           icon: 'ti-package' },
  { name: 'Acceptance', title: 'Customer Acceptance',      icon: 'ti-pencil' },
  { name: 'Generate',   title: 'Generate Documentation',   icon: 'ti-file-text' },
];

/* ── State manager ──────────────────────────────────────── */
const WizardState = {
  _data: {},

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      this._data = {};
    }
    return this;
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
    } catch (e) {
      console.warn('State save failed:', e);
    }
    return this;
  },

  get(key) { return this._data[key] ?? ''; },

  set(key, value) {
    this._data[key] = value;
    this.save();
    return this;
  },

  setMany(obj) {
    Object.assign(this._data, obj);
    this.save();
    return this;
  },

  getAll() { return { ...this._data }; },

  clear() {
    this._data = {};
    localStorage.removeItem(STORAGE_KEY);
    return this;
  },

  getStepCompletion(stepIndex) {
    const required = Object.entries(FIELDS)
      .filter(([, f]) => f.step === stepIndex && f.required)
      .map(([k]) => k);
    if (required.length === 0) return 1;
    const filled = required.filter(k => {
      const v = this._data[k];
      return v !== undefined && v !== null && String(v).trim() !== '';
    });
    return filled.length / required.length;
  },

  getOverallCompletion() {
    const allRequired = Object.entries(FIELDS)
      .filter(([, f]) => f.required)
      .map(([k]) => k);
    const filled = allRequired.filter(k => {
      const v = this._data[k];
      return v !== undefined && v !== null && String(v).trim() !== '';
    });
    return Math.round((filled.length / allRequired.length) * 100);
  },

  getMissingFields(stepIndex) {
    return Object.entries(FIELDS)
      .filter(([, f]) => f.step === stepIndex && f.required)
      .filter(([k]) => {
        const v = this._data[k];
        return !v || String(v).trim() === '';
      })
      .map(([, f]) => f.label);
  }
};

/* ── Validation helpers ─────────────────────────────────── */
const Validate = {
  ipv4(val) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(val.trim()) &&
      val.trim().split('.').every(n => parseInt(n) <= 255);
  },
  phone(val) {
    return /^[+\d\s\-()]{7,15}$/.test(val.trim());
  },
  email(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  },
  gps(val) {
    return /^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/.test(val.trim());
  },
  dBm(val) {
    const n = parseFloat(val);
    return !isNaN(n) && n >= -50 && n <= 10;
  },
  positiveNumber(val) {
    return !isNaN(parseFloat(val)) && parseFloat(val) >= 0;
  }
};

/* ── Form sync: read all [data-field] inputs on page ────── */
function syncFormToState() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const key = el.dataset.field;
    const val = el.type === 'checkbox' ? el.checked : el.value;
    WizardState.set(key, val);
  });
}

function populateFormFromState() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const key = el.dataset.field;
    const val = WizardState.get(key);
    if (val === '' || val === undefined) return;
    if (el.type === 'checkbox') {
      el.checked = val === true || val === 'true';
    } else {
      el.value = val;
    }
  });
}

/* ── Auto-save on any input change ─────────────────────── */
function attachAutoSave() {
  document.querySelectorAll('[data-field]').forEach(el => {
    const evt = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
    el.addEventListener(evt, () => {
      const val = el.type === 'checkbox' ? el.checked : el.value;
      WizardState.set(el.dataset.field, val);
      updateStepIndicators && updateStepIndicators();
    });
  });
}

/* ── Optical auto-calc ──────────────────────────────────── */
function calcOptical() {
  const l1 = parseFloat(WizardState.get('loss_olt_splitter')) || 0;
  const l2 = parseFloat(WizardState.get('loss_splitter_fat')) || 0;
  const l3 = parseFloat(WizardState.get('loss_fat_ont')) || 0;
  const total = l1 + l2 + l3;
  const txPow = parseFloat(WizardState.get('olt_tx_power')) || 0;
  const rxPow = parseFloat(WizardState.get('ont_rx_post')) || 0;
  const margin = txPow - Math.abs(rxPow) - total;

  if (total > 0) {
    WizardState.set('loss_total', total.toFixed(2));
    const tEl = document.querySelector('[data-field="loss_total"]');
    if (tEl) tEl.value = total.toFixed(2);
  }
  if (!isNaN(margin)) {
    WizardState.set('power_margin', margin.toFixed(2));
    const mEl = document.querySelector('[data-field="power_margin"]');
    if (mEl) mEl.value = margin.toFixed(2);
  }
}

/* ── GPS capture helper ─────────────────────────────────── */
function captureGPS(fieldKey) {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by this device.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const val = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
      WizardState.set(fieldKey, val);
      const el = document.querySelector(`[data-field="${fieldKey}"]`);
      if (el) el.value = val;
    },
    () => alert('GPS capture failed. Please enter coordinates manually.')
  );
}

/* ── Toast notification ─────────────────────────────────── */
function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const colors = { success: '#1d9e75', error: '#e24b4a', info: '#378add', warning: '#ba7517' };
  toast.style.cssText = `background:${colors[type]||colors.success};color:white;padding:10px 18px;border-radius:9px;font-size:13px;font-weight:500;box-shadow:0 4px 14px rgba(0,0,0,.2);animation:slideIn .2s ease;max-width:300px;`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3200);
}

/* ── Format helpers ─────────────────────────────────────── */
function formatDate(val) {
  if (!val) return '—';
  try { return new Date(val).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return val; }
}
function formatDateTime(val) {
  if (!val) return '—';
  try { return new Date(val).toLocaleString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return val; }
}
function val(key) {
  const v = WizardState.get(key);
  return v && String(v).trim() ? String(v).trim() : '—';
}

/* ── Step completion badge helper ───────────────────────── */
function getStepBadge(stepIndex) {
  const pct = WizardState.getStepCompletion(stepIndex);
  if (pct >= 1) return { cls: 'done', label: '✓' };
  if (pct > 0)  return { cls: 'partial', label: Math.round(pct * 100) + '%' };
  return { cls: 'empty', label: '' };
}

/* ── Export ─────────────────────────────────────────────── */
if (typeof module !== 'undefined') {
  module.exports = { WizardState, FIELDS, STEP_META, Validate, formatDate, formatDateTime, val, getStepBadge };
}
