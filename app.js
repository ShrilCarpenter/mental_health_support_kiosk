/**
 * Campus Sanctuary - Student Mental Health Support Kiosk
 * Birla Vishvakarma Mahavidyalaya (BVM) Engineering College
 * Frontend Logic & Interactive Kiosk Controller
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. QUESTION BANK (Tailored for BVM Engineering Students)
  // ==========================================================================
  const assessmentQuestions = [
    {
      id: 1,
      category: "Academic Load & Stress",
      categoryIcon: "psychology_alt",
      prompt: "How often have you felt overwhelmed by engineering coursework or lab file submissions?",
      hint: "Think about course deadlines, study hours, or exam preparations over the past two weeks."
    },
    {
      id: 2,
      category: "Sleep & Rest",
      categoryIcon: "bedtime",
      prompt: "How often have you had trouble sleeping due to late-night study or academic stress?",
      hint: "Consider your sleep duration, difficulty falling asleep, or waking up exhausted."
    },
    {
      id: 3,
      category: "Energy & Motivation",
      categoryIcon: "bolt",
      prompt: "How often have you felt low in energy or lacked motivation to attend morning lectures?",
      hint: "Reflect on your stamina and interest in departmental workshops and lectures."
    },
    {
      id: 4,
      category: "Exam Stress",
      categoryIcon: "assignment",
      prompt: "How often have you felt anxious or tense about Mid-Sem, End-Sem, or practical exams?",
      hint: "Think about nervous tension, racing heart, or apprehension during test weeks."
    },
    {
      id: 5,
      category: "Focus & Attention",
      categoryIcon: "center_focus_strong",
      prompt: "How often have you found it difficult to concentrate during technical lectures or practical labs?",
      hint: "Notice if your mind frequently wanders or struggles to absorb coding/engineering concepts."
    },
    {
      id: 6,
      category: "Peer & Campus Life",
      categoryIcon: "group",
      prompt: "How often have you felt isolated, homesick, or disconnected in your hostel or peer group?",
      hint: "Think about feelings of loneliness or hesitation to speak with department friends."
    },
    {
      id: 7,
      category: "Placement & Career Pressure",
      categoryIcon: "trending_up",
      prompt: "How often have you felt worried about backlogs, GPA targets, or upcoming campus placements?",
      hint: "Consider future career anxieties and pressure from family or peers."
    },
    {
      id: 8,
      category: "Mood & Well-Being",
      categoryIcon: "sentiment_very_dissatisfied",
      prompt: "How often have you felt emotionally drained, down, or discouraged by semester demands?",
      hint: "Reflect on your general emotional balance and mood over the past few weeks."
    }
  ];

  // ==========================================================================
  // 2. APPLICATION STATE
  // ==========================================================================
  const state = {
    currentScreen: 'screenWelcome',
    selectedMood: 'Stressed',
    selectedTopics: new Set(['Academic Work']),
    currentQuestionIndex: 0,
    assessmentScores: {}, // index -> score (0, 1, 2, 3)
    counselingService: 'Book an Appointment',
    counselingTime: 'Morning (8 AM – 12 PM)',
    soundEnabled: true,
    audioCtx: null,

    // Guided Breathing State
    isBreathingActive: true,
    breathInterval: null,
    breathPhase: 0, // 0: Inhale, 1: Hold, 2: Exhale, 3: Rest
    breathSecondsLeft: 4,
    breathCycleCount: 1,

    // Live Header & Sanctuary Pulse
    livePulsePhase: 0,
    livePulseTimer: null,

    // Inactivity State (60s total, warning at 45s)
    lastActivityTime: Date.now(),
    inactivityCheckTimer: null,
    inactivityCountdown: 15,
    inactivityModalActive: false,
    countdownTimerInterval: null
  };

  // ==========================================================================
  // 3. SOUND SYNTHESIS ENGINE (Web Audio API - No external mp3 required)
  // ==========================================================================
  function initAudio() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        state.audioCtx = new AudioContext();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function playChime(freq = 528, duration = 0.8, type = 'sine') {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;

      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.18, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(state.audioCtx.destination);

      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play prevented", e);
    }
  }

  function playTapSound() {
    playChime(320, 0.08, 'triangle');
  }

  // ==========================================================================
  // 4. SCREEN NAVIGATION ROUTER
  // ==========================================================================
  const screens = {
    screenWelcome: document.getElementById('screenWelcome'),
    screenMoodCheck: document.getElementById('screenMoodCheck'),
    screenAssessment: document.getElementById('screenAssessment'),
    screenResults: document.getElementById('screenResults'),
    screenSelfHelp: document.getElementById('screenSelfHelp'),
    screenCounseling: document.getElementById('screenCounseling')
  };

  const navPills = {
    screenWelcome: document.getElementById('navBtnStart'),
    screenMoodCheck: document.getElementById('navBtnCheckIn'),
    screenSelfHelp: document.getElementById('navBtnTools'),
    screenCounseling: document.getElementById('navBtnCounseling')
  };

  function showScreen(screenId) {
    resetInactivityTimer();
    closeAllModals();

    // Sound cue on transition
    playTapSound();

    // Toggle active screen
    Object.keys(screens).forEach(id => {
      if (screens[id]) {
        if (id === screenId) {
          screens[id].classList.add('active');
        } else {
          screens[id].classList.remove('active');
        }
      }
    });

    // Update navigation track active pill
    Object.keys(navPills).forEach(id => {
      if (navPills[id]) {
        if (id === screenId) {
          navPills[id].classList.add('active');
        } else {
          navPills[id].classList.remove('active');
        }
      }
    });

    state.currentScreen = screenId;

    // Screen specific logic
    if (screenId === 'screenAssessment') {
      renderCurrentQuestion();
    } else if (screenId === 'screenResults') {
      calculateAndRenderResults();
    }

    // Scroll smoothly to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mainContent = document.getElementById('mainContent');
    if (mainContent) mainContent.scrollTop = 0;
  }

  // Fast header navigation clicks
  document.querySelectorAll('.nav-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target) showScreen(target);
    });
  });

  const brandHomeTrigger = document.getElementById('brandHomeTrigger');
  if (brandHomeTrigger) {
    brandHomeTrigger.addEventListener('click', () => showScreen('screenWelcome'));
  }

  // ==========================================================================
  // 5. LIVE CAMPUS CLOCK & HEADER CONTROLS
  // ==========================================================================
  function updateCampusClock() {
    const clockText = document.getElementById('clockTimeText');
    if (clockText) {
      const now = new Date();
      clockText.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  updateCampusClock();
  setInterval(updateCampusClock, 1000);

  // Sound Toggle Button
  const btnToggleSound = document.getElementById('btnToggleSound');
  const soundIcon = document.getElementById('soundIcon');
  if (btnToggleSound && soundIcon) {
    btnToggleSound.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      soundIcon.textContent = state.soundEnabled ? 'volume_up' : 'volume_off';
      btnToggleSound.title = state.soundEnabled ? 'Audio enabled' : 'Audio muted';
      if (state.soundEnabled) {
        initAudio();
        playChime(528, 0.4);
      }
    });
  }

  // Quick Exit / Reset Buttons
  function fullSessionReset() {
    state.selectedMood = 'Stressed';
    state.selectedTopics.clear();
    state.selectedTopics.add('Academic Work');
    state.currentQuestionIndex = 0;
    state.assessmentScores = {};
    state.counselingService = 'Book an Appointment';
    state.counselingTime = 'Morning (8 AM – 12 PM)';
    stopBoxBreathing();

    // Reset textarea
    const noteInput = document.getElementById('counselingNoteInput');
    if (noteInput) noteInput.value = '';
    const counter = document.getElementById('noteCharCounter');
    if (counter) counter.textContent = '0 / 250';

    // Reset ground steps
    document.querySelectorAll('.grounding-step-item').forEach(el => el.classList.remove('completed'));

    closeAllModals();
    showScreen('screenWelcome');
  }

  const btnQuickExitTop = document.getElementById('btnQuickExitTop');
  const btnFooterReset = document.getElementById('btnFooterReset');
  if (btnQuickExitTop) btnQuickExitTop.addEventListener('click', fullSessionReset);
  if (btnFooterReset) btnFooterReset.addEventListener('click', fullSessionReset);

  // ==========================================================================
  // 6. SCREEN 1: WELCOME ACTIONS & GENTLE BREATH PULSE
  // ==========================================================================
  const btnWelcomeStart = document.getElementById('btnWelcomeStart');
  const btnWelcomeSelfHelp = document.getElementById('btnWelcomeSelfHelp');
  const btnWelcomeCounseling = document.getElementById('btnWelcomeCounseling');
  const btnQuickBreathPause = document.getElementById('btnQuickBreathPause');
  const sanctuaryPulseTrigger = document.getElementById('sanctuaryPulseTrigger');

  if (btnWelcomeStart) {
    btnWelcomeStart.addEventListener('click', () => showScreen('screenMoodCheck'));
  }
  if (btnWelcomeSelfHelp) {
    btnWelcomeSelfHelp.addEventListener('click', () => showScreen('screenSelfHelp'));
  }
  if (btnWelcomeCounseling) {
    btnWelcomeCounseling.addEventListener('click', () => showScreen('screenCounseling'));
  }
  if (btnQuickBreathPause) {
    btnQuickBreathPause.addEventListener('click', () => openBreathingModal());
  }
  if (sanctuaryPulseTrigger) {
    sanctuaryPulseTrigger.addEventListener('click', () => openBreathingModal());
  }

  // Live breath text cycling on welcome card
  const liveBreathPhases = ['Inhale...', 'Hold...', 'Exhale...', 'Rest...'];
  const liveBreathPhaseText = document.getElementById('liveBreathPhaseText');
  state.livePulseTimer = setInterval(() => {
    state.livePulsePhase = (state.livePulsePhase + 1) % liveBreathPhases.length;
    if (liveBreathPhaseText) {
      liveBreathPhaseText.textContent = liveBreathPhases[state.livePulsePhase];
    }
  }, 3500);

  // ==========================================================================
  // 7. SCREEN 2: MOOD SELECTION & TOPIC INFLUENCES
  // ==========================================================================
  const moodCards = document.querySelectorAll('.mood-card');
  moodCards.forEach(card => {
    card.addEventListener('click', () => {
      playTapSound();
      moodCards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
      state.selectedMood = card.dataset.mood;
    });
  });

  const topicPills = document.querySelectorAll('.topic-pill');
  topicPills.forEach(pill => {
    pill.addEventListener('click', () => {
      playTapSound();
      const topic = pill.dataset.topic;
      const isSelected = pill.classList.contains('selected');
      if (isSelected) {
        pill.classList.remove('selected');
        pill.setAttribute('aria-pressed', 'false');
        state.selectedTopics.delete(topic);
      } else {
        pill.classList.add('selected');
        pill.setAttribute('aria-pressed', 'true');
        state.selectedTopics.add(topic);
      }
    });
  });

  const btnMoodBack = document.getElementById('btnMoodBack');
  const btnMoodContinue = document.getElementById('btnMoodContinue');
  if (btnMoodBack) btnMoodBack.addEventListener('click', () => showScreen('screenWelcome'));
  if (btnMoodContinue) btnMoodContinue.addEventListener('click', () => showScreen('screenAssessment'));

  // ==========================================================================
  // 8. SCREEN 3: ASSESSMENT QUESTIONNAIRE CONTROLLER
  // ==========================================================================
  const assessmentStepBadge = document.getElementById('assessmentStepBadge');
  const questionCategoryText = document.getElementById('questionCategoryText');
  const questionPromptText = document.getElementById('questionPromptText');
  const questionHintText = document.getElementById('questionHintText');
  const progressStepCount = document.getElementById('progressStepCount');
  const progressPercentText = document.getElementById('progressPercentText');
  const assessmentProgressBarFill = document.getElementById('assessmentProgressBarFill');
  const optionRowCards = document.querySelectorAll('.option-row-card');
  const btnAssessmentBack = document.getElementById('btnAssessmentBack');
  const btnAssessmentSkip = document.getElementById('btnAssessmentSkip');
  const btnAssessmentNext = document.getElementById('btnAssessmentNext');
  const assessmentNextBtnText = document.getElementById('assessmentNextBtnText');

  function renderCurrentQuestion() {
    const qIndex = state.currentQuestionIndex;
    const qData = assessmentQuestions[qIndex];
    if (!qData) return;

    // Update texts
    if (assessmentStepBadge) assessmentStepBadge.textContent = `Question ${qIndex + 1} of ${assessmentQuestions.length}`;
    if (questionCategoryText) questionCategoryText.textContent = qData.category;
    if (questionPromptText) questionPromptText.textContent = qData.prompt;
    if (questionHintText) questionHintText.textContent = qData.hint;

    // Update Progress Bar
    const percent = Math.round(((qIndex + 1) / assessmentQuestions.length) * 100);
    if (progressStepCount) progressStepCount.textContent = `Question ${qIndex + 1} of ${assessmentQuestions.length}`;
    if (progressPercentText) progressPercentText.textContent = `${percent}% Complete`;
    if (assessmentProgressBarFill) assessmentProgressBarFill.style.width = `${percent}%`;

    // Next button label
    if (assessmentNextBtnText) {
      assessmentNextBtnText.textContent = (qIndex === assessmentQuestions.length - 1) ? 'View Results' : 'Next';
    }

    // Select previously chosen answer if exists, or default to 1 (Sometimes)
    const savedScore = state.assessmentScores[qIndex] !== undefined ? state.assessmentScores[qIndex] : 1;
    state.assessmentScores[qIndex] = savedScore;

    optionRowCards.forEach(card => {
      const val = parseInt(card.dataset.value, 10);
      if (val === savedScore) {
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
      } else {
        card.classList.remove('active');
        card.setAttribute('aria-checked', 'false');
      }
    });
  }

  // Option card tap
  optionRowCards.forEach(card => {
    card.addEventListener('click', () => {
      playTapSound();
      const val = parseInt(card.dataset.value, 10);
      state.assessmentScores[state.currentQuestionIndex] = val;

      optionRowCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-checked', 'true');
    });
  });

  if (btnAssessmentBack) {
    btnAssessmentBack.addEventListener('click', () => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderCurrentQuestion();
      } else {
        showScreen('screenMoodCheck');
      }
    });
  }

  if (btnAssessmentSkip) {
    btnAssessmentSkip.addEventListener('click', () => {
      playTapSound();
      // Record default low score for skipped
      if (state.assessmentScores[state.currentQuestionIndex] === undefined) {
        state.assessmentScores[state.currentQuestionIndex] = 1;
      }
      advanceQuestion();
    });
  }

  if (btnAssessmentNext) {
    btnAssessmentNext.addEventListener('click', () => {
      playTapSound();
      advanceQuestion();
    });
  }

  function advanceQuestion() {
    if (state.currentQuestionIndex < assessmentQuestions.length - 1) {
      state.currentQuestionIndex++;
      renderCurrentQuestion();
    } else {
      showScreen('screenResults');
    }
  }

  // ==========================================================================
  // 9. SCREEN 4: RESULTS CALCULATION & PERSONALIZED SUMMARY
  // ==========================================================================
  const resultStatusBadge = document.getElementById('resultStatusBadge');
  const resultBadgeText = document.getElementById('resultBadgeText');
  const resultMainSubtitle = document.getElementById('resultMainSubtitle');
  const resultReflectionTitle = document.getElementById('resultReflectionTitle');
  const resultReflectionDesc = document.getElementById('resultReflectionDesc');

  function calculateAndRenderResults() {
    // Sum scores (0 to 3 each, total possible: 24)
    let totalScore = 0;
    Object.values(state.assessmentScores).forEach(score => {
      totalScore += (score || 0);
    });

    // Determine level
    let level = 'moderate'; // low, moderate, elevated
    if (totalScore <= 7) {
      level = 'low';
    } else if (totalScore >= 16) {
      level = 'elevated';
    }

    if (resultStatusBadge) {
      resultStatusBadge.className = `results-level-pill ${level}`;
    }

    if (level === 'low') {
      if (resultBadgeText) resultBadgeText.textContent = 'Low Stress • Steady State';
      if (resultMainSubtitle) resultMainSubtitle.textContent = 'Your responses suggest you are coping well with semester demands.';
      if (resultReflectionTitle) resultReflectionTitle.textContent = 'You are maintaining good balance.';
      if (resultReflectionDesc) {
        resultReflectionDesc.textContent = 'Engineering workloads are demanding, but your routine currently supports your well-being. Continue your healthy study breaks, sleep rhythms, and social connections.';
      }
    } else if (level === 'elevated') {
      if (resultBadgeText) resultBadgeText.textContent = 'High Academic Tension • Support Recommended';
      if (resultMainSubtitle) resultMainSubtitle.textContent = 'Your responses show you are carrying substantial pressure right now.';
      if (resultReflectionTitle) resultReflectionTitle.textContent = 'You are navigating an intense period.';
      if (resultReflectionDesc) {
        resultReflectionDesc.textContent = 'Intense assignment deadlines, lab submissions, or exam worries can take an emotional toll. Speaking with a BVM counselor or trying grounding tools can help ease this burden.';
      }
    } else {
      // Moderate (Default)
      if (resultBadgeText) resultBadgeText.textContent = 'Moderate Stress';
      if (resultMainSubtitle) resultMainSubtitle.textContent = 'Your responses suggest that you may be experiencing some stress at the moment.';
      if (resultReflectionTitle) resultReflectionTitle.textContent = "You're carrying some pressure.";
      if (resultReflectionDesc) {
        resultReflectionDesc.textContent = 'That can happen during demanding academic periods. A few small support steps may help you feel more balanced.';
      }
    }
  }

  // Results Shortcut Cards
  const recBreathingCard = document.getElementById('recBreathingCard');
  const recRelaxationCard = document.getElementById('recRelaxationCard');
  const recResourcesCard = document.getElementById('recResourcesCard');
  const btnResultsHome = document.getElementById('btnResultsHome');
  const btnResultsToSelfHelp = document.getElementById('btnResultsToSelfHelp');
  const btnResultsToCounseling = document.getElementById('btnResultsToCounseling');

  if (recBreathingCard) recBreathingCard.addEventListener('click', () => openBreathingModal());
  if (recRelaxationCard) recRelaxationCard.addEventListener('click', () => openGroundingModal());
  if (recResourcesCard) recResourcesCard.addEventListener('click', () => openResourcesModal());
  if (btnResultsHome) btnResultsHome.addEventListener('click', () => showScreen('screenWelcome'));
  if (btnResultsToSelfHelp) btnResultsToSelfHelp.addEventListener('click', () => showScreen('screenSelfHelp'));
  if (btnResultsToCounseling) btnResultsToCounseling.addEventListener('click', () => showScreen('screenCounseling'));

  // ==========================================================================
  // 10. SCREEN 5: SELF-HELP TOOLS & COPING LIBRARY
  // ==========================================================================
  const btnLaunchBreathingModal = document.getElementById('btnLaunchBreathingModal');
  const btnLaunchRelaxationModal = document.getElementById('btnLaunchRelaxationModal');
  const btnLaunchResourcesModal = document.getElementById('btnLaunchResourcesModal');
  const btnLaunchAiModal = document.getElementById('btnLaunchAiModal');
  const btnSelfHelpHome = document.getElementById('btnSelfHelpHome');
  const btnSelfHelpToCounseling = document.getElementById('btnSelfHelpToCounseling');

  if (btnLaunchBreathingModal) btnLaunchBreathingModal.addEventListener('click', () => openBreathingModal());
  if (btnLaunchRelaxationModal) btnLaunchRelaxationModal.addEventListener('click', () => openGroundingModal());
  if (btnLaunchResourcesModal) btnLaunchResourcesModal.addEventListener('click', () => openResourcesModal());
  if (btnLaunchAiModal) btnLaunchAiModal.addEventListener('click', () => openAiModal());
  if (btnSelfHelpHome) btnSelfHelpHome.addEventListener('click', () => showScreen('screenWelcome'));
  if (btnSelfHelpToCounseling) btnSelfHelpToCounseling.addEventListener('click', () => showScreen('screenCounseling'));

  // ==========================================================================
  // 11. SCREEN 6: COUNSELING SUPPORT & CONFIDENTIAL PASS GENERATION
  // ==========================================================================
  const counselingCards = document.querySelectorAll('.counseling-card');
  counselingCards.forEach(card => {
    card.addEventListener('click', () => {
      playTapSound();
      counselingCards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
      state.counselingService = card.dataset.counseling;
    });
  });

  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTapSound();
      timeSlotBtns.forEach(b => {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
      state.counselingTime = btn.dataset.time;
    });
  });

  const counselingNoteInput = document.getElementById('counselingNoteInput');
  const noteCharCounter = document.getElementById('noteCharCounter');
  if (counselingNoteInput && noteCharCounter) {
    counselingNoteInput.addEventListener('input', () => {
      noteCharCounter.textContent = `${counselingNoteInput.value.length} / 250`;
    });
  }

  const btnCounselingBack = document.getElementById('btnCounselingBack');
  const btnSubmitCounselingPass = document.getElementById('btnSubmitCounselingPass');

  if (btnCounselingBack) btnCounselingBack.addEventListener('click', () => showScreen('screenWelcome'));
  if (btnSubmitCounselingPass) {
    btnSubmitCounselingPass.addEventListener('click', () => {
      generateAndOpenVoucher();
    });
  }

  function generateAndOpenVoucher() {
    playChime(660, 0.6);
    // Generate random 4 digit code
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const passCode = `BVM-WELL-${randomCode}`;

    const voucherTicketCode = document.getElementById('voucherTicketCode');
    const voucherServiceDisplay = document.getElementById('voucherServiceDisplay');
    const voucherTimeDisplay = document.getElementById('voucherTimeDisplay');

    if (voucherTicketCode) voucherTicketCode.textContent = passCode;
    if (voucherServiceDisplay) voucherServiceDisplay.textContent = state.counselingService;
    if (voucherTimeDisplay) voucherTimeDisplay.textContent = state.counselingTime;

    openModal('modalVoucher');
  }

  // Print voucher button
  const btnPrintVoucher = document.getElementById('btnPrintVoucher');
  if (btnPrintVoucher) {
    btnPrintVoucher.addEventListener('click', () => {
      window.print();
    });
  }

  const btnFinishVoucherSession = document.getElementById('btnFinishVoucherSession');
  if (btnFinishVoucherSession) {
    btnFinishVoucherSession.addEventListener('click', fullSessionReset);
  }

  // ==========================================================================
  // 12. GUIDED BOX BREATHING ENGINE (4-4-4-4 Technique)
  // ==========================================================================
  const modalBreathing = document.getElementById('modalBreathing');
  const btnCloseBreathing = document.getElementById('btnCloseBreathing');
  const btnFinishBreathing = document.getElementById('btnFinishBreathing');
  const btnToggleBreathPlay = document.getElementById('btnToggleBreathPlay');
  const breathPlayIcon = document.getElementById('breathPlayIcon');
  const breathPlayText = document.getElementById('breathPlayText');
  const breathOuterCircle = document.getElementById('breathOuterCircle');
  const breathPhaseTitle = document.getElementById('breathPhaseTitle');
  const breathSecondsDisplay = document.getElementById('breathSecondsDisplay');
  const breathCycleCounter = document.getElementById('breathCycleCounter');

  const breathingPhases = [
    { title: 'Inhale', scale: 'scale(1.35)', chime: 528 },
    { title: 'Hold', scale: 'scale(1.35)', chime: 587 },
    { title: 'Exhale', scale: 'scale(1.0)', chime: 396 },
    { title: 'Rest', scale: 'scale(1.0)', chime: 352 }
  ];

  function openBreathingModal() {
    openModal('modalBreathing');
    startBoxBreathing();
  }

  function startBoxBreathing() {
    stopBoxBreathing();
    state.isBreathingActive = true;
    state.breathPhase = 0;
    state.breathSecondsLeft = 4;
    state.breathCycleCount = 1;
    updateBreathingVisuals();

    state.breathInterval = setInterval(() => {
      if (!state.isBreathingActive) return;

      state.breathSecondsLeft--;
      if (state.breathSecondsLeft <= 0) {
        state.breathPhase = (state.breathPhase + 1) % breathingPhases.length;
        state.breathSecondsLeft = 4;

        if (state.breathPhase === 0) {
          state.breathCycleCount++;
        }
        updateBreathingVisuals();
      } else {
        if (breathSecondsDisplay) breathSecondsDisplay.textContent = `${state.breathSecondsLeft}s`;
      }
    }, 1000);
  }

  function updateBreathingVisuals() {
    const curPhase = breathingPhases[state.breathPhase];
    if (breathPhaseTitle) breathPhaseTitle.textContent = curPhase.title;
    if (breathSecondsDisplay) breathSecondsDisplay.textContent = `${state.breathSecondsLeft}s`;
    if (breathOuterCircle) breathOuterCircle.style.transform = curPhase.scale;
    if (breathCycleCounter) breathCycleCounter.textContent = `Cycle ${state.breathCycleCount} of 4`;

    // Soothing chime sound on phase shift
    playChime(curPhase.chime, 0.7);
  }

  function stopBoxBreathing() {
    if (state.breathInterval) {
      clearInterval(state.breathInterval);
      state.breathInterval = null;
    }
  }

  if (btnToggleBreathPlay) {
    btnToggleBreathPlay.addEventListener('click', () => {
      state.isBreathingActive = !state.isBreathingActive;
      if (breathPlayIcon) breathPlayIcon.textContent = state.isBreathingActive ? 'pause' : 'play_arrow';
      if (breathPlayText) breathPlayText.textContent = state.isBreathingActive ? 'Pause' : 'Resume';
    });
  }

  if (btnCloseBreathing) {
    btnCloseBreathing.addEventListener('click', () => {
      stopBoxBreathing();
      closeModal('modalBreathing');
    });
  }
  if (btnFinishBreathing) {
    btnFinishBreathing.addEventListener('click', () => {
      stopBoxBreathing();
      closeModal('modalBreathing');
    });
  }

  // ==========================================================================
  // 13. SENSORY GROUNDING 5-4-3-2-1 TOOL
  // ==========================================================================
  function openGroundingModal() {
    openModal('modalGrounding');
  }

  const groundingStepItems = document.querySelectorAll('.grounding-step-item');
  groundingStepItems.forEach(item => {
    item.addEventListener('click', () => {
      playChime(600, 0.25);
      item.classList.toggle('completed');
    });
  });

  const btnCloseGrounding = document.getElementById('btnCloseGrounding');
  const btnFinishGrounding = document.getElementById('btnFinishGrounding');
  if (btnCloseGrounding) btnCloseGrounding.addEventListener('click', () => closeModal('modalGrounding'));
  if (btnFinishGrounding) btnFinishGrounding.addEventListener('click', () => closeModal('modalGrounding'));

  // ==========================================================================
  // 14. SELF-HELP RESOURCES LIBRARY MODAL
  // ==========================================================================
  function openResourcesModal() {
    openModal('modalResources');
  }

  const tabSwitchBtns = document.querySelectorAll('.tab-switch-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playTapSound();
      tabSwitchBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.add('active');
    });
  });

  const btnCloseResources = document.getElementById('btnCloseResources');
  const btnDoneResources = document.getElementById('btnDoneResources');
  if (btnCloseResources) btnCloseResources.addEventListener('click', () => closeModal('modalResources'));
  if (btnDoneResources) btnDoneResources.addEventListener('click', () => closeModal('modalResources'));

  // ==========================================================================
  // 15. AI WELLNESS ASSISTANT SIMULATOR
  // ==========================================================================
  function openAiModal() {
    openModal('modalAi');
  }

  const aiResponses = {
    overwhelmed: "Engineering coursework often demands intense focus. Remember: you don't need to finish the whole syllabus in one sitting. Try the 25-minute sprint rule, drink a glass of water, and ask a classmate or faculty mentor for past papers. You are doing better than you realize.",
    sleep: "When racing thoughts keep you awake before exams, your nervous system is in alert mode. Try the 4-7-8 breathing method or write your worries onto a paper notepad beside your bed. Tell yourself: 'My mind is resting now, and I will solve this tomorrow.'",
    lonely: "Hostel life and new departmental environments can feel isolating, especially during difficult weeks. You are never truly alone: BVM has peer wellness groups and student mentors. Visiting the quiet garden lawn or attending a club workshop can help spark gentle connections.",
    placement: "Placement season and GPA targets carry heavy expectations. Remember that a placement interview evaluates potential, not perfection. Practice one mock problem daily, take regular breaks, and discuss any acute anxiety with the campus counseling cell."
  };

  const aiChipPrompts = document.querySelectorAll('.ai-chip-prompt');
  const aiResponseContent = document.getElementById('aiResponseContent');

  aiChipPrompts.forEach(chip => {
    chip.addEventListener('click', () => {
      playTapSound();
      const query = chip.dataset.query;
      if (aiResponses[query] && aiResponseContent) {
        aiResponseContent.textContent = aiResponses[query];
      }
    });
  });

  const btnCloseAi = document.getElementById('btnCloseAi');
  const btnDoneAi = document.getElementById('btnDoneAi');
  if (btnCloseAi) btnCloseAi.addEventListener('click', () => closeModal('modalAi'));
  if (btnDoneAi) btnDoneAi.addEventListener('click', () => closeModal('modalAi'));

  // ==========================================================================
  // 16. ACCESSIBILITY MODAL
  // ==========================================================================
  const modalAccessibility = document.getElementById('modalAccessibility');
  const btnHeaderAccessibility = document.getElementById('btnHeaderAccessibility');
  const btnFooterAccessibility = document.getElementById('btnFooterAccessibility');
  const btnCloseAccess = document.getElementById('btnCloseAccess');
  const btnDoneAccess = document.getElementById('btnDoneAccess');

  function openAccessibilityModal() {
    openModal('modalAccessibility');
  }

  if (btnHeaderAccessibility) btnHeaderAccessibility.addEventListener('click', openAccessibilityModal);
  if (btnFooterAccessibility) btnFooterAccessibility.addEventListener('click', openAccessibilityModal);
  if (btnCloseAccess) btnCloseAccess.addEventListener('click', () => closeModal('modalAccessibility'));
  if (btnDoneAccess) btnDoneAccess.addEventListener('click', () => closeModal('modalAccessibility'));

  // Text size toggles
  const btnTextStandard = document.getElementById('btnTextStandard');
  const btnTextLarge = document.getElementById('btnTextLarge');
  if (btnTextStandard && btnTextLarge) {
    btnTextStandard.addEventListener('click', () => {
      document.body.classList.remove('large-text-mode');
      btnTextStandard.classList.add('selected');
      btnTextLarge.classList.remove('selected');
    });
    btnTextLarge.addEventListener('click', () => {
      document.body.classList.add('large-text-mode');
      btnTextLarge.classList.add('selected');
      btnTextStandard.classList.remove('selected');
    });
  }

  // Audio toggles in modal
  const btnAudioOn = document.getElementById('btnAudioOn');
  const btnAudioOff = document.getElementById('btnAudioOff');
  if (btnAudioOn && btnAudioOff) {
    btnAudioOn.addEventListener('click', () => {
      state.soundEnabled = true;
      if (soundIcon) soundIcon.textContent = 'volume_up';
      btnAudioOn.classList.add('selected');
      btnAudioOff.classList.remove('selected');
      initAudio();
      playChime(528, 0.4);
    });
    btnAudioOff.addEventListener('click', () => {
      state.soundEnabled = false;
      if (soundIcon) soundIcon.textContent = 'volume_off';
      btnAudioOff.classList.add('selected');
      btnAudioOn.classList.remove('selected');
    });
  }

  // Contrast toggles
  const btnContrastNormal = document.getElementById('btnContrastNormal');
  const btnContrastHigh = document.getElementById('btnContrastHigh');
  if (btnContrastNormal && btnContrastHigh) {
    btnContrastNormal.addEventListener('click', () => {
      document.body.classList.remove('high-contrast-mode');
      btnContrastNormal.classList.add('selected');
      btnContrastHigh.classList.remove('selected');
    });
    btnContrastHigh.addEventListener('click', () => {
      document.body.classList.add('high-contrast-mode');
      btnContrastHigh.classList.add('selected');
      btnContrastNormal.classList.remove('selected');
    });
  }

  // ==========================================================================
  // 17. MODAL UTILITIES
  // ==========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    stopBoxBreathing();
  }

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        if (overlay.id === 'modalInactivity') return; // Inactivity must be answered
        closeModal(overlay.id);
      }
    });
  });

  // ==========================================================================
  // 18. KIOSK INACTIVITY DETECTION (60s with 15s Countdown Warning)
  // ==========================================================================
  const modalInactivity = document.getElementById('modalInactivity');
  const inactivityCountdownText = document.getElementById('inactivityCountdownText');
  const btnInactivityContinue = document.getElementById('btnInactivityContinue');
  const btnInactivityExitNow = document.getElementById('btnInactivityExitNow');

  function resetInactivityTimer() {
    state.lastActivityTime = Date.now();
    if (state.inactivityModalActive) {
      dismissInactivityWarning();
    }
  }

  function checkInactivity() {
    // Only check if user is past welcome screen
    if (state.currentScreen === 'screenWelcome') return;

    const idleSeconds = Math.floor((Date.now() - state.lastActivityTime) / 1000);
    if (idleSeconds >= 45 && !state.inactivityModalActive) {
      triggerInactivityWarning();
    }
  }

  function triggerInactivityWarning() {
    state.inactivityModalActive = true;
    state.inactivityCountdown = 15;
    if (inactivityCountdownText) inactivityCountdownText.textContent = '15';
    openModal('modalInactivity');
    playChime(440, 0.4);

    state.countdownTimerInterval = setInterval(() => {
      state.inactivityCountdown--;
      if (inactivityCountdownText) inactivityCountdownText.textContent = state.inactivityCountdown;

      if (state.inactivityCountdown <= 0) {
        clearInterval(state.countdownTimerInterval);
        dismissInactivityWarning();
        fullSessionReset();
      }
    }, 1000);
  }

  function dismissInactivityWarning() {
    state.inactivityModalActive = false;
    if (state.countdownTimerInterval) {
      clearInterval(state.countdownTimerInterval);
      state.countdownTimerInterval = null;
    }
    closeModal('modalInactivity');
  }

  if (btnInactivityContinue) {
    btnInactivityContinue.addEventListener('click', () => {
      resetInactivityTimer();
      dismissInactivityWarning();
    });
  }

  if (btnInactivityExitNow) {
    btnInactivityExitNow.addEventListener('click', fullSessionReset);
  }

  // Register user interactions to reset timer
  const touchEvents = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
  touchEvents.forEach(evt => {
    window.addEventListener(evt, () => {
      state.lastActivityTime = Date.now();
    }, { passive: true });
  });

  state.inactivityCheckTimer = setInterval(checkInactivity, 3000);

  // URL Hash support for direct linking and bookmarking
  if (window.location.hash) {
    const targetHash = window.location.hash.replace('#', '');
    if (screens[targetHash]) {
      showScreen(targetHash);
      setTimeout(() => window.scrollTo(0, 0), 20);
    } else {
      showScreen('screenWelcome');
    }
  } else {
    // Initialize Welcome screen
    showScreen('screenWelcome');
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash) {
      const targetHash = window.location.hash.replace('#', '');
      if (screens[targetHash]) {
        showScreen(targetHash);
        setTimeout(() => window.scrollTo(0, 0), 20);
      }
    }
  });
});
