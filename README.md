# Campus Sanctuary — Student Mental Health Support Kiosk
### Birla Vishvakarma Mahavidyalaya (BVM) Engineering College • Student Well-Being Cell

An anonymous, trauma-informed self-service touchscreen kiosk web application crafted specifically for engineering students facing academic, exam, and placement pressures. Built with modern biophilic minimalism and organic calm, adhering to the **Campus Sanctuary** design system.

---

## 🌿 Key Features

### 1. Six Fully Integrated Kiosk Screens
* **Screen 1: Welcome & Campus Sanctuary**
  * Anonymous, zero-login entryway with reassuring privacy badges.
  * Direct CTAs: **Start Check-In (2–3 min)**, **Explore Self-Help**, and **Counseling Support**.
  * Quick 30-Second Grounding Pause bar for students needing an immediate breath pause.
  * Campus Heritage visual sanctuary card featuring the iconic **BVM Engineering College** campus building and garden lawn (`bvm_image.webp`).
  * Live-pulsing gentle breath pacing rhythm indicator (*Inhale... Hold... Exhale... Rest...*).

* **Screen 2: Mood & Influence Check**
  * 6 large touch-friendly mood tiles: **Happy**, **Okay**, **Neutral**, **Stressed**, **Sad**, and **Anxious**.
  * Multi-select influence tags tailored to engineering student realities: **Academic Work**, **Exams & Mid-Sems**, **Sleep & Fatigue**, **Relationships**, **Hostel & Loneliness**, and **Placements & Career**.

* **Screen 3: Well-Being Assessment Questionnaire**
  * 8 empathetic screening questions addressing lab submissions, exam anxiety, concentration, hostel life, and placement stress.
  * 4-option frequency scale: **Never**, **Sometimes**, **Often**, and **Very Often**.
  * Real-time progress bar, question counter, skip option, and backtrack controls.

* **Screen 4: Results & Personal Summary**
  * Dynamic stress classification (**Low Stress • Steady State**, **Moderate Stress**, or **High Academic Tension • Support Recommended**).
  * Reassuring non-clinical feedback emphasizing self-care and iterative progress.
  * One-tap shortcuts to guided breathing, relaxation, and campus counselor booking.

* **Screen 5: Self-Help & Coping Library**
  * **Guided Box Breathing**: Interactive expanding visual circle with a 4-4-4-4 rhythm timer, cycle counter, play/pause controls, and synthesized acoustic chimes.
  * **5-4-3-2-1 Sensory Grounding Tool**: Step-by-step interactive mindfulness exercise with interactive checkmarks.
  * **Campus Self-Help Toolkits**: Tabbed guides on *Academic & Exam Sprints*, *Sleep Hygiene for Engineers*, and *Quiet Sanctuaries on BVM Campus*.
  * **AI Wellness Companion**: Interactive Q&A simulator providing compassionate, grounded answers to common student struggles.

* **Screen 6: University Counseling Connection & Confidential Pass**
  * Choice of support: **Book an Appointment**, **Request a Callback**, or **View Available Support**.
  * Preferred time slot selector (Morning, Afternoon, Evening) and session format (In-person at Room B-201, Phone, or Video).
  * Optional student notes with live character counter.
  * **Confidential Appointment Pass Generator**: Generates an anonymous reference token (e.g., `BVM-WELL-8942`) with an authentic SVG QR code and a printable summary card.

---

## 🎨 Design System & Aesthetics (`DESIGN.md`)

* **Authentic Campus Backdrop**: Integrates high-resolution photographic imagery of Birla Vishvakarma Mahavidyalaya (`bvm_image.webp`) with a serene, frosted biophilic overlay ensuring WCAG AAA legibility.
* **Palette**:
  * Canvas & Surfaces: `#f4faff` / `#ffffff` with subtle structural borders (`#e2e8e4`).
  * Primary Accent: `#3b748e` (Serene slate ocean blue) & `#1e5b74`.
  * Secondary Accent: `#2f6954` / `#4e8771` (Botanical sage green) & `#b0ecd2`.
  * Status & Safety Badges: Soft mint tints (`#e6f3ed`) and deep forest sage text (`#2d664f`).
  * Urgency / Crisis Hotline: Terracotta tint (`#d95d39` / `#ba1a1a`).
* **Typography**:
  * Headings & Display: **Manrope** (Rounded geometric letterforms projecting empathy).
  * Body & Controls: **Inter** (High legibility, distinct numeral forms).
  * Icons: **Google Material Symbols Outlined**.

---

## 🛡️ Privacy & Kiosk Accessibility

* **100% Anonymous**: No student ID, roll number, or personal login required.
* **Inactivity Auto-Clear**: Automatically detects 45 seconds of inactivity and initiates a 15-second visual countdown before cleanly wiping all responses and returning to the welcome screen.
* **Quick Exit / Reset**: Prominent 1-tap exit buttons in both header and footer to instantly wipe session data.
* **Text Sizing**: Standard (A) and Large (A+) accessibility modes.
* **Web Audio Synthesis**: Built-in harmonic singing bowl chime on breathing transitions using the native browser Web Audio API (no external audio files required).
* **24/7 Crisis Access**: Persistent footer callout linking students to the 24/7 Crisis Line `(800) 273-TALK`, national helpline `1800-599-0019 (KIRAN)`, and BVM Counseling Room B-201.

---

## 💻 Tech Stack

* **Structure**: Semantic HTML5 with ARIA landmark roles and accessibility tags.
* **Styling**: Pure Vanilla CSS3 with custom properties, responsive grid/flexbox layouts, and planar elevation.
* **Logic**: Vanilla ES6 JavaScript (zero heavy framework dependencies).
* **Audio**: Native Web Audio API for soothing bell chimes and tactile feedback.
* **Assets**: BVM Campus imagery (`bvm_image.webp`, `bvm_image2.webp`).

---

## 🚀 Running Locally

You can run this project with any local HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx serve
npx serve .
```

Open your browser to `http://localhost:8000`.

---

© Birla Vishvakarma Mahavidyalaya (BVM) Engineering College • Student Well-Being Cell
Vallabh Vidyanagar, Gujarat, India.
