/**
 * Campus Sanctuary – Check-In Page Controller
 * Handles: mood selection, topic pills, 8-question assessment, results.
 */

const assessmentQuestions = [
  { id:1, category:"Academic Load & Stress",       categoryIcon:"psychology_alt",              prompt:"How often have you felt overwhelmed by engineering coursework or lab file submissions?",         hint:"Think about course deadlines, study hours, or exam preparations over the past two weeks." },
  { id:2, category:"Sleep & Rest",                 categoryIcon:"bedtime",                     prompt:"How often have you had trouble sleeping due to late-night study or academic stress?",             hint:"Consider your sleep duration, difficulty falling asleep, or waking up exhausted." },
  { id:3, category:"Energy & Motivation",          categoryIcon:"bolt",                        prompt:"How often have you felt low in energy or lacked motivation to attend morning lectures?",          hint:"Reflect on your stamina and interest in departmental workshops and lectures." },
  { id:4, category:"Exam Stress",                  categoryIcon:"assignment",                  prompt:"How often have you felt anxious or tense about Mid-Sem, End-Sem, or practical exams?",           hint:"Think about nervous tension, racing heart, or apprehension during test weeks." },
  { id:5, category:"Focus & Attention",            categoryIcon:"center_focus_strong",         prompt:"How often have you found it difficult to concentrate during technical lectures or practical labs?", hint:"Notice if your mind frequently wanders or struggles to absorb coding/engineering concepts." },
  { id:6, category:"Peer & Campus Life",           categoryIcon:"group",                       prompt:"How often have you felt isolated, homesick, or disconnected in your hostel or peer group?",      hint:"Think about feelings of loneliness or hesitation to speak with department friends." },
  { id:7, category:"Placement & Career Pressure",  categoryIcon:"trending_up",                 prompt:"How often have you felt worried about backlogs, GPA targets, or upcoming campus placements?",    hint:"Consider future career anxieties and pressure from family or peers." },
  { id:8, category:"Mood & Well-Being",            categoryIcon:"sentiment_very_dissatisfied", prompt:"How often have you felt emotionally drained, down, or discouraged by semester demands?",         hint:"Reflect on your general emotional balance and mood over the past few weeks." }
];

const state = {
  selectedMood: null,
  selectedTopics: new Set(),
  currentQuestionIndex: 0,
  assessmentScores: {}
};

// ── Screen switcher ────────────────────────────────────────────────────────────
const screens = ['screenMoodCheck', 'screenAssessment', 'screenResults'];
function showScreen(id) {
  screens.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle('active', s === id);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (typeof window._playChime === 'function') window._playChime(320, 0.08, 'triangle');
}

