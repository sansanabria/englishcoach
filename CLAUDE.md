# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EnglishCoach is a browser-based English learning app for Spanish speakers (A1-A2 level). It is a **zero-dependency single-page app** — pure HTML, CSS, and vanilla JavaScript with no build step, no bundler, no package manager, and no framework.

## Running Locally

Open `index.html` directly in a browser. No server, install, or build command needed.

To regenerate the printable PDF guide:
```bash
pip install reportlab
python create_guide.py
```

## Architecture

The app is a single HTML page (`index.html`) with tab-based navigation. All UI panels are defined in the HTML and toggled via `switchTab()` in `app.js`.

### Data flow

- **`js/data.js`** — Contains all learning content: `defaultSentences` (exercises with Spanish/English pairs, level, unit, grammar type), `verbs` array (built via helper functions `r()` for regular and `ii()` for irregular verbs), `vocabData` (words by topic), and `aAnPracticeWords`.
- **`js/grammar-data.js`** — Contains `grammarTopicsData` (grammar explanations with tables, rules, examples) and `lessonPlanData` (12-week curriculum structure with unit activities).
- **`js/app.js`** — All application logic: tab switching, exercise engine (4 input modes: type, tiles, fill-blank, translate), verb conjugation display/practice, vocabulary grid/practice, grammar rendering, spaced repetition (SRS), progress tracking, and unit-based guided study flow.

### Key conventions in data.js

- Sentence objects use `nl` for the English answer (what the student types) and `en` for the Spanish prompt. This naming is a legacy artifact — do not rename, it's used pervasively.
- Regular verbs are created with `r(infinitive, spanishMeaning)` which auto-generates conjugation forms.
- Irregular verbs use `ii(infinitive, spanishMeaning, present6Array, pastForm, pastPluralForm, participle)`.

### State management

All persistent state uses `localStorage`:
- `ec_progress` — exercise scores, error tracking per sentence
- `ec_streak` / `ec_streak_date` — daily practice streak
- `ec_srs` — spaced repetition schedule data
- `ec_stars` — flagged/starred sentences with optional comments
- `ec_unit_*` — unit progress and activity completion state

### UI language

The entire UI is in **Spanish** (labels, buttons, feedback messages, grammar explanations). English appears only as the target language being taught. All user-facing strings are hardcoded in `app.js` and `index.html`.

### Tab IDs (legacy naming)

Several internal tab/panel IDs use Dutch names from an earlier version:
- `oefening` = sentence practice
- `werkwoorden` = verbs
- `woordenschat` = vocabulary
- `grammatica` = grammar
- `leerplan` = lesson plan
- `zinnen` = all sentences list

These are referenced throughout HTML, CSS, and JS — renaming would require coordinated changes across all three files.
