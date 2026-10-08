---
name: Campus Sanctuary
colors:
  surface: '#f4faff'
  surface-dim: '#d4dbe0'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4fa'
  surface-container: '#e8eff4'
  surface-container-high: '#e2e9ee'
  surface-container-highest: '#dce3e9'
  on-surface: '#161d20'
  on-surface-variant: '#40484c'
  inverse-surface: '#2a3136'
  inverse-on-surface: '#ebf2f7'
  outline: '#71787d'
  outline-variant: '#c0c7cd'
  surface-tint: '#2a657e'
  primary: '#1e5b74'
  on-primary: '#ffffff'
  primary-container: '#3b748e'
  on-primary-container: '#e1f3ff'
  inverse-primary: '#96ceeb'
  secondary: '#2f6954'
  on-secondary: '#ffffff'
  secondary-container: '#b0ecd2'
  on-secondary-container: '#346d58'
  tertiary: '#475952'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f726a'
  on-tertiary-container: '#e1f6ec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c0e8ff'
  primary-fixed-dim: '#96ceeb'
  on-primary-fixed: '#001e2b'
  on-primary-fixed-variant: '#034d65'
  secondary-fixed: '#b3efd5'
  secondary-fixed-dim: '#98d3ba'
  on-secondary-fixed: '#002116'
  on-secondary-fixed-variant: '#12503d'
  tertiary-fixed: '#d2e7dd'
  tertiary-fixed-dim: '#b7cbc2'
  on-tertiary-fixed: '#0d1f19'
  on-tertiary-fixed-variant: '#384b43'
  background: '#f4faff'
  on-background: '#161d20'
  surface-variant: '#dce3e9'
typography:
  display:
    fontFamily: Manrope
    fontSize: 44px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  label-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 2rem
  margin: 3rem
  space-xs: 0.5rem
  space-sm: 1rem
  space-md: 1.5rem
  space-lg: 2rem
  space-xl: 3rem
---

## Brand & Style
The design system establishes a tranquil, private, and deeply reassuring mental health kiosk environment crafted specifically for university and college students. Facing acute academic, social, and developmental pressures, students interacting with on-campus kiosks require an atmosphere that immediately disarms anxiety without feeling sterile, paternalistic, or bureaucratic.

The design movement centers on warm, organic modern minimalism infused with trauma-informed, biophilic calm. Visual noise is strictly eradicated: no harsh gradients, no glassmorphism or distracting blurs, no aggressive gamification, and no stark, hospital-grade whites that induce medical dread. The system prioritizes physical clarity, generous breathing room, non-threatening touch affordances, and absolute legibility to lower cognitive friction in states of vulnerability or crisis.

## Colors
The palette is built around grounding botanical and oceanic tones balanced against comforting, warm-toned neutrals. 

- **Canvas & Backgrounds:** The foundational canvas rests on `#F8FAF9`, an ultra-gentle tinted greenish-white that prevents screen glare and softens ambient light in campus hallways or student centers.
- **Surfaces & Cards:** Interactive modules and informational containers use solid, pure `#FFFFFF`, distinguished by subtle, low-contrast structural borders (`#E2E8E4`) rather than heavy dropshadows.
- **Primary Accent (`#3B748E`):** A serene, grounded slate ocean blue for primary calls-to-action, key path indicators, and reassuring confirmations. Active/hover touch state transitions gracefully to `#27576C`.
- **Secondary Accent (`#4E8771`):** A calming botanical sage green utilized for supportive accents, wellness pathways, and self-guided screening confirmations.
- **Tints & Status Badges:** Soft mint tints (`#E6F3ED` and `#EBF5F0`) paired with deep forest sage text (`#2D664F`) indicate safe states, confidential indicators, and session confirmations without harsh semantic alarms.
- **Typography & Neutrals:** Primary headlines and readable content use deep charcoal (`#20272B`) to maintain strong AA/AAA contrast ratios without the jarring severity of pure black. Secondary captions, breadcrumbs, and metadata use muted slate-slate (`#5F6E72`).
- **Emergency / Immediate Help:** When immediate crisis contacts or 24/7 hotlines are presented, a warm, non-punitive terracotta tint (`#D95D39` muted on `#FDF2EE`) provides clear urgency without inducing panic.

## Typography
Typography is tuned specifically for arm's-length interaction on a 1440x900 touch kiosk. Manrope handles all display headings with its warm, rounded geometric letterforms that project empathy and approachable authority. Inter supports all body text and UI controls, providing clinical-level legibility, clear apertures, and distinct numeral forms essential for assessment scoring and privacy information.

Scale rules:
- Kiosk interactions require larger base sizes than standard desktop screens: body copy never drops below 18px for instructional content.
- Generous line heights prevent scanning fatigue and lower the processing burden for stressed or overwhelmed students.
- Button labels match body sizing (18px-20px) with medium-to-semibold weights to ensure instantaneous target recognition.