document.addEventListener('DOMContentLoaded', () => {

  // ── Mood Cards ──────────────────────────────────────────────────────────────
  document.querySelectorAll('.mood-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.mood-card').forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-checked','false'); });
      card.classList.add('selected');
      card.setAttribute('aria-checked','true');
      state.selectedMood = card.dataset.mood;
      if (typeof window._playChime === 'function') window._playChime(320, 0.08, 'triangle');
    });
  });

  // ── Topic Pills ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.topic-pill[data-topic]').forEach(pill => {
    pill.addEventListener('click', () => {
      const topic = pill.dataset.topic;
      const sel = pill.classList.contains('selected');
      pill.classList.toggle('selected', !sel);
      pill.setAttribute('aria-pressed', String(!sel));
      if (!sel) state.selectedTopics.add(topic); else state.selectedTopics.delete(topic);
    });
  });

  // ── Mood Continue ────────────────────────────────────────────────────────────
  const btnMoodContinue = document.getElementById('btnMoodContinue');
  if (btnMoodContinue) {
    btnMoodContinue.addEventListener('click', () => {
      state.currentQuestionIndex = 0;
      state.assessmentScores = {};
      renderCurrentQuestion();
      showScreen('screenAssessment');
    });
  }

  // ── Assessment ───────────────────────────────────────────────────────────────
  const assessmentStepBadge   = document.getElementById('assessmentStepBadge');
  const questionCategoryText  = document.getElementById('questionCategoryText');
  const questionPromptText    = document.getElementById('questionPromptText');
  const questionHintText      = document.getElementById('questionHintText');
  const progressStepCount     = document.getElementById('progressStepCount');
  const progressPercentText   = document.getElementById('progressPercentText');
  const progressBarFill       = document.getElementById('assessmentProgressBarFill');
  const optionCards           = document.querySelectorAll('.option-row-card');
  const assessmentNextBtnText = document.getElementById('assessmentNextBtnText');

  function renderCurrentQuestion() {
    const q = assessmentQuestions[state.currentQuestionIndex];
    if (!q) return;
    if (assessmentStepBadge)  assessmentStepBadge.textContent  = `Question ${state.currentQuestionIndex + 1} of ${assessmentQuestions.length}`;
    if (questionCategoryText) questionCategoryText.textContent = q.category;
    if (questionPromptText)   questionPromptText.textContent   = q.prompt;
    if (questionHintText)     questionHintText.textContent     = q.hint;
    const pct = Math.round(((state.currentQuestionIndex + 1) / assessmentQuestions.length) * 100);
    if (progressStepCount)   progressStepCount.textContent   = `Question ${state.currentQuestionIndex + 1} of ${assessmentQuestions.length}`;
    if (progressPercentText) progressPercentText.textContent = `${pct}% Complete`;
    if (progressBarFill)     progressBarFill.style.width     = `${pct}%`;
    if (assessmentNextBtnText) assessmentNextBtnText.textContent = (state.currentQuestionIndex === assessmentQuestions.length - 1) ? 'View Results' : 'Next';

    const saved = state.assessmentScores[state.currentQuestionIndex] !== undefined ? state.assessmentScores[state.currentQuestionIndex] : -1;
    optionCards.forEach(c => {
      const v = parseInt(c.dataset.value, 10);
      c.classList.toggle('active', v === saved);
      c.setAttribute('aria-checked', String(v === saved));
    });
  }

  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      if (typeof window._playChime === 'function') window._playChime(320, 0.08, 'triangle');
      const v = parseInt(card.dataset.value, 10);
      state.assessmentScores[state.currentQuestionIndex] = v;
      optionCards.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-checked','false'); });
      card.classList.add('active'); card.setAttribute('aria-checked','true');
    });
  });

  const btnAssessmentBack = document.getElementById('btnAssessmentBack');
  if (btnAssessmentBack) {
    btnAssessmentBack.addEventListener('click', () => {
      if (state.currentQuestionIndex > 0) { state.currentQuestionIndex--; renderCurrentQuestion(); }
      else showScreen('screenMoodCheck');
    });
  }

  const btnAssessmentSkip = document.getElementById('btnAssessmentSkip');
  if (btnAssessmentSkip) {
    btnAssessmentSkip.addEventListener('click', () => {
      if (state.assessmentScores[state.currentQuestionIndex] === undefined) state.assessmentScores[state.currentQuestionIndex] = 1;
      advanceQuestion();
    });
  }

  const btnAssessmentNext = document.getElementById('btnAssessmentNext');
  if (btnAssessmentNext) {
    btnAssessmentNext.addEventListener('click', advanceQuestion);
  }

  function advanceQuestion() {
    if (state.assessmentScores[state.currentQuestionIndex] === undefined) state.assessmentScores[state.currentQuestionIndex] = 1;
    if (state.currentQuestionIndex < assessmentQuestions.length - 1) {
      state.currentQuestionIndex++;
      renderCurrentQuestion();
    } else {
      calculateAndRenderResults();
      showScreen('screenResults');
    }
  }

  // ── Results ──────────────────────────────────────────────────────────────────
  function calculateAndRenderResults() {
    let total = 0;
    Object.values(state.assessmentScores).forEach(s => { total += (s || 0); });
    let level = 'moderate';
    if (total <= 7) level = 'low';
    else if (total >= 16) level = 'elevated';

    const badge = document.getElementById('resultStatusBadge');
    const badgeText = document.getElementById('resultBadgeText');
    const subtitle = document.getElementById('resultMainSubtitle');
    const reflTitle = document.getElementById('resultReflectionTitle');
    const reflDesc  = document.getElementById('resultReflectionDesc');

    if (badge) badge.className = `results-level-pill ${level}`;
    if (level === 'low') {
      if (badgeText)  badgeText.textContent  = 'Low Stress • Steady State';
      if (subtitle)   subtitle.textContent   = 'Your responses suggest you are coping well with semester demands.';
      if (reflTitle)  reflTitle.textContent  = 'You are maintaining good balance.';
      if (reflDesc)   reflDesc.textContent   = 'Engineering workloads are demanding, but your routine currently supports your well-being. Continue your healthy study breaks, sleep rhythms, and social connections.';
    } else if (level === 'elevated') {
      if (badgeText)  badgeText.textContent  = 'High Academic Tension • Support Recommended';
      if (subtitle)   subtitle.textContent   = 'Your responses show you are carrying substantial pressure right now.';
      if (reflTitle)  reflTitle.textContent  = 'You are navigating an intense period.';
      if (reflDesc)   reflDesc.textContent   = 'Intense assignment deadlines, lab submissions, or exam worries can take an emotional toll. Speaking with a BVM counselor or trying grounding tools can help ease this burden.';
    } else {
      if (badgeText)  badgeText.textContent  = 'Moderate Stress';
      if (subtitle)   subtitle.textContent   = 'Your responses suggest that you may be experiencing some stress at the moment.';
      if (reflTitle)  reflTitle.textContent  = "You're carrying some pressure.";
      if (reflDesc)   reflDesc.textContent   = 'That can happen during demanding academic periods. A few small support steps may help you feel more balanced.';
    }
  }

  // Initialize
  renderCurrentQuestion();
});
