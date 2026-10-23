/**
 * Campus Sanctuary – Coping Tools Page Controller
 * Handles: Box Breathing, Sensory Grounding, Resources tabs, AI companion.
 */

document.addEventListener('DOMContentLoaded', () => {
  const pc = window._playChime || (() => {});

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openModal(id) { document.getElementById(id)?.classList.add('active'); }
  function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
    if (id === 'modalBreathing') stopBoxBreathing();
  }
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); });
  });

  // ── Launch buttons ────────────────────────────────────────────────────────
  document.getElementById('btnLaunchBreathingModal')?.addEventListener('click', () => openBreathing());
  document.getElementById('btnLaunchRelaxationModal')?.addEventListener('click', () => openModal('modalGrounding'));
  document.getElementById('btnLaunchResourcesModal')?.addEventListener('click', () => openModal('modalResources'));
  document.getElementById('btnLaunchAiModal')?.addEventListener('click', () => openModal('modalAi'));

  // Open via URL hash (e.g. tools.html#breathing)
  const hash = window.location.hash;
  if (hash === '#breathing') openBreathing();
  else if (hash === '#grounding') openModal('modalGrounding');

  // ── Box Breathing ─────────────────────────────────────────────────────────
  const breathingPhases = [
    { title:'Inhale',  scale:'scale(1.35)', chime:528 },
    { title:'Hold',    scale:'scale(1.35)', chime:587 },
    { title:'Exhale',  scale:'scale(1.0)',  chime:396 },
    { title:'Rest',    scale:'scale(1.0)',  chime:352 }
  ];
  let breathActive = false, breathInterval = null, breathPhase = 0, breathSecs = 4, breathCycle = 1;

  function openBreathing() {
    openModal('modalBreathing');
    startBoxBreathing();
  }
  function startBoxBreathing() {
    stopBoxBreathing();
    breathActive = true; breathPhase = 0; breathSecs = 4; breathCycle = 1;
    updateBreathVisuals();
    breathInterval = setInterval(() => {
      if (!breathActive) return;
      breathSecs--;
      if (breathSecs <= 0) {
        breathPhase = (breathPhase + 1) % breathingPhases.length;
        breathSecs = 4;
        if (breathPhase === 0) breathCycle++;
        if (breathCycle > 4) { stopBoxBreathing(); closeModal('modalBreathing'); return; }
        updateBreathVisuals();
      } else {
        const sd = document.getElementById('breathSecondsDisplay');
        if (sd) sd.textContent = `${breathSecs}s`;
      }
    }, 1000);
  }
  function stopBoxBreathing() {
    if (breathInterval) { clearInterval(breathInterval); breathInterval = null; }
    breathActive = false;
  }
  function updateBreathVisuals() {
    const ph = breathingPhases[breathPhase];
    const pt = document.getElementById('breathPhaseTitle');
    const sd = document.getElementById('breathSecondsDisplay');
    const oc = document.getElementById('breathOuterCircle');
    const cc = document.getElementById('breathCycleCounter');
    if (pt) pt.textContent = ph.title;
    if (sd) sd.textContent = `${breathSecs}s`;
    if (oc) oc.style.transform = ph.scale;
    if (cc) cc.textContent = `Cycle ${breathCycle} of 4`;
    pc(ph.chime, 0.7);
  }

  const btnToggle = document.getElementById('btnToggleBreathPlay');
  const playIcon  = document.getElementById('breathPlayIcon');
  const playText  = document.getElementById('breathPlayText');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      breathActive = !breathActive;
      if (playIcon) playIcon.textContent = breathActive ? 'pause' : 'play_arrow';
      if (playText) playText.textContent  = breathActive ? 'Pause' : 'Resume';
    });
  }
  document.getElementById('btnCloseBreathing')?.addEventListener('click', () => closeModal('modalBreathing'));
  document.getElementById('btnFinishBreathing')?.addEventListener('click', () => closeModal('modalBreathing'));

  // ── Sensory Grounding ─────────────────────────────────────────────────────
  document.querySelectorAll('.grounding-step-item').forEach(item => {
    item.addEventListener('click', () => { pc(600, 0.25); item.classList.toggle('completed'); });
  });
  document.getElementById('btnCloseGrounding')?.addEventListener('click', () => closeModal('modalGrounding'));
  document.getElementById('btnFinishGrounding')?.addEventListener('click', () => closeModal('modalGrounding'));

  // ── Resources Tabs ────────────────────────────────────────────────────────
  document.querySelectorAll('.tab-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pc(320, 0.08, 'triangle');
      document.querySelectorAll('.tab-switch-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });
  document.getElementById('btnCloseResources')?.addEventListener('click', () => closeModal('modalResources'));
  document.getElementById('btnDoneResources')?.addEventListener('click', () => closeModal('modalResources'));

  // ── AI Companion ──────────────────────────────────────────────────────────
  const aiResponses = {
    overwhelmed: "Engineering coursework often demands intense focus. Remember: you don't need to finish the whole syllabus in one sitting. Try the 25-minute sprint rule, drink a glass of water, and ask a classmate or faculty mentor for past papers. You are doing better than you realize.",
    sleep: "When racing thoughts keep you awake before exams, your nervous system is in alert mode. Try the 4-7-8 breathing method or write your worries onto a paper notepad beside your bed. Tell yourself: 'My mind is resting now, and I will solve this tomorrow.'",
    lonely: "Hostel life and new departmental environments can feel isolating, especially during difficult weeks. You are never truly alone: BVM has peer wellness groups and student mentors. Visiting the quiet garden lawn or attending a club workshop can help spark gentle connections.",
    placement: "Placement season and GPA targets carry heavy expectations. Remember that a placement interview evaluates potential, not perfection. Practice one mock problem daily, take regular breaks, and discuss any acute anxiety with the campus counseling cell."
  };
  const aiContent = document.getElementById('aiResponseContent');
  document.querySelectorAll('.ai-chip-prompt').forEach(chip => {
    chip.addEventListener('click', () => {
      pc(320, 0.08, 'triangle');
      if (aiContent && aiResponses[chip.dataset.query]) aiContent.textContent = aiResponses[chip.dataset.query];
    });
  });
  document.getElementById('btnCloseAi')?.addEventListener('click', () => closeModal('modalAi'));
  document.getElementById('btnDoneAi')?.addEventListener('click', () => closeModal('modalAi'));
});