## Layout & Spacing
The layout operates on a fixed 12-column grid optimized for a horizontal touch display (1440x900 resolution). The outer canvas margin is maintained at a generous 48px (`3rem`) to prevent interactive elements from hugging the hardware bezel, ensuring comfortable hand ergonomics.

Key layout principles:
- **Ergonomic Touch Reach:** Essential navigation, emergency exits, and "Clear Screen / Privacy Now" commands live strictly within the lower 60% and bottom corners of the viewport, well within natural arm reach.
- **Card Gaps & Padding:** Interactive tiles utilize `2rem` (32px) margins and internal component padding of `24px` to `32px` to prevent accidental adjacent taps.
- **Single-Concept Screening:** Questionnaires, stress level scales, and resource exploration cards are presented one thought at a time or in clear groups of maximum 3-4 cards across the 12-column span to avoid decision fatigue.

## Elevation & Depth
Elevation is rendered strictly flat and planar, rejecting heavy skeuomorphism and glossy drop shadows. Depth is communicated primarily through crisp container borders and soft, tinted surface separation:

- **Base Layer (Level 0):** `#F8FAF9` viewport background.
- **Card Containers (Level 1):** Solid `#FFFFFF` surfaces bounded by a 1.5px solid border in `#E2E8E4`. An ambient, barely perceptible tint shadow (`0 4px 16px rgba(32, 39, 43, 0.03)`) lifts the card without creating artificial floating layers.
- **Active / Pressed Touch State (Level 2):** Subtle physical affirmation on touch: the card border transitions to `#3B748E` with an inner or micro-offset shadow (`0 2px 8px rgba(59, 116, 142, 0.10)`), accompanied by a gentle scale transition (99.5%).
- **Modals & Overlays (Level 3):** Modal sheets (such as crisis helpline popups or privacy wipe alerts) utilize a calm `#FFFFFF` surface framed by `#E2E8E4`, cast against an ambient background backdrop of `#20272B` at 35% opacity.

## Shapes
The shape language conveys safety, softness, and biological calm through deliberate roundedness. 
- Primary interactive cards and major surface panels use a consistent radius between 16px and 18px (`1rem` to `1.125rem`).
- Buttons and touch targets feature soft, full curvature or generous 14px to 16px corners to eliminate any perceived sharpness or aggressive edges.
- Status badges, category filters, and crisis resource tags use full pill shapes (`9999px`) to invite gentle tactile engagement.

## Components

### Buttons & Interactive Touch Affordances
- **Primary Action:** Solid `#3B748E` background with `#FFFFFF` text, 64px minimum height for effortless touch capture, 16px corner radius. States: Hover/Active `#27576C`.
- **Secondary Action:** `#FFFFFF` background with 1.5px border `#E2E8E4`, text in `#3B748E`. On touch, transitions to surface tint `#EBF5F0`.
- **Crisis / Immediate Support Action:** Prominent bottom-docked or persistent floating action button featuring `#D95D39` background or high-contrast pill styling with a prominent phone icon, ensuring immediate 1-tap exit to human help.
- **Privacy "Quick Exit / Clear Screen":** Always-visible top-right control styled in neutral soft slate border, resetting the kiosk immediately to the idle welcome screen with no trace of user data.

### Cards & Resource Tiles
- Sized generously for multi-finger touch accessibility (minimum height 160px).
- Flat pure white interior `#FFFFFF` with a crisp 1.5px boundary in `#E2E8E4`.
- Incorporates category pill badges at top-left, followed by a bold 22px-26px Manrope title and 2 lines of high-legibility Inter body copy.
- Selection states display a calm sage checkmark icon in `#4E8771` inside an `#E6F3ED` circle container.

### Chips & Mood/Symptom Selectors
- Self-assessment tags (e.g., "Trouble Sleeping", "Academic Burnout", "Anxiety") are styled as large pill chips (52px height).
- Unselected: `#FFFFFF` fill, `#E2E8E4` border, `#5F6E72` text.
- Selected: `#E6F3ED` fill, 2px `#4E8771` border, `#2D664F` text with bold font weight.

### Form Inputs & Numeric Sliders
- Touch keyboards and keypads utilize large 72px square buttons with high visual spacing to prevent mistypes.
- Assessment sliders (e.g., scale 1-10) feature broad touch tracks (12px height) in `#E4ECE7` with a large, friendly thumb (36px circular knob in `#3B748E`) and continuous, non-judgmental text feedback above the track.

### Informational Privacy Banners
- Subtle ribbons at the top or bottom of every workflow communicating: *"Completely anonymous. No student ID or record is saved unless you request an appointment."* Set in `#EBF5F0` background with `#2D664F` text and an unobtrusive lock glyph.