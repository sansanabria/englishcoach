<p align="center">
  <img src="https://img.shields.io/badge/Level-A1--A2-276047?style=for-the-badge" alt="Level A1-A2" />
  <img src="https://img.shields.io/badge/Language-Spanish_Speakers-1B3D7A?style=for-the-badge" alt="For Spanish Speakers" />
  <img src="https://img.shields.io/badge/Status-In_Development-orange?style=for-the-badge" alt="In Development" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

# EnglishCoach

**A structured English learning app for Spanish speakers — from A1 to A2 in 12 weeks.**

EnglishCoach is a free, browser-based language learning tool designed specifically for native Spanish speakers who are beginning their English journey. It provides a complete, synchronized curriculum with grammar lessons, vocabulary, verb conjugation, and interactive exercises.

> **Note:** This app is under active development. Lessons, vocabulary, exercises, and grammar content are continuously updated and tailored to match the specific needs of each student. Expect regular improvements as the curriculum evolves.

---

## Features

| Feature | Description |
|---|---|
| **Lesson Plan** | Structured 12-week curriculum across 6 units (A1–A2) |
| **Grammar** | 9 grammar topics with tables, rules, examples, and tips — all in Spanish and English |
| **Vocabulary** | 180+ words organized by 14 topics (greetings, family, food, colours, clothing, etc.) |
| **Verb Conjugation** | 70+ verbs (regular, irregular, modal) with full conjugation tables |
| **Sentence Practice** | 100+ exercises with 4 input modes: type, tiles, fill-in-blank, translate |
| **A/An Practice** | Dedicated practice for English article usage based on sound rules |
| **Spaced Repetition** | SRS system that brings back sentences you got wrong |
| **Progress Tracking** | Daily streak, per-unit progress, error tracking |
| **Bilingual** | All content in both Spanish and English |

## Curriculum

### Level A1 — Beginner (Weeks 1–8)

| Unit | Topic | Grammar | Vocabulary |
|------|-------|---------|------------|
| 1 | Greetings & Introductions | Subject pronouns, am/is/are, Verb "to be" | Greetings, Personal info, Countries, Emotions, Family, Numbers 1–20 |
| 2 | Family & Daily Life | Articles (a/an/the), Present simple | Family, Time, Adjectives |
| 3 | Questions & Negatives | Negation (don't/doesn't), WH-questions | Food, Colours, Clothing |
| 4 | Home & City | There is / There are | Home, Transport |

### Level A2 — Elementary (Weeks 9–12)

| Unit | Topic | Grammar | Vocabulary |
|------|-------|---------|------------|
| 5 | Actions in Progress | Present continuous (be + verb-ing) | Body, Adjectives |
| 6 | Talking About the Past | Simple past (regular & irregular) | Time, Food, Transport |

## How It Works

All content within each unit is **fully synchronized**:

- **Vocabulary** introduces the words for the unit
- **Grammar** examples use only vocabulary the student has already learned
- **Exercises** practice sentences using the same vocabulary and grammar patterns
- **Verbs** focus on the conjugations relevant to that unit

This ensures students never encounter unfamiliar words in their exercises.

## Getting Started

### Use Online

Simply visit the hosted version:

> **[https://sansanabria.github.io/englishcoach](https://sansanabria.github.io/englishcoach)**

### Run Locally

No build tools or dependencies required — just open the file:

```bash
git clone https://github.com/sansanabria/englishcoach.git
cd englishcoach
open index.html
```

## Project Structure

```
englishcoach/
├── index.html              # Main application (single-page app)
├── css/
│   └── styles.css          # All styles and responsive design
├── js/
│   ├── app.js              # Application logic, UI, navigation
│   ├── data.js             # Sentences, verbs, vocabulary, a/an practice
│   └── grammar-data.js     # Grammar topics and lesson plan structure
├── Guia_EnglishCoach.pdf   # Printable user guide (Spanish)
└── README.md
```

## Technology

- **Pure HTML, CSS, JavaScript** — no frameworks, no build step
- **LocalStorage** for progress persistence
- **Responsive design** — works on mobile, tablet, and desktop
- **Offline capable** — works without internet after first load

## Contributing

Contributions are welcome! If you'd like to:

- Add more vocabulary or sentences
- Fix translations
- Add new grammar topics
- Improve the UI

Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with care for Spanish speakers learning English.</strong>
</p>
