/**
 * Campus Sanctuary – Shared Page Controller
 * Runs on every page: navigation, clock, sound, quick-exit, inactivity.
 */

// ─── Page identity ───────────────────────────────────────────────────────────
const PAGE_MAP = {
  'index.html':       'navBtnStart',
  '':                 'navBtnStart',
  'checkin.html':     'navBtnCheckIn',
  'tools.html':       'navBtnTools',
  'counseling.html':  'navBtnCounseling'
};
const currentPage = window.location.pathname.split('/').pop() || '';
const activeNavId = PAGE_MAP[currentPage] || 'navBtnStart';

document.addEventListener('DOMContentLoaded', () => {
  // ── Mark active nav pill ──────────────────────────────────────────────────
  document.querySelectorAll('.nav-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === activeNavId);
  });
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const page = href.split('/').pop();
    link.classList.toggle('active', page === currentPage || (page === 'index.html' && currentPage === ''));
  });
  document.querySelectorAll('.mobile-bottom-nav-btn').forEach(btn => {
    const href = btn.getAttribute('href') || '';
    const page = href.split('/').pop();
    btn.classList.toggle('active', page === currentPage || (page === 'index.html' && currentPage === ''));
  });

  // ── Live Clock ────────────────────────────────────────────────────────────
  function updateClock() {
    const el = document.getElementById('clockTimeText');
    if (el) el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── Sound Engine ──────────────────────────────────────────────────────────
  const soundState = { enabled: true, ctx: null };
  function initAudio() {
    if (!soundState.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) soundState.ctx = new AC();
    }
    if (soundState.ctx && soundState.ctx.state === 'suspended') soundState.ctx.resume();
  }
  function playChime(freq, dur, type) {
    freq = freq || 528; dur = dur || 0.8; type = type || 'sine';
    if (!soundState.enabled) return;
    try {
      initAudio();
      if (!soundState.ctx) return;
      const osc = soundState.ctx.createOscillator();
      const gain = soundState.ctx.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, soundState.ctx.currentTime);
      gain.gain.setValueAtTime(0.18, soundState.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, soundState.ctx.currentTime + dur);
      osc.connect(gain); gain.connect(soundState.ctx.destination);
      osc.start(); osc.stop(soundState.ctx.currentTime + dur);
    } catch(e) {}
  }
  window._playChime = playChime;
  window._soundState = soundState;

  const btnToggleSound = document.getElementById('btnToggleSound');
  const soundIcon = document.getElementById('soundIcon');
  if (btnToggleSound) {
    btnToggleSound.addEventListener('click', () => {
      soundState.enabled = !soundState.enabled;
      if (soundIcon) soundIcon.textContent = soundState.enabled ? 'volume_up' : 'volume_off';
      if (soundState.enabled) { initAudio(); playChime(528, 0.4); }
    });
  }

  // ── Quick Exit ────────────────────────────────────────────────────────────
  function quickExit() {
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
  window._quickExit = quickExit;
  const btnQE = document.getElementById('btnQuickExitTop');
  const btnFR = document.getElementById('btnFooterReset');
  if (btnQE) btnQE.addEventListener('click', quickExit);
  if (btnFR) btnFR.addEventListener('click', quickExit);

  // ── Mobile Drawer ─────────────────────────────────────────────────────────
  const drawer = document.getElementById('mobileNavDrawer');
  const drawerToggle = document.getElementById('mobileNavToggle');
  const drawerClose = document.getElementById('mobileNavClose');
  if (drawerToggle) drawerToggle.addEventListener('click', () => { if(drawer){drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false');} });
  if (drawerClose) drawerClose.addEventListener('click', () => { if(drawer){drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true');} });

  // ── Inactivity (only on non-home pages) ──────────────────────────────────
  if (currentPage !== 'index.html' && currentPage !== '') {
    let lastActivity = Date.now();
    let modalShowing = false;
    let countdownInterval = null;
    const IDLE_WARN = 45000;
    const WARN_DURATION = 15;
    const inactModal = document.getElementById('modalInactivity');
    const countdownEl = document.getElementById('inactivityCountdownText');
    const btnContinue = document.getElementById('btnInactivityContinue');
    const btnExitNow = document.getElementById('btnInactivityExitNow');

    function showInactModal() {
      modalShowing = true;
      let cd = WARN_DURATION;
      if (countdownEl) countdownEl.textContent = cd;
      if (inactModal) inactModal.classList.add('active');
      playChime(440, 0.4);
      countdownInterval = setInterval(() => {
        cd--;
        if (countdownEl) countdownEl.textContent = cd;
        if (cd <= 0) { clearInterval(countdownInterval); quickExit(); }
      }, 1000);
    }
    function dismissInact() {
      modalShowing = false;
      clearInterval(countdownInterval);
      if (inactModal) inactModal.classList.remove('active');
      lastActivity = Date.now();
    }
    if (btnContinue) btnContinue.addEventListener('click', dismissInact);
    if (btnExitNow) btnExitNow.addEventListener('click', quickExit);
    ['mousedown','mousemove','keydown','touchstart','scroll','click'].forEach(function(e) {
      window.addEventListener(e, function() { lastActivity = Date.now(); }, { passive: true });
    });
    setInterval(() => {
      if (!modalShowing && Date.now() - lastActivity >= IDLE_WARN) showInactModal();
    }, 3000);
  }

  // ── Accessibility Modal ───────────────────────────────────────────────────
  const accessModal = document.getElementById('modalAccessibility');
  function openAccess() { if(accessModal) accessModal.classList.add('active'); }
  function closeAccess() { if(accessModal) accessModal.classList.remove('active'); }
  const bHA = document.getElementById('btnHeaderAccessibility');
  const bFA = document.getElementById('btnFooterAccessibility');
  const bCA = document.getElementById('btnCloseAccess');
  const bDA = document.getElementById('btnDoneAccess');
  if (bHA) bHA.addEventListener('click', openAccess);
  if (bFA) bFA.addEventListener('click', openAccess);
  if (bCA) bCA.addEventListener('click', closeAccess);
  if (bDA) bDA.addEventListener('click', closeAccess);

  const btnTS = document.getElementById('btnTextStandard');
  const btnTL = document.getElementById('btnTextLarge');
  if (btnTS) btnTS.addEventListener('click', function() { document.body.classList.remove('large-text-mode'); btnTS.classList.add('selected'); if(btnTL) btnTL.classList.remove('selected'); });
  if (btnTL) btnTL.addEventListener('click', function() { document.body.classList.add('large-text-mode'); btnTL.classList.add('selected'); if(btnTS) btnTS.classList.remove('selected'); });

  const btnAOn = document.getElementById('btnAudioOn');
  const btnAOff = document.getElementById('btnAudioOff');
  if (btnAOn) btnAOn.addEventListener('click', function() { soundState.enabled=true; if(soundIcon) soundIcon.textContent='volume_up'; btnAOn.classList.add('selected'); if(btnAOff) btnAOff.classList.remove('selected'); initAudio(); playChime(528,0.4); });
  if (btnAOff) btnAOff.addEventListener('click', function() { soundState.enabled=false; if(soundIcon) soundIcon.textContent='volume_off'; btnAOff.classList.add('selected'); if(btnAOn) btnAOn.classList.remove('selected'); });

  const btnCN = document.getElementById('btnContrastNormal');
  const btnCH = document.getElementById('btnContrastHigh');
  if (btnCN) btnCN.addEventListener('click', function() { document.body.classList.remove('high-contrast-mode'); btnCN.classList.add('selected'); if(btnCH) btnCH.classList.remove('selected'); });
  if (btnCH) btnCH.addEventListener('click', function() { document.body.classList.add('high-contrast-mode'); btnCH.classList.add('selected'); if(btnCN) btnCN.classList.remove('selected'); });
  if (accessModal) accessModal.addEventListener('click', function(e) { if(e.target===accessModal) closeAccess(); });
});
