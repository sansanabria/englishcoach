// ─── ACTIVE SENTENCES (overrideable by localStorage) ─────────────────────────

let sentences = [...defaultSentences];

// ─── TAB SWITCHING ───────────────────────────────────────────────────────────

function switchTab(id) {
  console.log('switchTab called with id:', id);
  // Auto-save sentence edits when leaving Bewerken tab
  const current = document.querySelector('.tab-btn.active');
  if (current && current.dataset.tab === 'bewerken' && id !== 'bewerken') {
    _autoSaveEdits();
  }
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + id));
  if (id === 'home')         renderHome();
  if (id === 'oefening')     { loadSentence(); renderUnitBar('oefening'); }
  if (id === 'bewerken')     { renderEditTable(); renderFlagsSection(); }
  if (id === 'woordenschat') { renderVocab(); renderUnitBar('woordenschat'); }
  if (id === 'werkwoorden')  renderUnitBar('werkwoorden');
  if (id === 'dehet')        renderUnitBar('dehet');
  if (id === 'grammatica')   { renderGrammarContent(); renderUnitBar('grammatica'); }
  if (id === 'leerplan')     renderLessonPlan();
}

function _setStat(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderHome() {
  // Hero stats
  const streakBadge = document.getElementById('streak-badge');
  const streakNum = streakBadge ? streakBadge.textContent.replace(/[^0-9]/g, '') : '0';
  _setStat('home-streak', streakNum || '0');
  _setStat('home-sentences', sentences.length);
  const due = getDueSentences().length;
  _setStat('home-due', due);

  // Continue bar + section visibility based on unit state
  const continueBar = document.getElementById('home-continue-bar');
  const practiceSec = document.querySelector('.home-section'); // first section (Practicar)
  const refSec = document.querySelectorAll('.home-section')[1]; // second section (Aprender)

  if (activeUnit) {
    // ── Unit active: show unit progress dashboard, hide generic cards ──
    if (practiceSec) practiceSec.style.display = 'none';
    if (refSec) refSec.style.display = 'none';

    const u = activeUnit;
    const acts = u.activities || [];
    const prog = activityProgress[u.unit] || [];
    const doneCount = prog.filter(Boolean).length;
    const totalActs = acts.length;
    const currentLabel = _getActivityLabel(u.unit, activeActivityIdx);
    const currentAct = acts[activeActivityIdx];
    const allDone = doneCount >= totalActs;

    const stepsHtml = acts.map((a, i) => {
      const isDone = !!prog[i];
      const isCurrent = i === activeActivityIdx;
      const stepLabel = _getActivityLabel(u.unit, i);
      return `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;
        background:${isCurrent ? 'var(--primary)' : isDone ? 'var(--success-bg)' : 'var(--surface2)'};
        color:${isCurrent ? '#fff' : isDone ? 'var(--success)' : 'var(--text-muted)'};
        cursor:pointer" onclick="_navigateToActivity(${i})">
        <span style="font-weight:700;font-size:0.85rem">${isDone ? '✓' : ''} ${stepLabel}</span>
        <span style="font-size:0.85rem">${a.desc}</span>
      </div>`;
    }).join('');

    if (continueBar) {
      continueBar.innerHTML = `
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:16px;padding:24px;margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">
            <span class="unit-bar-chip unit-bar-chip--${u.level.toLowerCase()}" style="font-size:0.9rem;padding:4px 14px">Unidad ${u.unit} · ${u.level}</span>
            <span style="font-size:1.1rem;font-weight:700">${u.title}</span>
            <span style="font-size:0.85rem;color:var(--text-muted);margin-left:auto">${doneCount}/${totalActs} completado</span>
            <button class="unit-bar-clear" onclick="clearActiveUnit(); renderHome()" title="Salir de la unidad">✕ Salir</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
            ${stepsHtml}
          </div>
          <div style="text-align:center">
            ${allDone
              ? `<button class="btn btn-primary" onclick="switchTab('leerplan')" style="font-size:1rem;padding:12px 28px">✓ ¡Unidad completada! — Ver plan de estudio →</button>`
              : `<button class="btn btn-primary" onclick="_navigateToActivity(${activeActivityIdx})" style="font-size:1rem;padding:12px 28px">
                  ${_activityPracticing ? 'Continuar practicando frases →' : `Continuar: ${currentLabel} →`}
                </button>`
            }
          </div>
        </div>`;
    }
  } else {
    // ── No unit active: show generic dashboard ──
    if (practiceSec) practiceSec.style.display = '';
    if (refSec) refSec.style.display = '';

    if (continueBar) {
      if (lastStudyPosition && lastStudyPosition.unit) {
        const allUnits = _allUnits();
        const lu = allUnits.find(u => u.unit === lastStudyPosition.unit);
        if (lu) {
          const firstInc = _firstIncompleteActivity(lu);
          const allDone = firstInc === null;
          const lvClass = lu.level.toLowerCase();
          continueBar.innerHTML = `<div class="home-continue home-continue--unit">
            <div class="home-continue-unit-info">
              <span class="home-continue-label">Continuar</span>
              <span class="badge badge-${lvClass}">${lu.level} · Unidad ${lu.unit}</span>
              <span class="home-continue-unit-title">${lu.title}</span>
              <span class="home-continue-step">${allDone ? '✓ Todos los pasos completados' : 'Paso ' + _getActivityLabel(lu.unit, firstInc)}</span>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${allDone
                ? `<button class="btn btn-secondary home-continue-btn" onclick="switchTab('leerplan')">Ver plan →</button>`
                : `<button class="btn btn-primary home-continue-btn" onclick="setActiveUnit(${lu.unit})">Continuar →</button>`
              }
              <button class="btn btn-secondary home-continue-btn" onclick="switchTab('leerplan')">Plan de estudio</button>
            </div>
          </div>`;
        }
      } else {
        continueBar.innerHTML = `<div class="home-continue home-continue--empty">
          <span>Elige una unidad en el plan de estudio para empezar</span>
          <button class="btn btn-primary home-continue-btn" onclick="switchTab('leerplan')">Plan de estudio →</button>
        </div>`;
      }
    }
  }

  // Card stats
  const practiced = Object.keys(sentenceStats).length;
  const errors    = sentences.filter(s => { const st = sentenceStats[s.nl]; return st && st.w > st.c; }).length;
  const statParts = [practiced + ' practicadas'];
  if (due > 0) statParts.push(due + ' para repasar');
  if (errors > 0) statParts.push(errors + ' errores');
  _setStat('home-stat-oefening', statParts.join(' · '));

  _setStat('home-stat-werkwoorden', (typeof verbs !== 'undefined' ? verbs.length : 0) + ' verbos');
  _setStat('home-stat-dehet', dhCorrect + ' correcto · ' + dhWrong + ' incorrecto');
  _setStat('home-stat-woordenschat', (typeof vocabulary !== 'undefined' ? vocabulary.length : 0) + ' palabras');
  if (typeof grammarTopicsData !== 'undefined') {
    const total = grammarTopicsData.length;
    const read = grammarTopicsData.filter(t => grammarReadData[t.id]).length;
    const errCount = _totalGrammarErrors();
    let grammarStat = read + '/' + total + ' estudiado';
    if (errCount > 0) grammarStat += ' · ' + errCount + ' errores';
    _setStat('home-stat-grammatica', grammarStat);
  }
  _setStat('home-stat-leerplan', '2 niveles · 6 unidades');
  _setStat('home-stat-zinnen', sentences.length + ' frases en total');
  const flagCount = Object.values(sentenceFlags).filter(f => f.starred).length;
  _setStat('home-stat-bewerken', flagCount ? flagCount + ' pregunta(s) marcada(s)' : '');
}

function _mergeGrammarMeta(nl, level, en) {
  // Try to keep stype/srule from current sentences or defaultSentences
  const existing = sentences.find(s => s.nl === nl)
    || defaultSentences.find(s => s.nl === nl);
  return existing
    ? { nl, en, level, stype: existing.stype, srule: existing.srule, gtopic: existing.gtopic }
    : { nl, en, level };
}

function _autoSaveEdits() {
  const rows = document.querySelectorAll('#edit-tbody tr');
  if (!rows.length) return;
  const updated = [];
  rows.forEach(row => {
    const nl    = row.querySelector('[data-field="nl"]')?.value.trim();
    const en    = row.querySelector('[data-field="en"]')?.value.trim();
    const level = row.querySelector('[data-field="level"]')?.value;
    if (nl && en) updated.push(_mergeGrammarMeta(nl, level, en));
  });
  if (updated.length) {
    sentences = updated;
    localStorage.setItem(SENTENCES_KEY, JSON.stringify(sentences));
    rebuildActive();
    renderSentences('all');
    updateSentenceCount();
  }
}

// ─── VOCABULARY ───────────────────────────────────────────────────────────────

let vocabLevel = 'all';
let vocabTopic = 'all';
let vocabUnitTopics = null; // null = no unit filter, array of topic strings when unit is active
let vocabUnitLevel = null;  // null or level string (e.g. 'A1') when unit is active

const topicLabels = {
  greetings: 'Saludos', personal: 'Datos personales', family: 'Familia',
  food: 'Comida & bebida', home: 'Casa', transport: 'Transporte',
  time: 'Tiempo & días', numbers: 'Números', colours: 'Colores',
  clothing: 'Ropa', body: 'Cuerpo', adjective: 'Adjetivos',
  animals: 'Animales', work: 'Trabajo', shopping: 'Compras',
  verbs: 'Verbos', prepositions: 'Preposiciones', expressions: 'Expresiones',
  countries: 'Países y nacionalidades', emotions: 'Emociones y estados',
};

function filterVocab() { renderVocab(); }

function _getVocabList() {
  const query = (document.getElementById('vocab-search')?.value || '').toLowerCase();
  return vocabulary.filter(w => {
    if (vocabUnitTopics) {
      if (w.level !== vocabUnitLevel) return false;
      if (!vocabUnitTopics.includes(w.topic)) return false;
    } else {
      if (vocabLevel !== 'all' && w.level !== vocabLevel) return false;
      if (vocabTopic !== 'all' && w.topic !== vocabTopic) return false;
    }
    if (query && !w.nl.toLowerCase().includes(query) && !w.en.toLowerCase().includes(query)) return false;
    return true;
  });
}

function renderVocab() {
  const hidden = document.getElementById('vocab-hide-cb')?.checked;
  const list = _getVocabList();

  document.getElementById('vocab-count-badge').textContent = list.length + ' palabras';

  // Show practice button only when a unit is active
  const practiceBtn = document.getElementById('vocab-practice-btn');
  if (practiceBtn) practiceBtn.style.display = (vocabUnitTopics && list.length > 0) ? '' : 'none';

  document.getElementById('vocab-grid').innerHTML = list.map(w => `
    <div class="vocab-card" onclick="this.classList.toggle('revealed')">
      <div class="vocab-top">
        <span class="vocab-word">${w.nl}</span>
        <span class="badge badge-${w.level.toLowerCase()}">${w.level}</span>
      </div>
      <div class="vocab-meta">
        <span class="vocab-type">${w.type}</span>
        <span class="vocab-topic-tag">${topicLabels[w.topic] || w.topic}</span>
      </div>
      <div class="vocab-translation ${hidden ? 'hidden-translation' : ''}">${w.en}</div>
    </div>`).join('');

  renderTopicFilters();
  // Keep unit bar word count in sync
  if (vocabUnitTopics) renderUnitBar('woordenschat');
}

function renderTopicFilters() {
  // When a unit is active, hide the topic filter bar (unit controls the topics)
  const wrap = document.getElementById('vocab-topic-filters');
  if (vocabUnitTopics) { wrap.innerHTML = ''; return; }
  const topics = [...new Set(
    vocabulary
      .filter(w => vocabLevel === 'all' || w.level === vocabLevel)
      .map(w => w.topic)
  )];
  wrap.innerHTML =
    `<button class="filter-btn ${vocabTopic==='all'?'active':''}" onclick="setVocabTopic('all',this)">Todos los temas</button>` +
    topics.map(t =>
      `<button class="filter-btn ${vocabTopic===t?'active':''}" data-vtopic="${t}" onclick="setVocabTopic('${t}',this)">${topicLabels[t]||t}</button>`
    ).join('');
}

function setVocabLevel(level, btn) {
  vocabLevel = level;
  vocabTopic = 'all';
  document.querySelectorAll('#vocab-level-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderVocab();
}

function setVocabTopic(topic, btn) {
  vocabTopic = topic;
  document.querySelectorAll('#vocab-topic-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderVocab();
}

// ─── SENTENCE EXERCISE ───────────────────────────────────────────────────────

// ─── UNIT PROGRESS ────────────────────────────────────────────────────────────

const UNIT_PROGRESS_KEY = 'englishcoach_unit_progress';
let unitProgress = {};

function _loadUnitProgress() {
  try {
    const s = localStorage.getItem(UNIT_PROGRESS_KEY);
    if (s) unitProgress = JSON.parse(s);
  } catch(e) { unitProgress = {}; }
}

function _saveUnitProgress() {
  localStorage.setItem(UNIT_PROGRESS_KEY, JSON.stringify(unitProgress));
}

function _ensureUP(n) {
  if (!unitProgress[n]) unitProgress[n] = { vocab: false, dehet: false, sentences: false, werkwoorden: false };
}

function markUnitExercise(unitNum, type, done) {
  _ensureUP(unitNum);
  unitProgress[unitNum][type] = (done !== false);
  _saveUnitProgress();
  renderAllUnitBars();
  // Refresh leerplan if visible
  if (document.getElementById('panel-leerplan')?.classList.contains('active')) renderLessonPlan();
}

function resetUnitProgress(unitNum) {
  unitProgress[unitNum] = { vocab: false, dehet: false, sentences: false, werkwoorden: false };
  _saveUnitProgress();
  renderAllUnitBars();
  if (document.getElementById('panel-leerplan')?.classList.contains('active')) renderLessonPlan();
}

const STATS_KEY = 'englishcoach_stats';
const FLAGS_KEY = 'englishcoach_flags';
const GRAMMAR_READ_KEY = 'englishcoach_grammar_read';
const LAST_POSITION_KEY = 'englishcoach_last_position';
let sentenceStats = {};     // key: s.nl → { c: correct, w: wrong }
let grammarReadData = {};   // key: topicId → true
let lastStudyPosition = null; // { unit: N, tab: 'grammatica', timestamp: ms }

function _saveLastPosition(unitNum, tab) {
  lastStudyPosition = { unit: unitNum, tab, timestamp: Date.now() };
  localStorage.setItem(LAST_POSITION_KEY, JSON.stringify(lastStudyPosition));
}
let sentenceFlags = {};   // key: s.nl → { starred: bool, comment: string }
let exMode = 'all';       // 'all' | 'errors' | 'spaced'
let exLevel = 'all';      // 'all' | 'A1' | 'A2' | 'B1' | 'B2'
let exGrammar = 'all';    // 'all' | grammar key
let activeSentences = [];

// Maps grammar filter key → predicate (checks gtopic first, then stype)
const exGrammarMap = {
  negation:   s => s.gtopic === 'negation'   || s.stype === 'Negation',
  question:   s => s.gtopic === 'question'   || s.stype === 'Question',
  tenses:     s => s.gtopic === 'tenses'     || ['Statement','Compound sentence'].includes(s.stype),
  'there-is': s => s.gtopic === 'there-is'   || (s.stype || '').includes('There'),
  pronouns:   s => s.gtopic === 'pronouns',
  articles:   s => s.gtopic === 'articles',
  'verb-be':  s => s.gtopic === 'verb-be',
  plurals:    s => s.gtopic === 'plurals',
};

function _buildPool() {
  let pool = [...sentences];
  // When a unit is active, only show sentences for that unit
  if (activeUnit) {
    pool = pool.filter(s => s.unit === activeUnit.unit);
  } else {
    if (exLevel !== 'all') pool = pool.filter(s => s.level === exLevel);
  }
  if (exGrammar !== 'all' && exGrammarMap[exGrammar]) pool = pool.filter(exGrammarMap[exGrammar]);
  return pool;
}

function filterExLevel(level, btn) {
  document.querySelectorAll('#ex-level-filter .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  exLevel = level;
  rebuildActive();
  exIdx = 0; // start at first unanswered in new pool
  loadSentence();
}

function filterExGrammar(grammar, btn) {
  document.querySelectorAll('#ex-grammar-filter .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  exGrammar = grammar;
  rebuildActive();
  exIdx = 0;
  loadSentence();
}

function rebuildActive() {
  const pool = _buildPool();
  if (exMode === 'errors') {
    activeSentences = pool.filter(s => { const st = sentenceStats[s.nl]; return st && st.w > st.c; });
  } else if (exMode === 'spaced') {
    activeSentences = getDueSentences().filter(s =>
      (exLevel === 'all' || s.level === exLevel) &&
      (exGrammar === 'all' || !exGrammarMap[exGrammar] || exGrammarMap[exGrammar](s))
    );
    if (activeSentences.length === 0) activeSentences = pool;
  } else {
    // Only unanswered sentences — counter and "resterend" will always match
    const unanswered = pool.filter(s => { const st = sentenceStats[s.nl]; return !st || (st.c + st.w) === 0; });
    activeSentences = unanswered.length > 0 ? unanswered : pool; // fallback to full pool if all done
  }
  updateModeLabel();
}

function updateModeLabel() {
  const el = document.getElementById('ex-mode-count');
  if (!el) return;
  if (exMode === 'errors') {
    el.textContent = activeSentences.length
      ? activeSentences.length + ' frase(s) con más errores que aciertos'
      : 'Sin errores — practicando todas las frases';
  } else if (exMode === 'spaced') {
    el.textContent = activeSentences.length + ' frases para repasar';
  } else {
    el.textContent = activeSentences.length + ' frases';
  }
}

function setExMode(mode) {
  exMode = mode;
  document.querySelectorAll('.ex-mode-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.mode === mode));
  rebuildActive();
  if (activeSentences.length === 0) activeSentences = [...sentences];
  exIdx = 0; exScore = 0;
  loadSentence();
}

let exIdx = 0, exScore = 0, exAnswered = false;
let exInputMode = 'type';  // 'type' | 'tiles'
let tilePool = [], tileBuilt = [];

function normalize(s) {
  return s.trim().toLowerCase().replace(/[.,!?]/g, '');
}

// ── Hint ──────────────────────────────────────────────────────────────────────

function populateHint(s) {
  const body = document.getElementById('ex-hint-body');
  if (s && !s.stype) {
    const match = defaultSentences.find(d => d.nl === s.nl);
    if (match) s = match;
  }
  if (!s || !s.stype) {
    body.innerHTML = '<em style="color:var(--text-muted);font-size:0.8rem">No hay sugerencia gramatical para esta frase.</em>';
    return;
  }

  const rule = grammarRulesData.find(r => r.stype === s.stype);

  // Pattern + names row
  let html = `
    <div class="hint-header">
      <span class="hint-stype-badge">${s.stype}</span>
      <span class="hint-stype-en">${stypeEN[s.stype] || s.stype}</span>
    </div>`;

  if (s.srule) {
    html += `<div class="hint-rule">${s.srule}</div>`;
  }

  if (rule) {
    // Pattern formula
    html += `<div class="hint-pattern">${rule.pattern}</div>`;

    // Sentence slots — position name only, no explanation
    if (rule.slots && rule.slots.length) {
      html += `<div class="hint-slots">`;
      rule.slots.forEach(sl => {
        html += `<div class="hint-slot hint-slot-${sl.color}">
          <div class="hint-slot-pos">${sl.pos}</div>
          <div class="hint-slot-body">
            <div class="hint-slot-label">${sl.label}</div>
          </div>
        </div>`;
      });
      html += `</div>`;
    }
  }

  body.innerHTML = html;
}

function toggleExHint(btn) {
  const body = document.getElementById('ex-hint-body');
  const open = body.classList.toggle('open');
  btn.querySelector('.ex-hint-arrow').style.transform = open ? 'rotate(180deg)' : '';
}

// ── Input mode ────────────────────────────────────────────────────────────────

function setInputMode(mode) {
  exInputMode = mode;
  document.querySelectorAll('.input-mode-row .ex-mode-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.imode === mode));
  // Show/hide sections
  document.getElementById('type-section').style.display  = (mode === 'type' || mode === 'listen' || mode === 'translate') ? '' : 'none';
  document.getElementById('tile-section').style.display  = mode === 'tiles' ? '' : 'none';
  const fillSection = document.getElementById('fillblank-section');
  if (fillSection) fillSection.style.display = mode === 'fillblank' ? '' : 'none';
  const hintWrap  = document.getElementById('letter-hint-wrap');
  if (hintWrap)   hintWrap.style.display    = (mode === 'type' || mode === 'translate') ? '' : 'none';
  if (!exAnswered) {
    const s = activeSentences[exIdx];
    if (!s) return;
    updatePromptDisplay(s);
    if (mode === 'tiles')     loadTiles(s);
    if (mode === 'fillblank') loadFillBlank(s);
  }
}

// ── Tiles ─────────────────────────────────────────────────────────────────────

function loadTiles(s) {
  tileBuilt = [];
  tilePool  = s.nl.split(' ')
    .map(w => w.replace(/[.,!?]+$/, ''))
    .filter(Boolean)
    .sort(() => Math.random() - 0.5);
  renderTiles();
}

function renderTiles() {
  document.getElementById('tile-built').innerHTML =
    tileBuilt.length
      ? tileBuilt.map((w, i) => `<button class="tile tile-built" onclick="removeTile(${i})">${w}</button>`).join('')
      : '<span class="tile-placeholder">Haz clic en las palabras para construir la frase…</span>';
  document.getElementById('tile-pool').innerHTML =
    tilePool.map((w, i) => `<button class="tile tile-pool" onclick="selectTile(${i})">${w}</button>`).join('');
}

function selectTile(i) {
  if (exAnswered) return;
  tileBuilt.push(tilePool[i]);
  tilePool.splice(i, 1);
  renderTiles();
}

function removeTile(i) {
  if (exAnswered) return;
  tilePool.push(tileBuilt[i]);
  tileBuilt.splice(i, 1);
  renderTiles();
}

function disableTiles() {
  document.querySelectorAll('.tile').forEach(t => t.disabled = true);
}

// ── Sentence loading ──────────────────────────────────────────────────────────

// ── Star / flag functions ──────────────────────────────────────────────────────
let _currentSentenceFilter = 'all';

function _saveFlags() {
  localStorage.setItem(FLAGS_KEY, JSON.stringify(sentenceFlags));
}

function _refreshFlaggedViews() {
  renderSentences(_currentSentenceFilter);
  renderFlagsSection();
}

function _updateStarBtn() {
  const s = activeSentences[exIdx];
  if (!s) return;
  const flag = sentenceFlags[s.nl];
  const btn  = document.getElementById('ex-star-btn');
  const wrap = document.getElementById('ex-comment-wrap');
  const inp  = document.getElementById('ex-comment-input');
  if (!btn) return;
  if (flag?.starred) {
    btn.classList.add('starred');
    wrap.style.display = '';
    inp.value = flag.comment || '';
  } else {
    btn.classList.remove('starred');
    wrap.style.display = 'none';
    inp.value = '';
  }
}

function toggleStarSentence() {
  const s = activeSentences[exIdx];
  if (!s) return;
  if (sentenceFlags[s.nl]?.starred) {
    delete sentenceFlags[s.nl];
  } else {
    sentenceFlags[s.nl] = { starred: true, comment: '' };
  }
  _saveFlags();
  _updateStarBtn();
  _refreshFlaggedViews();
}

function saveStarComment() {
  const s = activeSentences[exIdx];
  if (!s) return;
  const comment = document.getElementById('ex-comment-input').value.trim();
  if (!sentenceFlags[s.nl]) sentenceFlags[s.nl] = { starred: true };
  sentenceFlags[s.nl].comment = comment;
  _saveFlags();
  _refreshFlaggedViews();
  showToast('✓ Opmerking opgeslagen');
}

function deleteStarComment() {
  const s = activeSentences[exIdx];
  if (!s || !sentenceFlags[s.nl]) return;
  sentenceFlags[s.nl].comment = '';
  document.getElementById('ex-comment-input').value = '';
  _saveFlags();
  _refreshFlaggedViews();
  showToast('Opmerking verwijderd');
}

// ── Alle zinnen — inline comment editing ────────────────────────────────────
function openInlineCommentEditor(btn, nl) {
  const row = btn.closest('tr');
  const commentDiv = row.querySelector('.sentence-comment, .sentence-add-comment');
  const current = sentenceFlags[nl]?.comment || '';
  commentDiv.outerHTML = `
    <div class="sentence-comment sentence-comment--editing">
      <textarea class="inline-comment-ta" rows="2">${escapeHtml(current)}</textarea>
      <div class="inline-comment-btns">
        <button class="btn btn-primary btn-sm" onclick="saveInlineComment(${JSON.stringify(nl)}, this)">Opslaan</button>
        <button class="btn btn-secondary btn-sm" onclick="renderSentences(_currentSentenceFilter)">Annuleren</button>
      </div>
    </div>`;
  row.querySelector('.inline-comment-ta').focus();
}

function saveInlineComment(nl, btn) {
  const comment = btn.closest('.sentence-comment--editing').querySelector('textarea').value.trim();
  if (!sentenceFlags[nl]) sentenceFlags[nl] = { starred: true };
  sentenceFlags[nl].comment = comment;
  _saveFlags();
  renderFlagsSection();
  renderSentences(_currentSentenceFilter);
}

function deleteCommentOnly(nl) {
  if (sentenceFlags[nl]) sentenceFlags[nl].comment = '';
  _saveFlags();
  renderFlagsSection();
  renderSentences(_currentSentenceFilter);
}

// ── Bewerken — flags section ─────────────────────────────────────────────────
function renderFlagsSection() {
  const body  = document.getElementById('flags-body');
  const badge = document.getElementById('flags-count-badge');
  if (!body) return;
  const flagged = sentences.filter(s => sentenceFlags[s.nl]?.starred);
  if (badge) badge.textContent = flagged.length + ' gemarkeerd';
  if (flagged.length === 0) {
    body.innerHTML = '<p style="color:var(--text-muted);font-size:0.83rem">Geen vragen gemarkeerd. Gebruik de ⭐ knop tijdens het oefenen om een zin te markeren.</p>';
    return;
  }
  body.innerHTML = flagged.map(s => `
    <div class="flag-item">
      <div class="flag-item-header">
        <span class="badge badge-${s.level.toLowerCase()}">${s.level}</span>
        <span class="flag-nl">${escapeHtml(s.nl)}</span>
        <span class="flag-en">${escapeHtml(s.en)}</span>
      </div>
      <div class="flag-item-comment">
        <textarea class="flag-comment-ta" rows="2" placeholder="Escribe tu pregunta o comentario aquí...">${escapeHtml(sentenceFlags[s.nl]?.comment || '')}</textarea>
        <div class="flag-item-actions">
          <button class="btn btn-primary btn-sm" onclick="saveFlagComment(${JSON.stringify(s.nl)}, this)">Guardar</button>
          <button class="btn btn-secondary btn-sm" onclick="deleteFlagEntry(${JSON.stringify(s.nl)})">Eliminar marca</button>
        </div>
      </div>
    </div>`).join('');
}

function saveFlagComment(nl, btn) {
  const ta = btn.closest('.flag-item').querySelector('.flag-comment-ta');
  if (!sentenceFlags[nl]) sentenceFlags[nl] = { starred: true };
  sentenceFlags[nl].comment = ta.value.trim();
  _saveFlags();
  renderSentences(_currentSentenceFilter);
  showToast('✓ Opmerking opgeslagen');
}

function deleteFlagEntry(nl) {
  delete sentenceFlags[nl];
  _saveFlags();
  renderFlagsSection();
  renderSentences(_currentSentenceFilter);
  showToast('Markering verwijderd');
}

function loadSentence() {
  console.log('loadSentence called, exIdx:', exIdx, 'activeSentences length:', activeSentences.length);
  if (exIdx >= activeSentences.length) { showCongrats(); return; }
  const s = activeSentences[exIdx];
  updatePromptDisplay(s);
  document.getElementById('ex-badge').textContent = s.level;
  document.getElementById('ex-badge').className = 'badge badge-' + s.level.toLowerCase();
  document.getElementById('ex-counter').textContent = (exIdx + 1) + ' / ' + activeSentences.length;
  document.getElementById('ex-progress').style.width = ((exIdx + 1) / activeSentences.length * 100) + '%';
  _updateAccountability();
  // Reset type input
  document.getElementById('ex-input').value = '';
  document.getElementById('ex-input').className = 'exercise-input';
  document.getElementById('ex-input').disabled = false;
  // Reset hint
  const hintBody = document.getElementById('ex-hint-body');
  hintBody.classList.remove('open');
  const hintArrow = document.querySelector('.ex-hint-arrow');
  if (hintArrow) hintArrow.style.transform = '';
  populateHint(s);
  resetLetterHint();
  // Reset check buttons
  document.getElementById('ex-check-btn').style.display       = '';
  document.getElementById('ex-check-btn-tiles').style.display = '';
  const fillCheckBtn = document.getElementById('ex-check-btn-fillblank');
  if (fillCheckBtn) fillCheckBtn.style.display = '';
  document.getElementById('ex-next-btn').style.display = 'none';
  document.getElementById('ex-btn-row').style.display  = '';
  document.getElementById('ex-congrats').classList.remove('show');
  hideFeedback();
  exAnswered = false;
  // Load tiles if in tile mode
  if (exInputMode === 'tiles') loadTiles(s);
  if (exInputMode === 'fillblank') loadFillBlank(s);
  setTimeout(() => { if (exInputMode === 'type' || exInputMode === 'listen' || exInputMode === 'translate') document.getElementById('ex-input').focus(); }, 50);
  _updateStarBtn();
}

function checkAnswer() {
  if (exAnswered) return;
  const s = activeSentences[exIdx];
  let val, correct, correctAnswer;
  if (exInputMode === 'tiles') {
    val = tileBuilt.join(' ');
    correct = normalize(val) === normalize(s.nl);
    correctAnswer = s.nl;
  } else if (exInputMode === 'fillblank') {
    val = document.getElementById('fillblank-input')?.value || '';
    correct = normalize(val) === normalize(blankWord);
    correctAnswer = blankWord;
  } else if (exInputMode === 'translate') {
    val = document.getElementById('ex-input').value;
    correct = normalize(val) === normalize(s.en);
    correctAnswer = s.en;
  } else { // type or listen
    val = document.getElementById('ex-input').value;
    correct = normalize(val) === normalize(s.nl);
    correctAnswer = s.nl;
  }
  exAnswered = true;
  // Visual
  if (exInputMode === 'tiles') {
    disableTiles();
    document.getElementById('ex-check-btn-tiles').style.display = 'none';
  } else if (exInputMode === 'fillblank') {
    const fi = document.getElementById('fillblank-input');
    if (fi) { fi.className = 'exercise-input ' + (correct ? 'correct' : 'incorrect'); fi.disabled = true; }
    const fb = document.getElementById('ex-check-btn-fillblank');
    if (fb) fb.style.display = 'none';
  } else {
    const input = document.getElementById('ex-input');
    input.className = 'exercise-input ' + (correct ? 'correct' : 'incorrect');
    input.disabled = true;
    document.getElementById('ex-check-btn').style.display = 'none';
  }
  document.getElementById('ex-next-btn').style.display = '';
  showFeedback(correct, correctAnswer);
  if (correct) exScore++;
  document.getElementById('ex-score-label').textContent = exScore + ' correcto';
  // Record stats
  if (!sentenceStats[s.nl]) sentenceStats[s.nl] = { c: 0, w: 0 };
  if (correct) sentenceStats[s.nl].c++; else sentenceStats[s.nl].w++;
  localStorage.setItem(STATS_KEY, JSON.stringify(sentenceStats));
  // Auto-save position so refresh resumes here
  _autoSaveIdx();
  // SRS + streak
  updateSRS(s.nl, correct);
  recordPracticeToday();
  // In listen mode: reveal the sentence after answering
  if (exInputMode === 'listen') {
    const prompt = document.getElementById('ex-prompt');
    if (prompt) { prompt.textContent = s.nl; prompt.style.display = ''; }
  }
}

function showFeedback(correct, answer) {
  const box = document.getElementById('ex-feedback');
  if (correct) {
    box.className = 'feedback-box show success';
    box.innerHTML = '✓ ¡Correcto! <span class="answer">' + answer + '</span>';
  } else {
    box.className = 'feedback-box show error';
    box.innerHTML = '✗ Casi. La respuesta correcta: <span class="answer">' + answer + '</span>';
  }
}

function hideFeedback() {
  document.getElementById('ex-feedback').className = 'feedback-box';
}

function nextSentence() { exIdx++; _autoSaveIdx(); loadSentence(); }

function skipSentence() {
  if (!exAnswered) {
    exAnswered = true;
    const s = activeSentences[exIdx];
    let correctAnswer;
    if (exInputMode === 'tiles') {
      disableTiles();
      document.getElementById('ex-check-btn-tiles').style.display = 'none';
      correctAnswer = s.nl;
    } else if (exInputMode === 'fillblank') {
      const fi = document.getElementById('fillblank-input');
      if (fi) fi.disabled = true;
      const fb = document.getElementById('ex-check-btn-fillblank');
      if (fb) fb.style.display = 'none';
      correctAnswer = blankWord;
    } else if (exInputMode === 'translate') {
      document.getElementById('ex-input').disabled = true;
      document.getElementById('ex-check-btn').style.display = 'none';
      correctAnswer = s.en;
    } else {
      document.getElementById('ex-input').disabled = true;
      document.getElementById('ex-check-btn').style.display = 'none';
      correctAnswer = s.nl;
    }
    document.getElementById('ex-next-btn').style.display = '';
    showFeedback(false, correctAnswer);
    if (!sentenceStats[s.nl]) sentenceStats[s.nl] = { c: 0, w: 0 };
    sentenceStats[s.nl].w++;
    localStorage.setItem(STATS_KEY, JSON.stringify(sentenceStats));
  }
}

function showCongrats() {
  document.getElementById('ex-btn-row').style.display = 'none';
  document.getElementById('ex-feedback').className = 'feedback-box';
  const panel = document.getElementById('ex-congrats');
  panel.classList.add('show');
  panel.querySelector('.congrats-sub').textContent =
    '¡Has acertado ' + exScore + ' de ' + activeSentences.length + ' frases!';
  // Show "Next step" button only when a unit is active and there's a next step
  const nextBtn = document.getElementById('ex-congrats-next-btn');
  if (nextBtn) {
    const next = activeUnit ? _nextStepInfo('oefening') : null;
    nextBtn.style.display = next ? '' : 'none';
    if (next) nextBtn.textContent = 'Siguiente: ' + next.label + ' →';
  }
}

function restartExercise() {
  exIdx = 0; exScore = 0;
  // Force full pool (including already-answered) for this session
  activeSentences = _buildPool();
  updateModeLabel();
  loadSentence();
}

function resetStats() {
  if (!confirm('¿Quieres borrar todas las estadísticas?')) return;
  sentenceStats = {};
  localStorage.removeItem(STATS_KEY);
  showToast('Estadísticas borradas');
}

document.getElementById('ex-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (exInputMode === 'type' || exInputMode === 'listen' || exInputMode === 'translate')) { if (!exAnswered) checkAnswer(); else nextSentence(); }
});

document.getElementById('fillblank-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && exInputMode === 'fillblank') { if (!exAnswered) checkAnswer(); else nextSentence(); }
});

// ─── SENTENCE LIST ────────────────────────────────────────────────────────────

const stypeEN = {
  'Statement':        'Statement — Sujeto + Verbo + Objeto',
  'Question':         'Question — Palabra WH / Do/Does + Sujeto + Verbo',
  'Negative':         'Negative — Sujeto + do/does + not + Verbo',
  'Imperative':       'Imperative — Verbo + Objeto (sin sujeto)',
  'There is/are':     'There is/are — se usa para describir existencia',
  'Present simple':   'Present simple — acciones habituales, hechos',
  'Present continuous':'Present continuous — acciones que ocurren ahora',
  'Past simple':      'Past simple — acciones completadas en el pasado',
  'Expression':       'Expresión fija / frase hecha',
};

// ─── STREAK TRACKING ─────────────────────────────────────────────────────────

const STREAK_KEY = 'englishcoach_streak';

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function initStreak() {
  const raw = localStorage.getItem(STREAK_KEY);
  let data = { count: 0, lastDate: '' };
  if (raw) { try { data = JSON.parse(raw); } catch(e) {} }
  const el = document.getElementById('streak-badge');
  if (el) el.textContent = '🔥 ' + data.count;
}

function recordPracticeToday() {
  const today = getTodayStr();
  const raw = localStorage.getItem(STREAK_KEY);
  let data = { count: 0, lastDate: '' };
  if (raw) { try { data = JSON.parse(raw); } catch(e) {} }
  if (data.lastDate === today) return; // already recorded today
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.lastDate === yesterday) {
    data.count++;
  } else if (data.lastDate !== today) {
    data.count = 1;
  }
  data.lastDate = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  const el = document.getElementById('streak-badge');
  if (el) el.textContent = '🔥 ' + data.count;
}

// ─── SPACED REPETITION (SRS) ──────────────────────────────────────────────────

const SRS_KEY = 'englishcoach_srs';
let srsData = {};

function initSRS() {
  const raw = localStorage.getItem(SRS_KEY);
  if (raw) { try { srsData = JSON.parse(raw); } catch(e) {} }
  updateDueBadge();
}

function getDueSentences() {
  const now = new Date().toISOString();
  return sentences.filter(s => {
    const entry = srsData[s.nl];
    if (!entry) return true; // never reviewed
    return entry.nextReview <= now;
  });
}

function updateSRS(nl, correct) {
  if (!srsData[nl]) srsData[nl] = { interval: 1, nextReview: new Date().toISOString() };
  const entry = srsData[nl];
  if (correct) {
    entry.interval = Math.min(entry.interval * 2, 30);
  } else {
    entry.interval = 1;
  }
  const next = new Date(Date.now() + entry.interval * 86400000);
  entry.nextReview = next.toISOString();
  localStorage.setItem(SRS_KEY, JSON.stringify(srsData));
  updateDueBadge();
}

function updateDueBadge() {
  const due = getDueSentences();
  const badge = document.getElementById('due-badge');
  if (!badge) return;
  if (due.length > 0) {
    badge.textContent = due.length;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}


// ─── LETTER HINT ──────────────────────────────────────────────────────────────

let letterHintCount = 0;

function resetLetterHint() {
  letterHintCount = 0;
  const el = document.getElementById('letter-hint-text');
  if (el) { el.textContent = ''; el.classList.remove('visible'); }
}

function showLetterHint() {
  const s = activeSentences[exIdx];
  if (!s || exAnswered) return;
  letterHintCount++;
  const hinted = s.nl.split(' ').map(w => {
    const clean = w.replace(/[.,!?]+$/, '');
    const punct = w.slice(clean.length);
    if (letterHintCount >= clean.length) return w;
    return clean.slice(0, letterHintCount) + '·'.repeat(Math.max(0, clean.length - letterHintCount)) + punct;
  }).join(' ');
  const el = document.getElementById('letter-hint-text');
  if (el) { el.textContent = hinted; el.classList.add('visible'); }
}

// ─── FILL-IN-THE-BLANK ────────────────────────────────────────────────────────

let blankWord = '';

function loadFillBlank(s) {
  const skipWords = new Set(['een','het','dat','van','met','voor','naar','over','maar','want','ook','al','nog','wel']);
  const words = s.nl.split(' ').map(w => w.replace(/[.,!?]+$/, ''));
  const candidates = words.filter(w => w.length >= 4 && !skipWords.has(w.toLowerCase()));
  const pick = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : (words.find(w => w.length >= 3) || words[0]);
  blankWord = pick;
  const sentenceEl = document.getElementById('fillblank-sentence');
  if (sentenceEl) {
    const escaped = s.nl.replace(new RegExp('(?<![a-zA-Z])' + pick.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '(?![a-zA-Z])'), `<span class="fillblank-blank">${'_'.repeat(pick.length)}</span>`);
    sentenceEl.innerHTML = escaped;
  }
  const input = document.getElementById('fillblank-input');
  if (input) { input.value = ''; input.disabled = false; input.className = 'exercise-input'; }
  const btn = document.getElementById('ex-check-btn-fillblank');
  if (btn) btn.style.display = '';
}

// ─── PROMPT DISPLAY ───────────────────────────────────────────────────────────

function updatePromptDisplay(s) {
  const dir    = document.getElementById('ex-direction');
  const prompt = document.getElementById('ex-prompt');
  if (!s || !dir || !prompt) return;
  if (exInputMode === 'translate') {
    dir.textContent    = 'Vertaal naar het Engels';
    prompt.textContent = s.nl;
    prompt.style.display = '';
  } else if (exInputMode === 'listen') {
    dir.textContent      = 'Escribe lo que oyes';
    prompt.style.display = 'none';
  } else {
    dir.textContent    = 'Traduce al inglés';
    prompt.textContent = s.en;
    prompt.style.display = '';
  }

  // Show sentence type badge
  const full = resolveGrammar(s);
  const stypeRow   = document.getElementById('ex-stype-row');
  const stypeBadge = document.getElementById('ex-stype-badge');
  const stypeEn    = document.getElementById('ex-stype-en');
  if (stypeRow && stypeBadge && stypeEn && full.stype) {
    stypeBadge.textContent = full.stype;
    stypeBadge.className = 'stype-badge stype-' + full.stype.toLowerCase().replace(/[^a-z]/g, '-');
    stypeEn.textContent  = stypeEN[full.stype] || '';
    stypeRow.style.display = '';
  } else if (stypeRow) {
    stypeRow.style.display = 'none';
  }
}

// ─── GRAMMAR RULES DATA ───────────────────────────────────────────────────────

const grammarRulesData = [
  {
    stype: 'Statement', en: 'Oración afirmativa',
    pattern: 'Subject → Verb → Object / Complement',
    nlExpl: 'El orden básico en inglés es SVO: Sujeto + Verbo + Objeto. A diferencia del español, el sujeto NUNCA se omite.',
    enExpl: 'Basic English word order is SVO: Subject + Verb + Object. Unlike Spanish, the subject is NEVER omitted.',
    tip: 'En español puedes decir "Trabajo aquí", pero en inglés SIEMPRE: "I work here".',
    conjunctions: [],
    slots: [
      { pos: 'S', color: 'pos1', label: 'Sujeto', en: 'Subject', desc: '¿Quién hace la acción? Siempre obligatorio en inglés.', examples: 'I · You · He · She · They · The cat' },
      { pos: 'V', color: 'pos2', label: 'Verbo', en: 'Verb', desc: 'La acción. En 3ª persona singular: añadir -s/-es.', examples: 'work · works · live · lives · study · studies' },
      { pos: 'O', color: 'posm', label: 'Objeto / Complemento', en: 'Object / Complement', desc: '¿Qué? ¿Dónde? ¿Cuándo?', examples: 'English · in Madrid · every day · a book' },
    ],
    wordOrder: [
      { slot: 'Time', q: '¿Cuándo?', ex: 'today, yesterday, every day, at 9 o\'clock' },
      { slot: 'Place', q: '¿Dónde?', ex: 'at home, in London, to school' },
      { slot: 'Object', q: '¿Qué / quién?', ex: 'a book, English, my friend' },
    ],
  },
  {
    stype: 'Question', en: 'Pregunta (WH / Yes-No)',
    pattern: 'WH-word + do/does + Subject + Verb? — OR — Do/Does + Subject + Verb?',
    nlExpl: 'Para preguntas con WH: empieza con la palabra interrogativa + do/does + sujeto + verbo base. Para preguntas sí/no: do/does + sujeto + verbo base.',
    enExpl: 'WH-questions: WH-word + do/does + subject + base verb. Yes/no questions: Do/Does + subject + base verb.',
    tip: 'Con "be" no necesitas "do": Are you happy? Is she a teacher? — Pero con otros verbos: Do you work? Does he live here?',
    conjunctions: ['what', 'where', 'when', 'why', 'who', 'how', 'which', 'how many', 'how much'],
    slots: [
      { pos: 'WH', color: 'posvw', label: 'Palabra interrogativa', en: 'Question word', desc: 'Solo en preguntas WH. Omitir para sí/no.', examples: 'What · Where · When · Why · Who · How' },
      { pos: 'Aux', color: 'pos2', label: 'Auxiliar', en: 'Auxiliary (do/does/is/are)', desc: 'Do (I/you/we/they), Does (he/she/it), o formas de "be".', examples: 'Do · Does · Is · Are' },
      { pos: 'S', color: 'pos1', label: 'Sujeto', en: 'Subject', desc: 'Viene después del auxiliar.', examples: 'you · he · she · they' },
      { pos: 'V', color: 'posm', label: 'Verbo base', en: 'Base verb', desc: 'Siempre en forma base después de do/does.', examples: 'work · live · speak · eat' },
    ],
    wordOrder: [
      { slot: 'What?', q: 'Cosa / acción', ex: 'What do you eat?' },
      { slot: 'Where?', q: 'Lugar', ex: 'Where do you live?' },
      { slot: 'When?', q: 'Tiempo', ex: 'When does he arrive?' },
      { slot: 'Why?', q: 'Razón', ex: 'Why do you study English?' },
      { slot: 'How?', q: 'Manera', ex: 'How are you?' },
      { slot: 'Yes/No', q: 'Sí o no', ex: 'Do you speak English? Does she work here?' },
    ],
  },
  {
    stype: 'Negative', en: 'Oración negativa',
    pattern: 'Subject + do/does + not + Verb (base form)',
    nlExpl: 'Para negar, usamos do not (don\'t) o does not (doesn\'t) + verbo base. Con "be": sujeto + be + not.',
    enExpl: 'To negate, use do not (don\'t) or does not (doesn\'t) + base verb. With "be": subject + be + not.',
    tip: 'Error común de hispanohablantes: "I no speak" es INCORRECTO. Correcto: "I don\'t speak". Siempre necesitas el auxiliar "do/does" para negar.',
    conjunctions: [],
    slots: [
      { pos: 'S', color: 'pos1', label: 'Sujeto', en: 'Subject', desc: 'Quién realiza la acción.', examples: 'I · You · He · She · We · They' },
      { pos: 'Neg', color: 'pos2', label: 'don\'t / doesn\'t', en: 'Negative auxiliary', desc: 'don\'t (I/you/we/they), doesn\'t (he/she/it).', examples: "don't · doesn't · isn't · aren't" },
      { pos: 'V', color: 'posm', label: 'Verbo base', en: 'Base verb (no -s!)', desc: 'Después de don\'t/doesn\'t, SIEMPRE verbo en forma base.', examples: 'work · live · speak · eat (NOT works/eats!)' },
    ],
    wordOrder: [],
  },
  {
    stype: 'Imperative', en: 'Imperativo',
    pattern: 'Verb (base form) + Object',
    nlExpl: 'El imperativo en inglés es simplemente el verbo en su forma base, sin sujeto. Para negativo: Don\'t + verbo.',
    enExpl: 'The imperative is just the base form of the verb, without a subject. For negative: Don\'t + verb.',
    tip: 'Mucho más simple que en español — no hay conjugación: Open the door. Sit down. Don\'t run!',
    conjunctions: [],
    slots: [
      { pos: 'V', color: 'pos2', label: 'Verbo base', en: 'Base verb', desc: 'Sin sujeto. La forma base del verbo.', examples: 'Open! · Sit! · Listen! · Come!' },
      { pos: 'O', color: 'posm', label: 'Complemento', en: 'Object / complement', desc: 'Opcional: qué, dónde.', examples: 'the door · down · to me · here' },
    ],
    wordOrder: [
      { slot: 'Positivo', q: 'Verbo + objeto', ex: 'Open the door. Sit down. Listen to me.' },
      { slot: 'Negativo', q: "Don't + verbo", ex: "Don't run. Don't worry. Don't be late." },
      { slot: 'Por favor', q: 'Please al inicio o final', ex: 'Please sit down. Come here, please.' },
    ],
  },
  {
    stype: 'There is/are', en: 'Hay (existencia)',
    pattern: 'There + is/are + Object + Place',
    nlExpl: '"There is" (singular) y "there are" (plural) equivalen al "hay" del español. Se usan para hablar de la existencia de algo.',
    enExpl: '"There is" (singular) and "there are" (plural) express existence. Equivalent to Spanish "hay".',
    tip: 'En español "hay" no cambia, pero en inglés SÍ: There IS a cat. There ARE two cats.',
    conjunctions: [],
    slots: [
      { pos: 'T', color: 'posvw', label: 'There', en: 'There (introductory)', desc: 'Siempre empieza con "there".', examples: 'There' },
      { pos: 'V', color: 'pos2', label: 'is / are', en: 'is (singular) / are (plural)', desc: 'Singular = is, Plural = are.', examples: 'is · are' },
      { pos: 'O', color: 'pos1', label: 'Objeto', en: 'Object (what exists)', desc: 'Lo que existe. Determina singular/plural.', examples: 'a cat · two books · some water · many people' },
      { pos: 'P', color: 'posm', label: 'Lugar', en: 'Place', desc: 'Dónde existe.', examples: 'in the room · on the table · near here' },
    ],
    wordOrder: [],
  },
];

// ─── CONJUGATION REFERENCE DATA ───────────────────────────────────────────────

const conjugationData = {
  stemRule: {
    title: 'Paso 1 — La forma base del verbo',
    steps: [
      { nl: 'En inglés, la forma base es el infinitivo sin "to"', en: 'The base form is the infinitive without "to"', ex: 'to work → work, to go → go, to eat → eat' },
      { nl: 'Para la 3ª persona singular (he/she/it) en presente, añade -s o -es', en: 'For 3rd person singular (he/she/it) in present, add -s or -es', ex: 'work → works, go → goes, study → studies' },
      { nl: 'Verbos que terminan en -ch, -sh, -ss, -x, -o → añade -es', en: 'Verbs ending in -ch, -sh, -ss, -x, -o → add -es', ex: 'watch → watches, go → goes, miss → misses' },
      { nl: 'Verbos que terminan en consonante + y → cambia y a -ies', en: 'Verbs ending in consonant + y → change y to -ies', ex: 'study → studies, carry → carries, try → tries' },
    ],
  },
  presentTense: {
    title: 'Presente simple',
    rows: [
      { pronoun: 'I',              rule: '= base form',        tip: 'Siempre la forma base',           ex: 'I work · I go · I eat' },
      { pronoun: 'you',            rule: '= base form',        tip: 'Igual que I',                      ex: 'You work · You live · You study' },
      { pronoun: 'he / she / it',  rule: '= base + s/es',      tip: '¡No olvides la -s!',              ex: 'He works · She goes · It rains' },
      { pronoun: 'we',             rule: '= base form',        tip: 'Igual que I',                      ex: 'We work · We live · We eat' },
      { pronoun: 'you (pl.)',      rule: '= base form',        tip: 'Igual que I',                      ex: 'You all work · You play' },
      { pronoun: 'they',           rule: '= base form',        tip: 'Igual que I',                      ex: 'They work · They live · They eat' },
    ],
    tip: 'Solo he/she/it cambia — el resto usa la forma base. ¡Error #1 de los hispanohablantes: olvidar la -s!',
  },
  kofschip: {
    title: 'Verbos regulares vs irregulares en pasado',
    enTitle: 'Verbos regulares vs irregulares en pasado',
    letters: [],
    rule: 'Verbos regulares: añade -ed a la forma base. Verbos irregulares: hay que memorizarlos.',
    ruleEn: 'Regular verbs: add -ed to the base form. Irregular verbs: must be memorised.',
    examples: [
      { stem: 'work',   last: 'k', inKof: true,  ovt: 'worked',     vtt: 'have worked' },
      { stem: 'play',   last: 'y', inKof: true,  ovt: 'played',     vtt: 'have played' },
      { stem: 'study',  last: 'y', inKof: true,  ovt: 'studied',    vtt: 'have studied' },
      { stem: 'go',     last: 'o', inKof: false, ovt: 'went',       vtt: 'have gone' },
      { stem: 'eat',    last: 't', inKof: false, ovt: 'ate',        vtt: 'have eaten' },
      { stem: 'see',    last: 'e', inKof: false, ovt: 'saw',        vtt: 'have seen' },
    ],
    tipNl: 'Reglas de ortografía para -ed: consonante + y → -ied (studied). Consonante corta → doblar (stopped). Terminado en -e → solo -d (lived).',
    tipEn: 'Spelling rules for -ed: consonant + y → -ied (studied). Short consonant → double (stopped). Ending in -e → just -d (lived).',
  },
  pastTense: {
    title: 'Pasado simple',
    enTitle: 'Pasado simple — verbos regulares e irregulares',
    rows: [
      { pronoun: 'I',              suffix: 'base + -ed / irregular',  ex: 'I worked · I went · I ate' },
      { pronoun: 'you',            suffix: 'base + -ed / irregular',  ex: 'You worked · You went' },
      { pronoun: 'he / she / it',  suffix: 'base + -ed / irregular',  ex: 'He worked · She went · It rained' },
      { pronoun: 'we / you / they', suffix: 'base + -ed / irregular', ex: 'We worked · They went · You ate' },
    ],
    tipNl: 'Buena noticia: en pasado, ¡TODOS los pronombres usan la misma forma! No hay que añadir -s.',
    tipEn: 'Good news: in the past, ALL pronouns use the same form! No need to add -s.',
  },
  perfectTense: {
    title: 'Presente perfecto',
    enTitle: 'have / has + participio pasado',
    formation: [
      { step: '1', nl: 'Usa "have" (I/you/we/they) o "has" (he/she/it)', en: 'Use "have" (I/you/we/they) or "has" (he/she/it)' },
      { step: '2', nl: 'Añade el participio pasado (past participle)', en: 'Add the past participle' },
      { step: '3', nl: 'Regular: base + -ed (worked, played, studied)', en: 'Regular: base + -ed (worked, played, studied)' },
      { step: '4', nl: 'Irregular: hay que memorizarlos (gone, eaten, seen, done)', en: 'Irregular: must be memorised (gone, eaten, seen, done)' },
    ],
    examples: [
      { nl: 'I have worked.',       en: 'He trabajado.',          note: 'have — regular' },
      { nl: 'She has eaten.',       en: 'Ella ha comido.',        note: 'has — irregular' },
      { nl: 'We have gone.',        en: 'Hemos ido.',             note: 'have — irregular' },
      { nl: 'He has seen the film.',en: 'Él ha visto la película.',note: 'has — irregular' },
      { nl: 'They have studied.',   en: 'Ellos han estudiado.',   note: 'have — regular' },
    ],
  },
  modalVerbs: {
    title: 'Verbos modales',
    enTitle: 'can · could · must · should · will · would · may · might',
    rows: [
      { inf: 'can',    en: 'poder (capacidad)',    ik: 'can',    jij: 'can',    hij: 'can',    wij: 'can',    use: 'Capacidad / posibilidad' },
      { inf: 'could',  en: 'podría / sabía',       ik: 'could',  jij: 'could',  hij: 'could',  wij: 'could',  use: 'Posibilidad / pasado de can' },
      { inf: 'must',   en: 'deber (obligación)',    ik: 'must',   jij: 'must',   hij: 'must',   wij: 'must',   use: 'Obligación fuerte' },
      { inf: 'should', en: 'debería (consejo)',     ik: 'should', jij: 'should', hij: 'should', wij: 'should', use: 'Consejo / recomendación' },
      { inf: 'will',   en: 'voluntad / futuro',     ik: 'will',   jij: 'will',   hij: 'will',   wij: 'will',   use: 'Futuro / decisiones' },
      { inf: 'may',    en: 'poder (permiso)',       ik: 'may',    jij: 'may',    hij: 'may',    wij: 'may',    use: 'Permiso formal' },
    ],
    tip: 'Los modales en inglés NUNCA cambian de forma: he CAN (no "cans"), she MUST (no "musts"). Siempre + verbo base.',
    tipEn: 'English modals NEVER change form: he CAN (not "cans"), she MUST (not "musts"). Always + base verb.',
  },
};

const tenseData = [
  {
    name: 'Present simple',
    abbr: 'Pres.',
    en: 'Presente simple',
    color: 'tense-ott',
    structure: 'Subject + base verb (+s for he/she/it)',
    structureEn: 'Sujeto + verbo base (+s para he/she/it)',
    when: [
      { nl: 'Hábitos y rutinas', en: 'Habits and routines' },
      { nl: 'Verdades generales y hechos', en: 'General truths and facts' },
      { nl: 'Horarios y programas fijos', en: 'Schedules and fixed timetables' },
    ],
    examples: [
      { nl: 'I work every day.', en: 'Trabajo todos los días.', note: 'routine' },
      { nl: 'She speaks English.', en: 'Ella habla inglés.', note: 'fact' },
      { nl: 'The train leaves at 8.', en: 'El tren sale a las 8.', note: 'schedule' },
    ],
    tip: '¡Recuerda la -s en 3ª persona! He workS, she goeS, it rainS.',
    tipEn: 'Remember the -s for 3rd person! He workS, she goeS, it rainS.',
    keywords: ['always', 'usually', 'often', 'sometimes', 'never', 'every day'],
  },
  {
    name: 'Present continuous',
    abbr: 'Cont.',
    en: 'Presente continuo',
    color: 'tense-ovt',
    structure: 'Subject + am/is/are + verb-ing',
    structureEn: 'Sujeto + am/is/are + verbo-ing',
    when: [
      { nl: 'Acciones que están ocurriendo ahora mismo', en: 'Actions happening right now' },
      { nl: 'Planes futuros ya organizados', en: 'Future plans already arranged' },
      { nl: 'Situaciones temporales', en: 'Temporary situations' },
    ],
    examples: [
      { nl: 'I am working now.', en: 'Estoy trabajando ahora.', note: 'now' },
      { nl: 'She is reading a book.', en: 'Ella está leyendo un libro.', note: 'now' },
      { nl: 'We are meeting tomorrow.', en: 'Nos reunimos mañana.', note: 'future plan' },
    ],
    tip: 'En español usas "estar + gerundio" — en inglés: be + -ing. Muy parecido.',
    tipEn: 'Spanish uses "estar + gerundio" — English: be + -ing. Very similar concept.',
    keywords: ['now', 'right now', 'at the moment', 'currently', 'today'],
  },
  {
    name: 'Simple past',
    abbr: 'Past',
    en: 'Pasado simple',
    color: 'tense-vtt',
    structure: 'Subject + verb-ed (regular) / irregular form',
    structureEn: 'Sujeto + verbo-ed (regular) / forma irregular',
    when: [
      { nl: 'Acciones completadas en el pasado', en: 'Completed actions in the past' },
      { nl: 'Serie de eventos pasados', en: 'Sequence of past events' },
      { nl: 'Con un momento específico en el pasado', en: 'With a specific past time' },
    ],
    examples: [
      { nl: 'I worked yesterday.', en: 'Trabajé ayer.', note: 'regular -ed' },
      { nl: 'She went to London.', en: 'Ella fue a Londres.', note: 'irregular' },
      { nl: 'They ate dinner at 7.', en: 'Cenaron a las 7.', note: 'irregular' },
    ],
    tip: 'A diferencia del español (6 formas), en inglés el pasado tiene UNA sola forma para todos los pronombres: I went, you went, he went, we went, they went.',
    tipEn: 'Unlike Spanish (6 forms), English past has ONE form for all pronouns: I went, you went, he went, we went, they went.',
    keywords: ['yesterday', 'last week', 'ago', 'in 2020', 'when I was young'],
  },
  {
    name: 'Future with will',
    abbr: 'Fut.',
    en: 'Futuro con will',
    color: 'tense-tt',
    structure: 'Subject + will + base verb',
    structureEn: 'Sujeto + will + verbo base',
    when: [
      { nl: 'Decisiones espontáneas', en: 'Spontaneous decisions' },
      { nl: 'Predicciones y promesas', en: 'Predictions and promises' },
      { nl: 'Ofertas de ayuda', en: 'Offers of help' },
    ],
    examples: [
      { nl: 'I will help you.', en: 'Te ayudaré.', note: 'offer' },
      { nl: 'It will rain tomorrow.', en: 'Lloverá mañana.', note: 'prediction' },
      { nl: "I'll call you later.", en: 'Te llamaré luego.', note: 'spontaneous' },
    ],
    tip: '"Will" NUNCA cambia: I will, he will, they will. Contracción: I\'ll, he\'ll, they\'ll. Negativo: won\'t.',
    tipEn: '"Will" NEVER changes: I will, he will, they will. Contraction: I\'ll, he\'ll, they\'ll. Negative: won\'t.',
    keywords: ['tomorrow', 'next week', 'soon', 'later', 'in the future'],
  },
  {
    name: 'Present perfect',
    abbr: 'Perf.',
    en: 'Presente perfecto',
    color: 'tense-vvt',
    structure: 'Subject + have/has + past participle',
    structureEn: 'Sujeto + have/has + participio pasado',
    when: [
      { nl: 'Experiencias de vida (sin tiempo específico)', en: 'Life experiences (no specific time)' },
      { nl: 'Acciones recientes con resultado actual', en: 'Recent actions with current result' },
      { nl: 'Con ever, never, already, yet, just', en: 'With ever, never, already, yet, just' },
    ],
    examples: [
      { nl: 'I have been to London.', en: 'He estado en Londres.', note: 'experience' },
      { nl: 'She has just arrived.', en: 'Ella acaba de llegar.', note: 'recent' },
      { nl: 'Have you ever eaten sushi?', en: '¿Has comido sushi alguna vez?', note: 'experience' },
    ],
    tip: 'Diferencia clave con español: en inglés NO puedes usar present perfect con "yesterday" o "last week". Esos piden simple past.',
    tipEn: 'Key difference from Spanish: in English you CANNOT use present perfect with "yesterday" or "last week". Those require simple past.',
    keywords: ['ever', 'never', 'already', 'yet', 'just', 'recently', 'so far'],
  },
  {
    name: 'Simple past vs Present perfect',
    abbr: '?',
    en: 'Pasado simple vs Presente perfecto — ¿cuándo usar cuál?',
    color: 'tense-vs',
    structure: 'Past: verb-ed  —vs—  Perfect: have/has + participle',
    structureEn: 'Pasado: verbo-ed  —vs—  Perfecto: have/has + participio',
    when: [
      { nl: 'Simple past: con tiempo específico (yesterday, last week, in 2020)', en: 'Simple past: with specific time (yesterday, last week, in 2020)' },
      { nl: 'Present perfect: sin tiempo específico, experiencia general', en: 'Present perfect: no specific time, general experience' },
      { nl: 'Present perfect: acción reciente con relevancia actual (just, already, yet)', en: 'Present perfect: recent action with current relevance (just, already, yet)' },
    ],
    examples: [
      { nl: 'I went to London last year.', en: 'Fui a Londres el año pasado.', note: 'specific time → past' },
      { nl: 'I have been to London.', en: 'He estado en Londres.', note: 'no time → perfect' },
      { nl: 'She has just left.', en: 'Ella acaba de irse.', note: 'recent → perfect' },
    ],
    tip: '¿Puedes añadir "yesterday" o "last week"? → Simple past. ¿Es una experiencia sin fecha? → Present perfect.',
    tipEn: 'Can you add "yesterday" or "last week"? → Simple past. Is it an experience with no date? → Present perfect.',
    keywords: [],
  },
];

const dehetRules = [
  {
    rule: 'a',
    nlTitle: '"A" — ¿cuándo se usa "a"?',
    enTitle: '"A" — when do you use "a"?',
    items: [
      { nl: 'Antes de palabras que empiezan con sonido de CONSONANTE', en: 'Before words starting with a CONSONANT sound', examples: ['a cat, a dog, a book, a table'] },
      { nl: 'Antes de "u" cuando suena como "yu"', en: 'Before "u" when it sounds like "yu"', examples: ['a university, a uniform, a unit, a useful tool'] },
      { nl: 'Antes de "eu" y "ew"', en: 'Before "eu" and "ew"', examples: ['a European, a ewe'] },
      { nl: 'Antes de "one" (suena "won")', en: 'Before "one" (sounds like "won")', examples: ['a one-way street, a one-year plan'] },
    ],
    tip: { nl: 'Truco: no importa la letra, importa el SONIDO. "University" empieza con sonido /ju/ → a university.', en: 'Trick: it\'s about the SOUND, not the letter. "University" starts with /ju/ → a university.' },
  },
  {
    rule: 'an',
    nlTitle: '"An" — ¿cuándo se usa "an"?',
    enTitle: '"An" — when do you use "an"?',
    items: [
      { nl: 'Antes de palabras que empiezan con sonido de VOCAL (a, e, i, o, u)', en: 'Before words starting with a VOWEL sound (a, e, i, o, u)', examples: ['an apple, an egg, an idea, an orange, an umbrella'] },
      { nl: 'Antes de "h" muda', en: 'Before silent "h"', examples: ['an hour, an honest person, an honour'] },
      { nl: 'Antes de abreviaturas que empiezan con sonido vocal', en: 'Before abbreviations starting with a vowel sound', examples: ['an FBI agent, an MP3 file, an SMS'] },
    ],
    tip: { nl: 'Truco: "an hour" (la h es muda → sonido vocal) pero "a hotel" (la h se pronuncia → sonido consonante).', en: 'Trick: "an hour" (silent h → vowel sound) but "a hotel" (pronounced h → consonant sound).' },
  },
];

const stypeFilterMap = {
  'Statement':          'statement',
  'Present simple':     'tenses',
  'Present continuous': 'tenses',
  'Past simple':        'tenses',
  'Question':           'question',
  'Negative':           'negation',
  'Imperative':         'imperative',
  'There is/are':       'there-is',
  'Expression':         'statement',
};


function _buildA1GrammarRulesHtml() {
  // ── Sentence structure cards ──────────────────────────────────────────────
  const sentenceCards = grammarRulesData.map(rule => {
    const examples = defaultSentences.filter(s => s.stype === rule.stype).slice(0, 3);
    const badgeClass = 'stype-' + rule.stype.toLowerCase().replace(/[^a-z]/g, '-');
    const gfilter = stypeFilterMap[rule.stype] || 'statement';

    const slotsHtml = rule.slots && rule.slots.length ? `
      <div class="grammar-slots-title">🗂 Posiciones en la oración</div>
      <div class="grammar-slots">
        ${rule.slots.map(sl => `
          <div class="grammar-slot grammar-slot-${sl.color}">
            <div class="grammar-slot-pos">${sl.pos}</div>
            <div class="grammar-slot-body">
              <div class="grammar-slot-label">🇪🇸 ${sl.label}</div>
              <!-- English label hidden for beginners -->
              <div class="grammar-slot-desc">${sl.desc}</div>
              <div class="grammar-slot-examples">${sl.examples}</div>
            </div>
          </div>`).join('')}
      </div>` : '';

    const wordOrderHtml = rule.wordOrder && rule.wordOrder.length ? `
      <div class="grammar-slots-title">📋 Reglas adicionales</div>
      <table class="grammar-wo-table">
        ${rule.wordOrder.map(row => `
          <tr>
            <td class="grammar-wo-slot">${row.slot}</td>
            <td class="grammar-wo-q">${row.q}</td>
            <td class="grammar-wo-ex">${row.ex}</td>
          </tr>`).join('')}
      </table>` : '';

    return `
    <div class="grammar-rule-card" data-gfilter="${gfilter}">
      <div class="grammar-rule-header">
        <div>
          <div class="grammar-rule-title">${rule.stype}</div>
          <div class="grammar-rule-subtitle">${rule.en}</div>
        </div>
        <span class="stype-badge ${badgeClass}">${rule.stype.split(' ')[0]}</span>
      </div>
      <div class="grammar-pattern">${rule.pattern}</div>
      <p class="grammar-expl-nl">${rule.nlExpl}</p>
      ${rule.tip ? `<div class="grammar-tip">💡 ${rule.tip}</div>` : ''}
      ${slotsHtml}
      ${wordOrderHtml}
      ${rule.conjunctions.length ? `<div class="grammar-conj">Palabras clave: <strong>${rule.conjunctions.join(', ')}</strong></div>` : ''}
      ${examples.length ? `
        <div class="grammar-examples-title">Ejemplos de los ejercicios:</div>
        ${examples.map(s => `
          <div class="grammar-example-item">
            <div class="grammar-ex-nl">${s.nl}</div>
            <div class="grammar-ex-en">${s.en}</div>
          </div>`).join('')}` : ''}
    </div>`;
  }).join('');

  // ── De/Het section ────────────────────────────────────────────────────────
  const dehetSection = `
    <div class="grammar-dehet-section gt-topic-block" data-gfilter="dehet" data-pill="dehet">
      <div class="grammar-section-title">
        <span>A / An — artículos</span>
        <span class="grammar-section-subtitle">¿Cuándo usar a o an?</span>
      </div>
      <div class="grammar-dehet-grid">
        ${dehetRules.map(block => `
          <div class="grammar-dehet-card grammar-dehet-${block.rule}">
            <div class="grammar-dehet-header">
              <span class="grammar-dehet-badge">${block.rule}</span>
              <div>
                <div class="grammar-dehet-title">${block.nlTitle}</div>
                <!-- English subtitle hidden for beginners -->
              </div>
            </div>
            <ul class="grammar-dehet-list">
              ${block.items.map(item => `
                <li>
                  <div class="grammar-dehet-rule-nl">${item.nl}</div>
                  <!-- English rule hidden for beginners -->
                  <div class="grammar-dehet-examples">${item.examples.join(' · ')}</div>
                </li>`).join('')}
            </ul>
            <div class="grammar-tip" style="margin-top:12px">💡 ${block.tip.nl}</div>
          </div>`).join('')}
      </div>
    </div>`;

  // ── Conjugation section ──────────────────────────────────────────────────
  const cd = conjugationData;

  const stemSteps = cd.stemRule.steps.map((s, i) => `
    <div class="cj-step"><span class="cj-step-num">${i+1}</span>
      <div><div class="cj-step-nl">${s.nl}</div>
           <div class="cj-step-ex">${s.ex}</div></div></div>`).join('');

  const presentRows = cd.presentTense.rows.map(r => `
    <tr><td class="cj-pronoun">${r.pronoun}</td>
        <td class="cj-rule">${r.rule}</td>
        <td class="cj-tip">${r.tip}</td>
        <td class="cj-ex">${r.ex}</td></tr>`).join('');

  const kofLetters = cd.kofschip.letters.map(l =>
    `<span class="kof-letter">${l}</span>`).join('');
  const kofRows = cd.kofschip.examples.map(e => `
    <tr class="${e.inKof ? 'kof-yes' : 'kof-no'}">
      <td class="cj-ex">${e.stem}</td>
      <td class="cj-ex">${e.last}</td>
      <td>${e.inKof ? '<span class="kof-badge kof-badge-yes">Regular ✓</span>' : '<span class="kof-badge kof-badge-no">Irregular</span>'}</td>
      <td class="cj-ex">${e.ovt}</td>
      <td class="cj-ex">${e.vtt}</td>
    </tr>`).join('');

  const pastRows = cd.pastTense.rows.map(r => `
    <tr><td class="cj-pronoun">${r.pronoun}</td>
        <td class="cj-rule">${r.suffix}</td>
        <td class="cj-ex">${r.ex}</td></tr>`).join('');

  const perfSteps = cd.perfectTense.formation.map(s => `
    <div class="cj-step"><span class="cj-step-num">${s.step}</span>
      <div><div class="cj-step-nl">${s.nl}</div></div></div>`).join('');
  const perfExamples = cd.perfectTense.examples.map(e => `
    <div class="cj-perf-ex">
      <span class="cj-perf-nl">${e.nl}</span>
      <span class="cj-perf-en">${e.en}</span>
      <span class="cj-perf-note">${e.note}</span>
    </div>`).join('');

  const modalRows = cd.modalVerbs.rows.map(r => `
    <tr><td class="cj-pronoun">${r.inf}</td>
        <td class="cj-tip">${r.en}</td>
        <td class="cj-ex">${r.ik}</td>
        <td class="cj-ex">${r.jij}</td>
        <td class="cj-ex">${r.hij}</td>
        <td class="cj-ex">${r.wij}</td>
        <td class="cj-rule">${r.use}</td></tr>`).join('');

  const conjugationSection = `
    <div class="grammar-conj-section gt-topic-block" data-gfilter="vervoeging" data-pill="vervoeging">
      <div class="grammar-section-title">
        <span>Conjugación</span>
        <span class="grammar-section-subtitle">Cómo conjugar verbos en inglés</span>
      </div>

      <div class="cj-block">
        <div class="cj-block-title">${cd.stemRule.title}</div>
        ${stemSteps}
      </div>

      <div class="cj-block">
        <div class="cj-block-title">${cd.presentTense.title}</div>
        <table class="cj-table"><thead>
          <tr><th>Pronombre</th><th>Regla</th><th>Nota</th><th>Ejemplo</th></tr>
        </thead><tbody>${presentRows}</tbody></table>
        <div class="cj-tip">💡 ${cd.presentTense.tip}</div>
      </div>

      <div class="cj-block">
        <div class="cj-block-title">${cd.kofschip.title}</div>
        <div class="cj-rule-text">${cd.kofschip.rule}</div>
        <table class="cj-table cj-kof-table"><thead>
          <tr><th>Base</th><th>Tipo</th><th>¿Regular?</th><th>Pasado</th><th>Presente perfecto</th></tr>
        </thead><tbody>${kofRows}</tbody></table>
        <div class="cj-tip">💡 ${cd.kofschip.tipNl}</div>
      </div>

      <div class="cj-block">
        <div class="cj-block-title">${cd.pastTense.title}</div>
        <div class="cj-block-subtitle">${cd.pastTense.title}</div>
        <table class="cj-table"><thead>
          <tr><th>Pronombre</th><th>Forma</th><th>Ejemplo</th></tr>
        </thead><tbody>${pastRows}</tbody></table>
        <div class="cj-tip">💡 ${cd.pastTense.tipNl}</div>
      </div>

      <div class="cj-block">
        <div class="cj-block-title">${cd.perfectTense.title}</div>
        <div class="cj-block-subtitle">${cd.perfectTense.title}</div>
        ${perfSteps}
        <div class="cj-perf-examples">${perfExamples}</div>
      </div>

      <div class="cj-block">
        <div class="cj-block-title">${cd.modalVerbs.title}</div>
        <div class="cj-block-subtitle">${cd.modalVerbs.title}</div>
        <table class="cj-table"><thead>
          <tr><th>Modal</th><th>Significado</th><th>I</th><th>you</th><th>he/she</th><th>we/they</th><th>Uso</th></tr>
        </thead><tbody>${modalRows}</tbody></table>
        <div class="cj-tip">💡 ${cd.modalVerbs.tip}</div>
      </div>
    </div>`;

  // ── Tenses section ───────────────────────────────────────────────────────
  const tenseCards = tenseData.map(t => {
    const whenRows = t.when.map(w => `
      <div class="tense-when-row">
        <span class="tense-when-nl">${w.nl}</span>
      </div>`).join('');

    const exRows = t.examples.map(e => `
      <div class="tense-example">
        <div class="tense-ex-nl">${e.nl}</div>
        <div class="tense-ex-en">${e.en}</div>
        <span class="tense-ex-note">${e.note}</span>
      </div>`).join('');

    const keywords = t.keywords.length
      ? `<div class="tense-keywords">🔑 Palabras clave: <strong>${t.keywords.join(' · ')}</strong></div>` : '';

    return `
      <div class="tense-card ${t.color}">
        <div class="tense-card-header">
          <div>
            <div class="tense-name">${t.name} <span class="tense-abbr">(${t.abbr})</span></div>
            <div class="tense-name-en">${t.en}</div>
          </div>
        </div>
        <div class="tense-structure">
          <div>${t.structure}</div>
          <div class="tense-structure-en">${t.structureEn}</div>
        </div>
        <div class="tense-when-title">¿Cuándo se usa?</div>
        <div class="tense-when-list">${whenRows}</div>
        <div class="tense-when-title" style="margin-top:10px">Ejemplos</div>
        ${exRows}
        ${keywords}
        <div class="tense-tip">💡 ${t.tip}</div>
      </div>`;
  }).join('');

  const tensesSection = `
    <div class="grammar-tenses-section gt-topic-block" data-gfilter="tijden" data-pill="tijden">
      <div class="grammar-section-title">
        <span>Tiempos verbales</span>
        <span class="grammar-section-subtitle">¿Cuándo usar cada tiempo?</span>
      </div>
      <div class="tense-grid">${tenseCards}</div>
    </div>`;

  return `
    <div class="gt-topic-block" data-pill="zinsstructuur">
      <div class="grammar-section-title grammar-struct-title">
        <span>Estructura de la oración</span>
        <span class="grammar-section-subtitle">Orden de palabras en la oración</span>
      </div>
      <div class="grammar-rules-grid-inner">${sentenceCards}</div>
    </div>
    ${dehetSection}
    ${conjugationSection}
    ${tensesSection}`;
}

function renderGrammarContent() {
  const container = document.getElementById('grammar-content');
  if (!container) return;
  const levelMeta = {
    A1: { name:'Principiante', nameEn:'Beginner', color:'#276047' },
    A2: { name:'Elemental', nameEn:'Elementary', color:'#2952A3' },
    B1: { name:'Intermedio', nameEn:'Intermediate', color:'#6B3FA0' },
    B2: { name:'Intermedio alto', nameEn:'Upper-intermediate', color:'#8B4513' },
  };
  container.innerHTML = ['A1','A2','B1','B2'].map(lv => {
    const meta = levelMeta[lv];
    let cards = lv === 'A1' ? _buildA1GrammarRulesHtml() : '';
    if (typeof grammarTopicsData !== 'undefined') {
      cards += grammarTopicsData.filter(t => t.level === lv).map(_renderGtCard).join('');
    }
    if (!cards) return '';
    return `
      <div class="gt-level-section" data-gtlevel="${lv}" style="--lv-color:${meta.color}">
        <div class="gt-level-header">
          <div class="gt-level-header-top">
            <span class="level-badge level-${lv.toLowerCase()}">${lv}</span>
            <span class="gt-level-name">${meta.name}</span>
          </div>
        </div>
        <div class="gt-level-cards">${cards}</div>
      </div>`;
  }).join('');
}


function resolveGrammar(s) {
  if (s.stype) return s;
  return defaultSentences.find(d => d.nl === s.nl) || s;
}

function buildStructureDetail(stype) {
  if (!stype) return '';
  const rule = grammarRulesData.find(r => r.stype === stype);
  if (!rule) return '';

  const slotRows = rule.slots.map((sl, i) => `
    <div class="sd-slot-row">
      <span class="sd-step">${i + 1}.</span>
      <span class="sd-slot-label">${sl.label}</span>
      <span class="sd-slot-desc">${sl.desc}</span>
      <span class="sd-slot-ex">${sl.examples}</span>
    </div>`).join('');

  const woRows = rule.wordOrder.length ? rule.wordOrder.map(row => `
    <div class="sd-wo-row">
      <span class="sd-wo-slot">${row.slot}</span>
      <span class="sd-wo-q">${row.q}</span>
      <span class="sd-wo-ex">${row.ex}</span>
    </div>`).join('') : '';

  return `
    <div class="struct-detail-body">
      <div class="sd-pattern">${rule.pattern}</div>
      ${slotRows}
      ${woRows ? `<div class="sd-wo-section">${woRows}</div>` : ''}
      ${rule.tip ? `<div class="sd-tip">💡 ${rule.tip}</div>` : ''}
    </div>`;
}

function renderSentences(filter) {
  const tbody = document.getElementById('sentence-tbody');
  let list;
  if (filter === 'flagged') list = sentences.filter(s => sentenceFlags[s.nl]?.starred);
  else if (filter === 'all') list = sentences;
  else list = sentences.filter(s => s.level === filter);

  tbody.innerHTML = list.map(raw => {
    const s = resolveGrammar(raw);
    const enRule = s.stype ? (stypeEN[s.stype] || '') : '';
    const st   = sentenceStats[s.nl];
    const flag = sentenceFlags[s.nl];
    const nlJson = JSON.stringify(s.nl);
    const statsHtml = st
      ? `<div class="sentence-stats"><span class="stat-correct">✓ ${st.c}</span><span class="stat-wrong">✗ ${st.w}</span></div>`
      : '';
    let commentHtml = '';
    if (flag?.starred) {
      if (flag.comment) {
        commentHtml = `<div class="sentence-comment">
          <span class="sentence-comment-icon">💬</span>
          <span class="sentence-comment-text">${escapeHtml(flag.comment)}</span>
          <button class="comment-action-btn" onclick="openInlineCommentEditor(this,${nlJson})" title="Bewerken">✏</button>
          <button class="comment-action-btn comment-action-btn--del" onclick="deleteCommentOnly(${nlJson})" title="Eliminar comentario">🗑</button>
        </div>`;
      } else {
        commentHtml = `<div class="sentence-add-comment">
          <button class="add-comment-btn" onclick="openInlineCommentEditor(this,${nlJson})">+ añadir comentario</button>
        </div>`;
      }
    }
    const starCell = flag?.starred
      ? `<td class="star-cell"><span class="zinnen-star starred" title="Pregunta marcada">★</span></td>`
      : `<td class="star-cell"></td>`;
    return `
    <tr class="${st && st.w > st.c ? 'row-has-errors' : ''}${flag?.starred ? ' row-flagged' : ''}">
      ${starCell}
      <td class="sentence-nl">
        ${s.nl}
        ${statsHtml}
        ${commentHtml}
        ${s.srule ? `<div class="sentence-rule">${s.srule}</div>` : ''}
      </td>
      <td class="sentence-en">
        ${s.en}
        ${enRule ? `<div class="sentence-rule">${enRule}</div>` : ''}
      </td>
      <td><span class="badge badge-${s.level.toLowerCase()}">${s.level}</span></td>
      <td>${s.stype ? `<span class="stype-badge stype-${s.stype.toLowerCase().replace(/[^a-z]/g,'-')}">${s.stype}</span>` : ''}</td>
    </tr>`;
  }).join('');

  if (filter === 'flagged' && list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px">No hay frases marcadas — pulsa ⭐ durante la práctica para marcar una pregunta.</td></tr>`;
  }
}

function filterSentences(filter, btn) {
  document.querySelectorAll('#panel-zinnen .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _currentSentenceFilter = filter;
  renderSentences(filter);
}

// ─── VERB PRACTICE ────────────────────────────────────────────────────────────

let currentVerb = 0;

// ─── VERB PRONOUNS & TENSES META ──────────────────────────────────────────────

const verbPronouns = [
  { nl: 'I',               en: 'yo',              fi: 0, pi: 0 },
  { nl: 'you (sg.)',       en: 'tú / usted',      fi: 1, pi: 0 },
  { nl: 'he / she / it',   en: 'él / ella',       fi: 2, pi: 0 },
  { nl: 'we',              en: 'nosotros/as',     fi: 3, pi: 1 },
  { nl: 'you (pl.)',       en: 'ustedes',          fi: 4, pi: 1 },
  { nl: 'they',            en: 'ellos / ellas',    fi: 5, pi: 1 },
];

const verbTenses = [
  { key: 'ott', nl: 'Presente simple',     en: 'Present simple',        abbr: 'Pres.' },
  { key: 'ovt', nl: 'Pasado simple',       en: 'Simple past',           abbr: 'Past' },
  { key: 'vtt', nl: 'Presente perfecto',   en: 'Present perfect',       abbr: 'Perf.' },
  { key: 'tt',  nl: 'Futuro con will',     en: 'Future (will)',         abbr: 'Fut.'  },
  { key: 'vvt', nl: 'Pasado perfecto',     en: 'Past perfect',          abbr: 'Plup.' },
];

function getVerbForm(v, p, tenseKey) {
  // English conjugation: forms[0]=I, [1]=you, [2]=he/she/it, [3]=we, [4]=you(pl), [5]=they
  const haveMap = { 0:'have', 1:'have', 2:'has',  3:'have', 4:'have', 5:'have' };
  const hadMap  = { 0:'had',  1:'had',  2:'had',  3:'had',  4:'had',  5:'had'  };
  const willMap = { 0:'will', 1:'will', 2:'will', 3:'will', 4:'will', 5:'will' };
  switch (tenseKey) {
    case 'ott': return (v.forms || v.present)[p.fi];
    case 'ovt': return v.past?.[0] ?? '—';
    case 'vtt': return haveMap[p.fi] + ' ' + v.participle;
    case 'tt':  return willMap[p.fi] + ' ' + v.inf;
    case 'vvt': return hadMap[p.fi] + ' ' + v.participle;
  }
}

// ── Spanish translations for verb conjugations ──────────────────────────
const _verbSpanish = {
  // ── be ──
  be:    { ott:['soy/estoy','eres/estás','es/está','somos/estamos','sois/estáis','son/están'],
           ovt:['fui/era','fuiste/eras','fue/era','fuimos/éramos','fuisteis/erais','fueron/eran'],
           vtt:['he sido/estado','has sido/estado','ha sido/estado','hemos sido/estado','habéis sido/estado','han sido/estado'],
           tt:['seré/estaré','serás/estarás','será/estará','seremos/estaremos','seréis/estaréis','serán/estarán'],
           vvt:['había sido/estado','habías sido/estado','había sido/estado','habíamos sido/estado','habíais sido/estado','habían sido/estado'] },
  // ── have ──
  have:  { ott:['tengo','tienes','tiene','tenemos','tenéis','tienen'],
           ovt:['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron'],
           vtt:['he tenido','has tenido','ha tenido','hemos tenido','habéis tenido','han tenido'],
           tt:['tendré','tendrás','tendrá','tendremos','tendréis','tendrán'],
           vvt:['había tenido','habías tenido','había tenido','habíamos tenido','habíais tenido','habían tenido'] },
  // ── do ──
  do:    { ott:['hago','haces','hace','hacemos','hacéis','hacen'],
           ovt:['hice','hiciste','hizo','hicimos','hicisteis','hicieron'],
           vtt:['he hecho','has hecho','ha hecho','hemos hecho','habéis hecho','han hecho'],
           tt:['haré','harás','hará','haremos','haréis','harán'],
           vvt:['había hecho','habías hecho','había hecho','habíamos hecho','habíais hecho','habían hecho'] },
  // ── go ──
  go:    { ott:['voy','vas','va','vamos','vais','van'],
           ovt:['fui','fuiste','fue','fuimos','fuisteis','fueron'],
           vtt:['he ido','has ido','ha ido','hemos ido','habéis ido','han ido'],
           tt:['iré','irás','irá','iremos','iréis','irán'],
           vvt:['había ido','habías ido','había ido','habíamos ido','habíais ido','habían ido'] },
  // ── say ──
  say:   { ott:['digo','dices','dice','decimos','decís','dicen'],
           ovt:['dije','dijiste','dijo','dijimos','dijisteis','dijeron'],
           vtt:['he dicho','has dicho','ha dicho','hemos dicho','habéis dicho','han dicho'],
           tt:['diré','dirás','dirá','diremos','diréis','dirán'],
           vvt:['había dicho','habías dicho','había dicho','habíamos dicho','habíais dicho','habían dicho'] },
  // ── get ──
  get:   { ott:['obtengo','obtienes','obtiene','obtenemos','obtenéis','obtienen'],
           ovt:['obtuve','obtuviste','obtuvo','obtuvimos','obtuvisteis','obtuvieron'],
           vtt:['he obtenido','has obtenido','ha obtenido','hemos obtenido','habéis obtenido','han obtenido'],
           tt:['obtendré','obtendrás','obtendrá','obtendremos','obtendréis','obtendrán'],
           vvt:['había obtenido','habías obtenido','había obtenido','habíamos obtenido','habíais obtenido','habían obtenido'] },
  // ── make ──
  make:  { ott:['hago','haces','hace','hacemos','hacéis','hacen'],
           ovt:['hice','hiciste','hizo','hicimos','hicisteis','hicieron'],
           vtt:['he hecho','has hecho','ha hecho','hemos hecho','habéis hecho','han hecho'],
           tt:['haré','harás','hará','haremos','haréis','harán'],
           vvt:['había hecho','habías hecho','había hecho','habíamos hecho','habíais hecho','habían hecho'] },
  // ── know ──
  know:  { ott:['sé/conozco','sabes/conoces','sabe/conoce','sabemos/conocemos','sabéis/conocéis','saben/conocen'],
           ovt:['supe/conocí','supiste/conociste','supo/conoció','supimos/conocimos','supisteis/conocisteis','supieron/conocieron'],
           vtt:['he sabido','has sabido','ha sabido','hemos sabido','habéis sabido','han sabido'],
           tt:['sabré','sabrás','sabrá','sabremos','sabréis','sabrán'],
           vvt:['había sabido','habías sabido','había sabido','habíamos sabido','habíais sabido','habían sabido'] },
  // ── think ──
  think: { ott:['pienso','piensas','piensa','pensamos','pensáis','piensan'],
           ovt:['pensé','pensaste','pensó','pensamos','pensasteis','pensaron'],
           vtt:['he pensado','has pensado','ha pensado','hemos pensado','habéis pensado','han pensado'],
           tt:['pensaré','pensarás','pensará','pensaremos','pensaréis','pensarán'],
           vvt:['había pensado','habías pensado','había pensado','habíamos pensado','habíais pensado','habían pensado'] },
  // ── come ──
  come:  { ott:['vengo','vienes','viene','venimos','venís','vienen'],
           ovt:['vine','viniste','vino','vinimos','vinisteis','vinieron'],
           vtt:['he venido','has venido','ha venido','hemos venido','habéis venido','han venido'],
           tt:['vendré','vendrás','vendrá','vendremos','vendréis','vendrán'],
           vvt:['había venido','habías venido','había venido','habíamos venido','habíais venido','habían venido'] },
  // ── see ──
  see:   { ott:['veo','ves','ve','vemos','veis','ven'],
           ovt:['vi','viste','vio','vimos','visteis','vieron'],
           vtt:['he visto','has visto','ha visto','hemos visto','habéis visto','han visto'],
           tt:['veré','verás','verá','veremos','veréis','verán'],
           vvt:['había visto','habías visto','había visto','habíamos visto','habíais visto','habían visto'] },
  // ── want ──
  want:  { ott:['quiero','quieres','quiere','queremos','queréis','quieren'],
           ovt:['quise','quisiste','quiso','quisimos','quisisteis','quisieron'],
           vtt:['he querido','has querido','ha querido','hemos querido','habéis querido','han querido'],
           tt:['querré','querrás','querrá','querremos','querréis','querrán'],
           vvt:['había querido','habías querido','había querido','habíamos querido','habíais querido','habían querido'] },
  // ── give ──
  give:  { ott:['doy','das','da','damos','dais','dan'],
           ovt:['di','diste','dio','dimos','disteis','dieron'],
           vtt:['he dado','has dado','ha dado','hemos dado','habéis dado','han dado'],
           tt:['daré','darás','dará','daremos','daréis','darán'],
           vvt:['había dado','habías dado','había dado','habíamos dado','habíais dado','habían dado'] },
  // ── eat ──
  eat:   { ott:['como','comes','come','comemos','coméis','comen'],
           ovt:['comí','comiste','comió','comimos','comisteis','comieron'],
           vtt:['he comido','has comido','ha comido','hemos comido','habéis comido','han comido'],
           tt:['comeré','comerás','comerá','comeremos','comeréis','comerán'],
           vvt:['había comido','habías comido','había comido','habíamos comido','habíais comido','habían comido'] },
  // ── drink ──
  drink: { ott:['bebo','bebes','bebe','bebemos','bebéis','beben'],
           ovt:['bebí','bebiste','bebió','bebimos','bebisteis','bebieron'],
           vtt:['he bebido','has bebido','ha bebido','hemos bebido','habéis bebido','han bebido'],
           tt:['beberé','beberás','beberá','beberemos','beberéis','beberán'],
           vvt:['había bebido','habías bebido','había bebido','habíamos bebido','habíais bebido','habían bebido'] },
  // ── speak ──
  speak: { ott:['hablo','hablas','habla','hablamos','habláis','hablan'],
           ovt:['hablé','hablaste','habló','hablamos','hablasteis','hablaron'],
           vtt:['he hablado','has hablado','ha hablado','hemos hablado','habéis hablado','han hablado'],
           tt:['hablaré','hablarás','hablará','hablaremos','hablaréis','hablarán'],
           vvt:['había hablado','habías hablado','había hablado','habíamos hablado','habíais hablado','habían hablado'] },
  // ── read ──
  read:  { ott:['leo','lees','lee','leemos','leéis','leen'],
           ovt:['leí','leíste','leyó','leímos','leísteis','leyeron'],
           vtt:['he leído','has leído','ha leído','hemos leído','habéis leído','han leído'],
           tt:['leeré','leerás','leerá','leeremos','leeréis','leerán'],
           vvt:['había leído','habías leído','había leído','habíamos leído','habíais leído','habían leído'] },
  // ── write ──
  write: { ott:['escribo','escribes','escribe','escribimos','escribís','escriben'],
           ovt:['escribí','escribiste','escribió','escribimos','escribisteis','escribieron'],
           vtt:['he escrito','has escrito','ha escrito','hemos escrito','habéis escrito','han escrito'],
           tt:['escribiré','escribirás','escribirá','escribiremos','escribiréis','escribirán'],
           vvt:['había escrito','habías escrito','había escrito','habíamos escrito','habíais escrito','habían escrito'] },
  // ── take ──
  take:  { ott:['tomo','tomas','toma','tomamos','tomáis','toman'],
           ovt:['tomé','tomaste','tomó','tomamos','tomasteis','tomaron'],
           vtt:['he tomado','has tomado','ha tomado','hemos tomado','habéis tomado','han tomado'],
           tt:['tomaré','tomarás','tomará','tomaremos','tomaréis','tomarán'],
           vvt:['había tomado','habías tomado','había tomado','habíamos tomado','habíais tomado','habían tomado'] },
  // ── buy ──
  buy:   { ott:['compro','compras','compra','compramos','compráis','compran'],
           ovt:['compré','compraste','compró','compramos','comprasteis','compraron'],
           vtt:['he comprado','has comprado','ha comprado','hemos comprado','habéis comprado','han comprado'],
           tt:['compraré','comprarás','comprará','compraremos','compraréis','comprarán'],
           vvt:['había comprado','habías comprado','había comprado','habíamos comprado','habíais comprado','habían comprado'] },
  // ── feel ──
  feel:  { ott:['siento','sientes','siente','sentimos','sentís','sienten'],
           ovt:['sentí','sentiste','sintió','sentimos','sentisteis','sintieron'],
           vtt:['he sentido','has sentido','ha sentido','hemos sentido','habéis sentido','han sentido'],
           tt:['sentiré','sentirás','sentirá','sentiremos','sentiréis','sentirán'],
           vvt:['había sentido','habías sentido','había sentido','habíamos sentido','habíais sentido','habían sentido'] },
  // ── modals ──
  can:   { ott:['puedo','puedes','puede','podemos','podéis','pueden'],
           ovt:['pude/podía','pudiste/podías','pudo/podía','pudimos/podíamos','pudisteis/podíais','pudieron/podían'],
           vtt:['he podido','has podido','ha podido','hemos podido','habéis podido','han podido'],
           tt:['podré','podrás','podrá','podremos','podréis','podrán'],
           vvt:['había podido','habías podido','había podido','habíamos podido','habíais podido','habían podido'] },
  could: { ott:['podría','podrías','podría','podríamos','podríais','podrían'],
           ovt:['—','—','—','—','—','—'], vtt:['—','—','—','—','—','—'],
           tt:['—','—','—','—','—','—'], vvt:['—','—','—','—','—','—'] },
  must:  { ott:['debo','debes','debe','debemos','debéis','deben'],
           ovt:['—','—','—','—','—','—'], vtt:['—','—','—','—','—','—'],
           tt:['—','—','—','—','—','—'], vvt:['—','—','—','—','—','—'] },
  should:{ ott:['debería','deberías','debería','deberíamos','deberíais','deberían'],
           ovt:['—','—','—','—','—','—'], vtt:['—','—','—','—','—','—'],
           tt:['—','—','—','—','—','—'], vvt:['—','—','—','—','—','—'] },
  will:  { ott:['—','—','—','—','—','—'],
           ovt:['—','—','—','—','—','—'], vtt:['—','—','—','—','—','—'],
           tt:['haré/iré','harás/irás','hará/irá','haremos/iremos','haréis/iréis','harán/irán'],
           vvt:['—','—','—','—','—','—'] },
  would: { ott:['haría/iría','harías/irías','haría/iría','haríamos/iríamos','haríais/iríais','harían/irían'],
           ovt:['—','—','—','—','—','—'], vtt:['—','—','—','—','—','—'],
           tt:['—','—','—','—','—','—'], vvt:['—','—','—','—','—','—'] },
  may:   { ott:['puedo (permiso)','puedes','puede','podemos','podéis','pueden'],
           ovt:['—','—','—','—','—','—'], vtt:['—','—','—','—','—','—'],
           tt:['—','—','—','—','—','—'], vvt:['—','—','—','—','—','—'] },
  might: { ott:['podría (posibilidad)','podrías','podría','podríamos','podríais','podrían'],
           ovt:['—','—','—','—','—','—'], vtt:['—','—','—','—','—','—'],
           tt:['—','—','—','—','—','—'], vvt:['—','—','—','—','—','—'] },
  // ── regular verbs ──
  work:  { ott:['trabajo','trabajas','trabaja','trabajamos','trabajáis','trabajan'],
           ovt:['trabajé','trabajaste','trabajó','trabajamos','trabajasteis','trabajaron'],
           vtt:['he trabajado','has trabajado','ha trabajado','hemos trabajado','habéis trabajado','han trabajado'],
           tt:['trabajaré','trabajarás','trabajará','trabajaremos','trabajaréis','trabajarán'],
           vvt:['había trabajado','habías trabajado','había trabajado','habíamos trabajado','habíais trabajado','habían trabajado'] },
  study: { ott:['estudio','estudias','estudia','estudiamos','estudiáis','estudian'],
           ovt:['estudié','estudiaste','estudió','estudiamos','estudiasteis','estudiaron'],
           vtt:['he estudiado','has estudiado','ha estudiado','hemos estudiado','habéis estudiado','han estudiado'],
           tt:['estudiaré','estudiarás','estudiará','estudiaremos','estudiaréis','estudiarán'],
           vvt:['había estudiado','habías estudiado','había estudiado','habíamos estudiado','habíais estudiado','habían estudiado'] },
  live:  { ott:['vivo','vives','vive','vivimos','vivís','viven'],
           ovt:['viví','viviste','vivió','vivimos','vivisteis','vivieron'],
           vtt:['he vivido','has vivido','ha vivido','hemos vivido','habéis vivido','han vivido'],
           tt:['viviré','vivirás','vivirá','viviremos','viviréis','vivirán'],
           vvt:['había vivido','habías vivido','había vivido','habíamos vivido','habíais vivido','habían vivido'] },
  listen:{ ott:['escucho','escuchas','escucha','escuchamos','escucháis','escuchan'],
           ovt:['escuché','escuchaste','escuchó','escuchamos','escuchasteis','escucharon'],
           vtt:['he escuchado','has escuchado','ha escuchado','hemos escuchado','habéis escuchado','han escuchado'],
           tt:['escucharé','escucharás','escuchará','escucharemos','escucharéis','escucharán'],
           vvt:['había escuchado','habías escuchado','había escuchado','habíamos escuchado','habíais escuchado','habían escuchado'] },
  watch: { ott:['miro','miras','mira','miramos','miráis','miran'],
           ovt:['miré','miraste','miró','miramos','mirasteis','miraron'],
           vtt:['he mirado','has mirado','ha mirado','hemos mirado','habéis mirado','han mirado'],
           tt:['miraré','mirarás','mirará','miraremos','miraréis','mirarán'],
           vvt:['había mirado','habías mirado','había mirado','habíamos mirado','habíais mirado','habían mirado'] },
  play:  { ott:['juego','juegas','juega','jugamos','jugáis','juegan'],
           ovt:['jugué','jugaste','jugó','jugamos','jugasteis','jugaron'],
           vtt:['he jugado','has jugado','ha jugado','hemos jugado','habéis jugado','han jugado'],
           tt:['jugaré','jugarás','jugará','jugaremos','jugaréis','jugarán'],
           vvt:['había jugado','habías jugado','había jugado','habíamos jugado','habíais jugado','habían jugado'] },
  cook:  { ott:['cocino','cocinas','cocina','cocinamos','cocináis','cocinan'],
           ovt:['cociné','cocinaste','cocinó','cocinamos','cocinasteis','cocinaron'],
           vtt:['he cocinado','has cocinado','ha cocinado','hemos cocinado','habéis cocinado','han cocinado'],
           tt:['cocinaré','cocinarás','cocinará','cocinaremos','cocinaréis','cocinarán'],
           vvt:['había cocinado','habías cocinado','había cocinado','habíamos cocinado','habíais cocinado','habían cocinado'] },
  walk:  { ott:['camino','caminas','camina','caminamos','camináis','caminan'],
           ovt:['caminé','caminaste','caminó','caminamos','caminasteis','caminaron'],
           vtt:['he caminado','has caminado','ha caminado','hemos caminado','habéis caminado','han caminado'],
           tt:['caminaré','caminarás','caminará','caminaremos','caminaréis','caminarán'],
           vvt:['había caminado','habías caminado','había caminado','habíamos caminado','habíais caminado','habían caminado'] },
  travel:{ ott:['viajo','viajas','viaja','viajamos','viajáis','viajan'],
           ovt:['viajé','viajaste','viajó','viajamos','viajasteis','viajaron'],
           vtt:['he viajado','has viajado','ha viajado','hemos viajado','habéis viajado','han viajado'],
           tt:['viajaré','viajarás','viajará','viajaremos','viajaréis','viajarán'],
           vvt:['había viajado','habías viajado','había viajado','habíamos viajado','habíais viajado','habían viajado'] },
  learn: { ott:['aprendo','aprendes','aprende','aprendemos','aprendéis','aprenden'],
           ovt:['aprendí','aprendiste','aprendió','aprendimos','aprendisteis','aprendieron'],
           vtt:['he aprendido','has aprendido','ha aprendido','hemos aprendido','habéis aprendido','han aprendido'],
           tt:['aprenderé','aprenderás','aprenderá','aprenderemos','aprenderéis','aprenderán'],
           vvt:['había aprendido','habías aprendido','había aprendido','habíamos aprendido','habíais aprendido','habían aprendido'] },
  help:  { ott:['ayudo','ayudas','ayuda','ayudamos','ayudáis','ayudan'],
           ovt:['ayudé','ayudaste','ayudó','ayudamos','ayudasteis','ayudaron'],
           vtt:['he ayudado','has ayudado','ha ayudado','hemos ayudado','habéis ayudado','han ayudado'],
           tt:['ayudaré','ayudarás','ayudará','ayudaremos','ayudaréis','ayudarán'],
           vvt:['había ayudado','habías ayudado','había ayudado','habíamos ayudado','habíais ayudado','habían ayudado'] },
  love:  { ott:['amo','amas','ama','amamos','amáis','aman'],
           ovt:['amé','amaste','amó','amamos','amasteis','amaron'],
           vtt:['he amado','has amado','ha amado','hemos amado','habéis amado','han amado'],
           tt:['amaré','amarás','amará','amaremos','amaréis','amarán'],
           vvt:['había amado','habías amado','había amado','habíamos amado','habíais amado','habían amado'] },
  like:  { ott:['me gusta','te gusta','le gusta','nos gusta','os gusta','les gusta'],
           ovt:['me gustó','te gustó','le gustó','nos gustó','os gustó','les gustó'],
           vtt:['me ha gustado','te ha gustado','le ha gustado','nos ha gustado','os ha gustado','les ha gustado'],
           tt:['me gustará','te gustará','le gustará','nos gustará','os gustará','les gustará'],
           vvt:['me había gustado','te había gustado','le había gustado','nos había gustado','os había gustado','les había gustado'] },
  need:  { ott:['necesito','necesitas','necesita','necesitamos','necesitáis','necesitan'],
           ovt:['necesité','necesitaste','necesitó','necesitamos','necesitasteis','necesitaron'],
           vtt:['he necesitado','has necesitado','ha necesitado','hemos necesitado','habéis necesitado','han necesitado'],
           tt:['necesitaré','necesitarás','necesitará','necesitaremos','necesitaréis','necesitarán'],
           vvt:['había necesitado','habías necesitado','había necesitado','habíamos necesitado','habíais necesitado','habían necesitado'] },
  call:  { ott:['llamo','llamas','llama','llamamos','llamáis','llaman'],
           ovt:['llamé','llamaste','llamó','llamamos','llamasteis','llamaron'],
           vtt:['he llamado','has llamado','ha llamado','hemos llamado','habéis llamado','han llamado'],
           tt:['llamaré','llamarás','llamará','llamaremos','llamaréis','llamarán'],
           vvt:['había llamado','habías llamado','había llamado','habíamos llamado','habíais llamado','habían llamado'] },
  open:  { ott:['abro','abres','abre','abrimos','abrís','abren'],
           ovt:['abrí','abriste','abrió','abrimos','abristeis','abrieron'],
           vtt:['he abierto','has abierto','ha abierto','hemos abierto','habéis abierto','han abierto'],
           tt:['abriré','abrirás','abrirá','abriremos','abriréis','abrirán'],
           vvt:['había abierto','habías abierto','había abierto','habíamos abierto','habíais abierto','habían abierto'] },
  close: { ott:['cierro','cierras','cierra','cerramos','cerráis','cierran'],
           ovt:['cerré','cerraste','cerró','cerramos','cerrasteis','cerraron'],
           vtt:['he cerrado','has cerrado','ha cerrado','hemos cerrado','habéis cerrado','han cerrado'],
           tt:['cerraré','cerrarás','cerrará','cerraremos','cerraréis','cerrarán'],
           vvt:['había cerrado','habías cerrado','había cerrado','habíamos cerrado','habíais cerrado','habían cerrado'] },
  clean: { ott:['limpio','limpias','limpia','limpiamos','limpiáis','limpian'],
           ovt:['limpié','limpiaste','limpió','limpiamos','limpiasteis','limpiaron'],
           vtt:['he limpiado','has limpiado','ha limpiado','hemos limpiado','habéis limpiado','han limpiado'],
           tt:['limpiaré','limpiarás','limpiará','limpiaremos','limpiaréis','limpiarán'],
           vvt:['había limpiado','habías limpiado','había limpiado','habíamos limpiado','habíais limpiado','habían limpiado'] },
  wash:  { ott:['lavo','lavas','lava','lavamos','laváis','lavan'],
           ovt:['lavé','lavaste','lavó','lavamos','lavasteis','lavaron'],
           vtt:['he lavado','has lavado','ha lavado','hemos lavado','habéis lavado','han lavado'],
           tt:['lavaré','lavarás','lavará','lavaremos','lavaréis','lavarán'],
           vvt:['había lavado','habías lavado','había lavado','habíamos lavado','habíais lavado','habían lavado'] },
  talk:  { ott:['hablo','hablas','habla','hablamos','habláis','hablan'],
           ovt:['hablé','hablaste','habló','hablamos','hablasteis','hablaron'],
           vtt:['he hablado','has hablado','ha hablado','hemos hablado','habéis hablado','han hablado'],
           tt:['hablaré','hablarás','hablará','hablaremos','hablaréis','hablarán'],
           vvt:['había hablado','habías hablado','había hablado','habíamos hablado','habíais hablado','habían hablado'] },
  use:   { ott:['uso','usas','usa','usamos','usáis','usan'],
           ovt:['usé','usaste','usó','usamos','usasteis','usaron'],
           vtt:['he usado','has usado','ha usado','hemos usado','habéis usado','han usado'],
           tt:['usaré','usarás','usará','usaremos','usaréis','usarán'],
           vvt:['había usado','habías usado','había usado','habíamos usado','habíais usado','habían usado'] },
  start: { ott:['empiezo','empiezas','empieza','empezamos','empezáis','empiezan'],
           ovt:['empecé','empezaste','empezó','empezamos','empezasteis','empezaron'],
           vtt:['he empezado','has empezado','ha empezado','hemos empezado','habéis empezado','han empezado'],
           tt:['empezaré','empezarás','empezará','empezaremos','empezaréis','empezarán'],
           vvt:['había empezado','habías empezado','había empezado','habíamos empezado','habíais empezado','habían empezado'] },
  finish:{ ott:['termino','terminas','termina','terminamos','termináis','terminan'],
           ovt:['terminé','terminaste','terminó','terminamos','terminasteis','terminaron'],
           vtt:['he terminado','has terminado','ha terminado','hemos terminado','habéis terminado','han terminado'],
           tt:['terminaré','terminarás','terminará','terminaremos','terminaréis','terminarán'],
           vvt:['había terminado','habías terminado','había terminado','habíamos terminado','habíais terminado','habían terminado'] },
  wait:  { ott:['espero','esperas','espera','esperamos','esperáis','esperan'],
           ovt:['esperé','esperaste','esperó','esperamos','esperasteis','esperaron'],
           vtt:['he esperado','has esperado','ha esperado','hemos esperado','habéis esperado','han esperado'],
           tt:['esperaré','esperarás','esperará','esperaremos','esperaréis','esperarán'],
           vvt:['había esperado','habías esperado','había esperado','habíamos esperado','habíais esperado','habían esperado'] },
  ask:   { ott:['pregunto','preguntas','pregunta','preguntamos','preguntáis','preguntan'],
           ovt:['pregunté','preguntaste','preguntó','preguntamos','preguntasteis','preguntaron'],
           vtt:['he preguntado','has preguntado','ha preguntado','hemos preguntado','habéis preguntado','han preguntado'],
           tt:['preguntaré','preguntarás','preguntará','preguntaremos','preguntaréis','preguntarán'],
           vvt:['había preguntado','habías preguntado','había preguntado','habíamos preguntado','habíais preguntado','habían preguntado'] },
  answer:{ ott:['respondo','respondes','responde','respondemos','respondéis','responden'],
           ovt:['respondí','respondiste','respondió','respondimos','respondisteis','respondieron'],
           vtt:['he respondido','has respondido','ha respondido','hemos respondido','habéis respondido','han respondido'],
           tt:['responderé','responderás','responderá','responderemos','responderéis','responderán'],
           vvt:['había respondido','habías respondido','había respondido','habíamos respondido','habíais respondido','habían respondido'] },
  change:{ ott:['cambio','cambias','cambia','cambiamos','cambiáis','cambian'],
           ovt:['cambié','cambiaste','cambió','cambiamos','cambiasteis','cambiaron'],
           vtt:['he cambiado','has cambiado','ha cambiado','hemos cambiado','habéis cambiado','han cambiado'],
           tt:['cambiaré','cambiarás','cambiará','cambiaremos','cambiaréis','cambiarán'],
           vvt:['había cambiado','habías cambiado','había cambiado','habíamos cambiado','habíais cambiado','habían cambiado'] },
  dance: { ott:['bailo','bailas','baila','bailamos','bailáis','bailan'],
           ovt:['bailé','bailaste','bailó','bailamos','bailasteis','bailaron'],
           vtt:['he bailado','has bailado','ha bailado','hemos bailado','habéis bailado','han bailado'],
           tt:['bailaré','bailarás','bailará','bailaremos','bailaréis','bailarán'],
           vvt:['había bailado','habías bailado','había bailado','habíamos bailado','habíais bailado','habían bailado'] },
  visit: { ott:['visito','visitas','visita','visitamos','visitáis','visitan'],
           ovt:['visité','visitaste','visitó','visitamos','visitasteis','visitaron'],
           vtt:['he visitado','has visitado','ha visitado','hemos visitado','habéis visitado','han visitado'],
           tt:['visitaré','visitarás','visitará','visitaremos','visitaréis','visitarán'],
           vvt:['había visitado','habías visitado','había visitado','habíamos visitado','habíais visitado','habían visitado'] },
  arrive:{ ott:['llego','llegas','llega','llegamos','llegáis','llegan'],
           ovt:['llegué','llegaste','llegó','llegamos','llegasteis','llegaron'],
           vtt:['he llegado','has llegado','ha llegado','hemos llegado','habéis llegado','han llegado'],
           tt:['llegaré','llegarás','llegará','llegaremos','llegaréis','llegarán'],
           vvt:['había llegado','habías llegado','había llegado','habíamos llegado','habíais llegado','habían llegado'] },
  look:  { ott:['miro','miras','mira','miramos','miráis','miran'],
           ovt:['miré','miraste','miró','miramos','mirasteis','miraron'],
           vtt:['he mirado','has mirado','ha mirado','hemos mirado','habéis mirado','han mirado'],
           tt:['miraré','mirarás','mirará','miraremos','miraréis','mirarán'],
           vvt:['había mirado','habías mirado','había mirado','habíamos mirado','habíais mirado','habían mirado'] },
  turn:  { ott:['giro','giras','gira','giramos','giráis','giran'],
           ovt:['giré','giraste','giró','giramos','girasteis','giraron'],
           vtt:['he girado','has girado','ha girado','hemos girado','habéis girado','han girado'],
           tt:['giraré','girarás','girará','giraremos','giraréis','girarán'],
           vvt:['había girado','habías girado','había girado','habíamos girado','habíais girado','habían girado'] },
  show:  { ott:['muestro','muestras','muestra','mostramos','mostráis','muestran'],
           ovt:['mostré','mostraste','mostró','mostramos','mostrasteis','mostraron'],
           vtt:['he mostrado','has mostrado','ha mostrado','hemos mostrado','habéis mostrado','han mostrado'],
           tt:['mostraré','mostrarás','mostrará','mostraremos','mostraréis','mostrarán'],
           vvt:['había mostrado','habías mostrado','había mostrado','habíamos mostrado','habíais mostrado','habían mostrado'] },
  // ── additional irregular verbs ──
  run:   { ott:['corro','corres','corre','corremos','corréis','corren'],
           ovt:['corrí','corriste','corrió','corrimos','corristeis','corrieron'],
           vtt:['he corrido','has corrido','ha corrido','hemos corrido','habéis corrido','han corrido'],
           tt:['correré','correrás','correrá','correremos','correréis','correrán'],
           vvt:['había corrido','habías corrido','había corrido','habíamos corrido','habíais corrido','habían corrido'] },
  sit:   { ott:['me siento','te sientas','se sienta','nos sentamos','os sentáis','se sientan'],
           ovt:['me senté','te sentaste','se sentó','nos sentamos','os sentasteis','se sentaron'],
           vtt:['me he sentado','te has sentado','se ha sentado','nos hemos sentado','os habéis sentado','se han sentado'],
           tt:['me sentaré','te sentarás','se sentará','nos sentaremos','os sentaréis','se sentarán'],
           vvt:['me había sentado','te habías sentado','se había sentado','nos habíamos sentado','os habíais sentado','se habían sentado'] },
  sleep: { ott:['duermo','duermes','duerme','dormimos','dormís','duermen'],
           ovt:['dormí','dormiste','durmió','dormimos','dormisteis','durmieron'],
           vtt:['he dormido','has dormido','ha dormido','hemos dormido','habéis dormido','han dormido'],
           tt:['dormiré','dormirás','dormirá','dormiremos','dormiréis','dormirán'],
           vvt:['había dormido','habías dormido','había dormido','habíamos dormido','habíais dormido','habían dormido'] },
  swim:  { ott:['nado','nadas','nada','nadamos','nadáis','nadan'],
           ovt:['nadé','nadaste','nadó','nadamos','nadasteis','nadaron'],
           vtt:['he nadado','has nadado','ha nadado','hemos nadado','habéis nadado','han nadado'],
           tt:['nadaré','nadarás','nadará','nadaremos','nadaréis','nadarán'],
           vvt:['había nadado','habías nadado','había nadado','habíamos nadado','habíais nadado','habían nadado'] },
  drive: { ott:['conduzco','conduces','conduce','conducimos','conducís','conducen'],
           ovt:['conduje','condujiste','condujo','condujimos','condujisteis','condujeron'],
           vtt:['he conducido','has conducido','ha conducido','hemos conducido','habéis conducido','han conducido'],
           tt:['conduciré','conducirás','conducirá','conduciremos','conduciréis','conducirán'],
           vvt:['había conducido','habías conducido','había conducido','habíamos conducido','habíais conducido','habían conducido'] },
  fly:   { ott:['vuelo','vuelas','vuela','volamos','voláis','vuelan'],
           ovt:['volé','volaste','voló','volamos','volasteis','volaron'],
           vtt:['he volado','has volado','ha volado','hemos volado','habéis volado','han volado'],
           tt:['volaré','volarás','volará','volaremos','volaréis','volarán'],
           vvt:['había volado','habías volado','había volado','habíamos volado','habíais volado','habían volado'] },
  sing:  { ott:['canto','cantas','canta','cantamos','cantáis','cantan'],
           ovt:['canté','cantaste','cantó','cantamos','cantasteis','cantaron'],
           vtt:['he cantado','has cantado','ha cantado','hemos cantado','habéis cantado','han cantado'],
           tt:['cantaré','cantarás','cantará','cantaremos','cantaréis','cantarán'],
           vvt:['había cantado','habías cantado','había cantado','habíamos cantado','habíais cantado','habían cantado'] },
  put:   { ott:['pongo','pones','pone','ponemos','ponéis','ponen'],
           ovt:['puse','pusiste','puso','pusimos','pusisteis','pusieron'],
           vtt:['he puesto','has puesto','ha puesto','hemos puesto','habéis puesto','han puesto'],
           tt:['pondré','pondrás','pondrá','pondremos','pondréis','pondrán'],
           vvt:['había puesto','habías puesto','había puesto','habíamos puesto','habíais puesto','habían puesto'] },
  tell:  { ott:['digo','dices','dice','decimos','decís','dicen'],
           ovt:['dije','dijiste','dijo','dijimos','dijisteis','dijeron'],
           vtt:['he dicho','has dicho','ha dicho','hemos dicho','habéis dicho','han dicho'],
           tt:['diré','dirás','dirá','diremos','diréis','dirán'],
           vvt:['había dicho','habías dicho','había dicho','habíamos dicho','habíais dicho','habían dicho'] },
  find:  { ott:['encuentro','encuentras','encuentra','encontramos','encontráis','encuentran'],
           ovt:['encontré','encontraste','encontró','encontramos','encontrasteis','encontraron'],
           vtt:['he encontrado','has encontrado','ha encontrado','hemos encontrado','habéis encontrado','han encontrado'],
           tt:['encontraré','encontrarás','encontrará','encontraremos','encontraréis','encontrarán'],
           vvt:['había encontrado','habías encontrado','había encontrado','habíamos encontrado','habíais encontrado','habían encontrado'] },
  leave: { ott:['salgo','sales','sale','salimos','salís','salen'],
           ovt:['salí','saliste','salió','salimos','salisteis','salieron'],
           vtt:['he salido','has salido','ha salido','hemos salido','habéis salido','han salido'],
           tt:['saldré','saldrás','saldrá','saldremos','saldréis','saldrán'],
           vvt:['había salido','habías salido','había salido','habíamos salido','habíais salido','habían salido'] },
  meet:  { ott:['conozco','conoces','conoce','conocemos','conocéis','conocen'],
           ovt:['conocí','conociste','conoció','conocimos','conocisteis','conocieron'],
           vtt:['he conocido','has conocido','ha conocido','hemos conocido','habéis conocido','han conocido'],
           tt:['conoceré','conocerás','conocerá','conoceremos','conoceréis','conocerán'],
           vvt:['había conocido','habías conocido','había conocido','habíamos conocido','habíais conocido','habían conocido'] },
  send:  { ott:['envío','envías','envía','enviamos','enviáis','envían'],
           ovt:['envié','enviaste','envió','enviamos','enviasteis','enviaron'],
           vtt:['he enviado','has enviado','ha enviado','hemos enviado','habéis enviado','han enviado'],
           tt:['enviaré','enviarás','enviará','enviaremos','enviaréis','enviarán'],
           vvt:['había enviado','habías enviado','había enviado','habíamos enviado','habíais enviado','habían enviado'] },
  bring: { ott:['traigo','traes','trae','traemos','traéis','traen'],
           ovt:['traje','trajiste','trajo','trajimos','trajisteis','trajeron'],
           vtt:['he traído','has traído','ha traído','hemos traído','habéis traído','han traído'],
           tt:['traeré','traerás','traerá','traeremos','traeréis','traerán'],
           vvt:['había traído','habías traído','había traído','habíamos traído','habíais traído','habían traído'] },
  teach: { ott:['enseño','enseñas','enseña','enseñamos','enseñáis','enseñan'],
           ovt:['enseñé','enseñaste','enseñó','enseñamos','enseñasteis','enseñaron'],
           vtt:['he enseñado','has enseñado','ha enseñado','hemos enseñado','habéis enseñado','han enseñado'],
           tt:['enseñaré','enseñarás','enseñará','enseñaremos','enseñaréis','enseñarán'],
           vvt:['había enseñado','habías enseñado','había enseñado','habíamos enseñado','habíais enseñado','habían enseñado'] },
  understand:{ ott:['entiendo','entiendes','entiende','entendemos','entendéis','entienden'],
           ovt:['entendí','entendiste','entendió','entendimos','entendisteis','entendieron'],
           vtt:['he entendido','has entendido','ha entendido','hemos entendido','habéis entendido','han entendido'],
           tt:['entenderé','entenderás','entenderá','entenderemos','entenderéis','entenderán'],
           vvt:['había entendido','habías entendido','había entendido','habíamos entendido','habíais entendido','habían entendido'] },
  forget:{ ott:['olvido','olvidas','olvida','olvidamos','olvidáis','olvidan'],
           ovt:['olvidé','olvidaste','olvidó','olvidamos','olvidasteis','olvidaron'],
           vtt:['he olvidado','has olvidado','ha olvidado','hemos olvidado','habéis olvidado','han olvidado'],
           tt:['olvidaré','olvidarás','olvidará','olvidaremos','olvidaréis','olvidarán'],
           vvt:['había olvidado','habías olvidado','había olvidado','habíamos olvidado','habíais olvidado','habían olvidado'] },
  begin: { ott:['empiezo','empiezas','empieza','empezamos','empezáis','empiezan'],
           ovt:['empecé','empezaste','empezó','empezamos','empezasteis','empezaron'],
           vtt:['he empezado','has empezado','ha empezado','hemos empezado','habéis empezado','han empezado'],
           tt:['empezaré','empezarás','empezará','empezaremos','empezaréis','empezarán'],
           vvt:['había empezado','habías empezado','había empezado','habíamos empezado','habíais empezado','habían empezado'] },
  stand: { ott:['estoy de pie','estás de pie','está de pie','estamos de pie','estáis de pie','están de pie'],
           ovt:['estuve de pie','estuviste de pie','estuvo de pie','estuvimos de pie','estuvisteis de pie','estuvieron de pie'],
           vtt:['he estado de pie','has estado de pie','ha estado de pie','hemos estado de pie','habéis estado de pie','han estado de pie'],
           tt:['estaré de pie','estarás de pie','estará de pie','estaremos de pie','estaréis de pie','estarán de pie'],
           vvt:['había estado de pie','habías estado de pie','había estado de pie','habíamos estado de pie','habíais estado de pie','habían estado de pie'] },
  lose:  { ott:['pierdo','pierdes','pierde','perdemos','perdéis','pierden'],
           ovt:['perdí','perdiste','perdió','perdimos','perdisteis','perdieron'],
           vtt:['he perdido','has perdido','ha perdido','hemos perdido','habéis perdido','han perdido'],
           tt:['perderé','perderás','perderá','perderemos','perderéis','perderán'],
           vvt:['había perdido','habías perdido','había perdido','habíamos perdido','habíais perdido','habían perdido'] },
  win:   { ott:['gano','ganas','gana','ganamos','ganáis','ganan'],
           ovt:['gané','ganaste','ganó','ganamos','ganasteis','ganaron'],
           vtt:['he ganado','has ganado','ha ganado','hemos ganado','habéis ganado','han ganado'],
           tt:['ganaré','ganarás','ganará','ganaremos','ganaréis','ganarán'],
           vvt:['había ganado','habías ganado','había ganado','habíamos ganado','habíais ganado','habían ganado'] },
  wear:  { ott:['llevo puesto','llevas puesto','lleva puesto','llevamos puesto','lleváis puesto','llevan puesto'],
           ovt:['llevé puesto','llevaste puesto','llevó puesto','llevamos puesto','llevasteis puesto','llevaron puesto'],
           vtt:['he llevado puesto','has llevado puesto','ha llevado puesto','hemos llevado puesto','habéis llevado puesto','han llevado puesto'],
           tt:['llevaré puesto','llevarás puesto','llevará puesto','llevaremos puesto','llevaréis puesto','llevarán puesto'],
           vvt:['había llevado puesto','habías llevado puesto','había llevado puesto','habíamos llevado puesto','habíais llevado puesto','habían llevado puesto'] },
  grow:  { ott:['crezco','creces','crece','crecemos','crecéis','crecen'],
           ovt:['crecí','creciste','creció','crecimos','crecisteis','crecieron'],
           vtt:['he crecido','has crecido','ha crecido','hemos crecido','habéis crecido','han crecido'],
           tt:['creceré','crecerás','crecerá','creceremos','creceréis','crecerán'],
           vvt:['había crecido','habías crecido','había crecido','habíamos crecido','habíais crecido','habían crecido'] },
  keep:  { ott:['guardo','guardas','guarda','guardamos','guardáis','guardan'],
           ovt:['guardé','guardaste','guardó','guardamos','guardasteis','guardaron'],
           vtt:['he guardado','has guardado','ha guardado','hemos guardado','habéis guardado','han guardado'],
           tt:['guardaré','guardarás','guardará','guardaremos','guardaréis','guardarán'],
           vvt:['había guardado','habías guardado','había guardado','habíamos guardado','habíais guardado','habían guardado'] },
  spend: { ott:['gasto','gastas','gasta','gastamos','gastáis','gastan'],
           ovt:['gasté','gastaste','gastó','gastamos','gastasteis','gastaron'],
           vtt:['he gastado','has gastado','ha gastado','hemos gastado','habéis gastado','han gastado'],
           tt:['gastaré','gastarás','gastará','gastaremos','gastaréis','gastarán'],
           vvt:['había gastado','habías gastado','había gastado','habíamos gastado','habíais gastado','habían gastado'] },
  cut:   { ott:['corto','cortas','corta','cortamos','cortáis','cortan'],
           ovt:['corté','cortaste','cortó','cortamos','cortasteis','cortaron'],
           vtt:['he cortado','has cortado','ha cortado','hemos cortado','habéis cortado','han cortado'],
           tt:['cortaré','cortarás','cortará','cortaremos','cortaréis','cortarán'],
           vvt:['había cortado','habías cortado','había cortado','habíamos cortado','habíais cortado','habían cortado'] },
  catch: { ott:['atrapo','atrapas','atrapa','atrapamos','atrapáis','atrapan'],
           ovt:['atrapé','atrapaste','atrapó','atrapamos','atrapasteis','atraparon'],
           vtt:['he atrapado','has atrapado','ha atrapado','hemos atrapado','habéis atrapado','han atrapado'],
           tt:['atraparé','atraparás','atrapará','atraparemos','atraparéis','atraparán'],
           vvt:['había atrapado','habías atrapado','había atrapado','habíamos atrapado','habíais atrapado','habían atrapado'] },
  fall:  { ott:['caigo','caes','cae','caemos','caéis','caen'],
           ovt:['caí','caíste','cayó','caímos','caísteis','cayeron'],
           vtt:['he caído','has caído','ha caído','hemos caído','habéis caído','han caído'],
           tt:['caeré','caerás','caerá','caeremos','caeréis','caerán'],
           vvt:['había caído','habías caído','había caído','habíamos caído','habíais caído','habían caído'] },
  break: { ott:['rompo','rompes','rompe','rompemos','rompéis','rompen'],
           ovt:['rompí','rompiste','rompió','rompimos','rompisteis','rompieron'],
           vtt:['he roto','has roto','ha roto','hemos roto','habéis roto','han roto'],
           tt:['romperé','romperás','romperá','romperemos','romperéis','romperán'],
           vvt:['había roto','habías roto','había roto','habíamos roto','habíais roto','habían roto'] },
  choose:{ ott:['elijo','eliges','elige','elegimos','elegís','eligen'],
           ovt:['elegí','elegiste','eligió','elegimos','elegisteis','eligieron'],
           vtt:['he elegido','has elegido','ha elegido','hemos elegido','habéis elegido','han elegido'],
           tt:['elegiré','elegirás','elegirá','elegiremos','elegiréis','elegirán'],
           vvt:['había elegido','habías elegido','había elegido','habíamos elegido','habíais elegido','habían elegido'] },
  draw:  { ott:['dibujo','dibujas','dibuja','dibujamos','dibujáis','dibujan'],
           ovt:['dibujé','dibujaste','dibujó','dibujamos','dibujasteis','dibujaron'],
           vtt:['he dibujado','has dibujado','ha dibujado','hemos dibujado','habéis dibujado','han dibujado'],
           tt:['dibujaré','dibujarás','dibujará','dibujaremos','dibujaréis','dibujarán'],
           vvt:['había dibujado','habías dibujado','había dibujado','habíamos dibujado','habíais dibujado','habían dibujado'] },
  build: { ott:['construyo','construyes','construye','construimos','construís','construyen'],
           ovt:['construí','construiste','construyó','construimos','construisteis','construyeron'],
           vtt:['he construido','has construido','ha construido','hemos construido','habéis construido','han construido'],
           tt:['construiré','construirás','construirá','construiremos','construiréis','construirán'],
           vvt:['había construido','habías construido','había construido','habíamos construido','habíais construido','habían construido'] },
  hear:  { ott:['oigo','oyes','oye','oímos','oís','oyen'],
           ovt:['oí','oíste','oyó','oímos','oísteis','oyeron'],
           vtt:['he oído','has oído','ha oído','hemos oído','habéis oído','han oído'],
           tt:['oiré','oirás','oirá','oiremos','oiréis','oirán'],
           vvt:['había oído','habías oído','había oído','habíamos oído','habíais oído','habían oído'] },
  set:   { ott:['pongo','pones','pone','ponemos','ponéis','ponen'],
           ovt:['puse','pusiste','puso','pusimos','pusisteis','pusieron'],
           vtt:['he puesto','has puesto','ha puesto','hemos puesto','habéis puesto','han puesto'],
           tt:['pondré','pondrás','pondrá','pondremos','pondréis','pondrán'],
           vvt:['había puesto','habías puesto','había puesto','habíamos puesto','habíais puesto','habían puesto'] },
  pay:   { ott:['pago','pagas','paga','pagamos','pagáis','pagan'],
           ovt:['pagué','pagaste','pagó','pagamos','pagasteis','pagaron'],
           vtt:['he pagado','has pagado','ha pagado','hemos pagado','habéis pagado','han pagado'],
           tt:['pagaré','pagarás','pagará','pagaremos','pagaréis','pagarán'],
           vvt:['había pagado','habías pagado','había pagado','habíamos pagado','habíais pagado','habían pagado'] },
  let:   { ott:['dejo','dejas','deja','dejamos','dejáis','dejan'],
           ovt:['dejé','dejaste','dejó','dejamos','dejasteis','dejaron'],
           vtt:['he dejado','has dejado','ha dejado','hemos dejado','habéis dejado','han dejado'],
           tt:['dejaré','dejarás','dejará','dejaremos','dejaréis','dejarán'],
           vvt:['había dejado','habías dejado','había dejado','habíamos dejado','habíais dejado','habían dejado'] },
  hold:  { ott:['sostengo','sostienes','sostiene','sostenemos','sostenéis','sostienen'],
           ovt:['sostuve','sostuviste','sostuvo','sostuvimos','sostuvisteis','sostuvieron'],
           vtt:['he sostenido','has sostenido','ha sostenido','hemos sostenido','habéis sostenido','han sostenido'],
           tt:['sostendré','sostendrás','sostendrá','sostendremos','sostendréis','sostendrán'],
           vvt:['había sostenido','habías sostenido','había sostenido','habíamos sostenido','habíais sostenido','habían sostenido'] },
  try:   { ott:['intento','intentas','intenta','intentamos','intentáis','intentan'],
           ovt:['intenté','intentaste','intentó','intentamos','intentasteis','intentaron'],
           vtt:['he intentado','has intentado','ha intentado','hemos intentado','habéis intentado','han intentado'],
           tt:['intentaré','intentarás','intentará','intentaremos','intentaréis','intentarán'],
           vvt:['había intentado','habías intentado','había intentado','habíamos intentado','habíais intentado','habían intentado'] },
};

function _getSpanishForm(v, pIdx, tenseKey) {
  const sp = _verbSpanish[v.inf];
  if (sp && sp[tenseKey]) return sp[tenseKey][pIdx];
  return '';
}

// ─── CONJUGATION TABLE ────────────────────────────────────────────────────────

function renderConjTable(v) {
  const auxHeb = v.aux === 'hebben';
  const _vt = v.vtype || _verbType(v);
  const vtypeLabel = { regular:'Regular', irregular:'Irregular', modal:'Modal', phrasal:'Verbo frasal' }[_vt] || _vt || '';
  const vtypeClass = { regular:'vref-regular', irregular:'vref-irregular', modal:'vref-modal', phrasal:'vref-modal' }[_vt] || '';

  // In English, verbs only change for he/she/it in present simple (and have→has in perfect).
  // Show simplified rows: I/you/we/they vs he/she/it
  const simplifiedRows = [
    { label: 'I / you / we / they', labelEs: 'yo / tú / nosotros / ellos', fi: 0 },
    { label: 'he / she / it',       labelEs: 'él / ella',                   fi: 2 },
  ];

  const bodyRows = simplifiedRows.map(row => `
    <tr>
      <td class="ct-pronoun">${row.label}<span class="ct-pronoun-en">${row.labelEs}</span></td>
      ${verbTenses.map(t => {
        const p = { fi: row.fi };
        const eng = getVerbForm(v, p, t.key);
        const spa = _getSpanishForm(v, row.fi, t.key);
        return `<td class="ct-cell">${eng}${spa ? `<div class="ct-spanish">${spa}</div>` : ''}</td>`;
      }).join('')}
    </tr>`).join('');

  document.getElementById('conjtool-table').innerHTML = `
    <div class="ct-header">
      <span class="vref-type ${vtypeClass}">${vtypeLabel}</span>
      <span class="ct-participle">Participio: <strong>${v.participle}</strong></span>
    </div>
    <div class="ct-table-wrap">
      <table class="ct-table">
        <thead><tr>
          <th class="ct-th-pronoun">Persona</th>
          ${verbTenses.map(t => `<th>${t.nl}<br><span class="ct-th-en">${t.en}</span></th>`).join('')}
        </tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>`;
}

// ─── TENSE QUICK REFERENCE ────────────────────────────────────────────────────

function renderTenseQuickRef() {
  const el = document.getElementById('tense-quick-ref');
  if (!el) return;
  el.innerHTML = tenseData.map(t => `
    <div class="tqr-row">
      <div class="tqr-name ${t.color}-border">
        <span class="tqr-abbr">${t.abbr}</span>
        <span class="tqr-nl">${t.name}</span>
        <span class="tqr-en">${t.en}</span>
      </div>
      <div class="tqr-when">
        ${t.when.map(w => `<div class="tqr-when-item"><span class="tqr-nl-text">${w.nl}</span></div>`).join('')}
        ${t.keywords.length ? `<div class="tqr-keywords">🔑 ${t.keywords.join(' · ')}</div>` : ''}
      </div>
    </div>`).join('');
}

// ─── VERB EXERCISE — ALL TENSES ───────────────────────────────────────────────

let vexCorrect = 0, vexWrong = 0;
let vexTenseIdx = 0;
let vexMode = 'type'; // 'type' | 'select'

function jumpToTense(ti) {
  vexTenseIdx = ti;
  loadVerbExercise();
}

function repeatCurrentTense() {
  loadVerbExercise();
}

function setVexMode(mode) {
  vexMode = mode;
  loadVerbExercise();
}

function vexDistractors(v, p, tenseKey, count) {
  const correct = getVerbForm(v, p, tenseKey).toLowerCase();
  const pool = new Set();
  // other verbs, same tense+pronoun
  verbs.forEach(ov => {
    if (ov.inf === v.inf) return;
    const f = getVerbForm(ov, p, tenseKey);
    if (f && f !== '—' && f.toLowerCase() !== correct) pool.add(f);
  });
  // other tenses of same verb
  verbTenses.forEach(t => {
    if (t.key === tenseKey) return;
    const f = getVerbForm(v, p, t.key);
    if (f && f !== '—' && f.toLowerCase() !== correct) pool.add(f);
  });
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

function renderVexProgress() {
  const pct = Math.round((vexTenseIdx / verbTenses.length) * 100);
  return `
    <div class="vex-progress">
      <div class="vex-progress-steps">
        ${verbTenses.map((t, ti) => `
          <button class="vex-tense-step ${ti < vexTenseIdx ? 'done' : ti === vexTenseIdx ? 'active tense-' + t.key : ''}"
                  onclick="jumpToTense(${ti})" title="${t.nl} · ${t.en}">${t.abbr}</button>
          ${ti < verbTenses.length - 1 ? '<span class="vex-step-arrow">›</span>' : ''}`).join('')}
        <button class="vex-repeat-btn" onclick="repeatCurrentTense()">↺ Repetir</button>
      </div>
      <div class="vex-progress-bar-wrap">
        <div class="vex-progress-bar-fill" style="width:${pct}%"></div>
      </div>
    </div>`;
}

function loadVerbExercise() {
  const v  = verbs[currentVerb];
  const t  = verbTenses[vexTenseIdx];

  // Simplified rows: in English verbs only change for he/she/it in present simple
  const exRows = [
    { label: 'I',             labelEs: 'yo',             fi: 0 },
    { label: 'you',           labelEs: 'tú / usted',     fi: 1 },
    { label: 'he / she / it', labelEs: 'él / ella',      fi: 2 },
    { label: 'we',            labelEs: 'nosotros/as',    fi: 3 },
    { label: 'they',          labelEs: 'ellos / ellas',  fi: 5 },
  ];

  const tableRows = exRows.map((row, pi) => {
    const p = { fi: row.fi };
    const correct = getVerbForm(v, p, t.key);
    const spa = _getSpanishForm(v, row.fi, t.key);
    const spHint = spa ? `<div class="ct-spanish" style="margin-top:4px">${spa}</div>` : '';
    if (vexMode === 'select') {
      const distractors = vexDistractors(v, p, t.key, 3);
      const opts = [correct, ...distractors].sort(() => Math.random() - 0.5);
      const optBtns = opts.map(o =>
        `<button class="vex-opt-btn" data-correct="${correct}" data-pi="${pi}"
                 onclick="vexSelectOption(this)">${o}</button>`).join('');
      return `<tr>
        <td class="vex-tbl-pronoun">${row.label}<span class="vex-tbl-pronoun-en">${row.labelEs}</span></td>
        <td class="vex-tbl-cell"><div class="vex-opts" id="vex-opts-${pi}">${optBtns}</div>${spHint}</td>
      </tr>`;
    } else {
      return `<tr>
        <td class="vex-tbl-pronoun">${row.label}<span class="vex-tbl-pronoun-en">${row.labelEs}</span></td>
        <td class="vex-tbl-cell">
          <input class="conj-input vex-tbl-input" data-correct="${correct}" data-pi="${pi}"
                 placeholder="..." autocomplete="off"
                 onkeydown="if(event.key==='Enter'){ this.closest('table').querySelectorAll('.vex-tbl-input').forEach(i=>i===this&&i.blur()); checkVerbTable(); }" />
          ${spHint}
        </td>
      </tr>`;
    }
  }).join('');

  document.getElementById('verb-ex-content').innerHTML = `
    ${renderVexProgress()}
    <div class="vex-mode-toggle">
      <button class="vex-mode-btn ${vexMode==='type'?'active':''}" onclick="setVexMode('type')">✏️ Escribir</button>
      <button class="vex-mode-btn ${vexMode==='select'?'active':''}" onclick="setVexMode('select')">☰ Elegir</button>
    </div>
    <div class="vex-tense-badge tense-${t.key}" style="margin-bottom:12px">
      ${t.nl} — ${t.en} (${t.abbr})
    </div>
    <table class="vex-table" id="vex-table">
      <thead><tr>
        <th class="vex-th-pronoun">Persona</th>
        <th>${v.inf} <span style="font-weight:400;font-size:0.8em;color:var(--text-muted)">— ${v.meaning}</span></th>
      </tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="vex-actions" style="margin-top:12px">
      ${vexMode === 'type' ? `<button class="btn btn-primary" onclick="checkVerbTable()">Comprobar</button>` : ''}
      <button class="btn btn-secondary" onclick="showVerbTableAnswers()">Mostrar respuestas</button>
      <button class="btn btn-secondary" onclick="jumpToTense(${(vexTenseIdx+1) % verbTenses.length})">Siguiente tiempo →</button>
    </div>
    <div id="vex-feedback"></div>`;

  if (vexMode === 'type') document.querySelector('.vex-tbl-input')?.focus();
}

function checkVerbTable() {
  let correct = 0, wrong = 0;
  document.querySelectorAll('.vex-tbl-input').forEach(inp => {
    const ok = inp.value.trim().toLowerCase() === inp.dataset.correct.toLowerCase();
    inp.className = 'conj-input vex-tbl-input ' + (inp.value.trim() ? (ok ? 'correct' : 'incorrect') : '');
    if (inp.value.trim()) { ok ? correct++ : wrong++; }
  });
  vexCorrect += correct; vexWrong += wrong;
  document.getElementById('vex-correct').textContent = '✓ ' + vexCorrect;
  document.getElementById('vex-wrong').textContent   = '✗ ' + vexWrong;

  // reveal correct answers for wrong ones
  document.querySelectorAll('.vex-tbl-input.incorrect').forEach(inp => {
    inp.title = 'Correct: ' + inp.dataset.correct;
    const hint = document.createElement('div');
    hint.className = 'vex-inline-hint';
    hint.textContent = inp.dataset.correct;
    inp.after(hint);
  });
}

function showVerbTableAnswers() {
  if (vexMode === 'type') {
    document.querySelectorAll('.vex-tbl-input').forEach(inp => {
      inp.value = inp.dataset.correct;
      inp.className = 'conj-input vex-tbl-input correct';
    });
  } else {
    document.querySelectorAll('.vex-opt-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === btn.dataset.correct) btn.classList.add('opt-correct');
    });
  }
}

function vexSelectOption(btn) {
  const pi = btn.dataset.pi;
  const correct = btn.dataset.correct;
  const container = document.getElementById('vex-opts-' + pi);
  container.querySelectorAll('.vex-opt-btn').forEach(b => b.disabled = true);
  const ok = btn.textContent === correct;
  btn.classList.add(ok ? 'opt-correct' : 'opt-wrong');
  if (!ok) container.querySelectorAll('.vex-opt-btn').forEach(b => {
    if (b.textContent === correct) b.classList.add('opt-correct');
  });
  if (ok) vexCorrect++; else vexWrong++;
  document.getElementById('vex-correct').textContent = '✓ ' + vexCorrect;
  document.getElementById('vex-wrong').textContent   = '✗ ' + vexWrong;
}

// ─── VERB SELECTOR ────────────────────────────────────────────────────────────

const MODAL_INFS = new Set(['can','could','must','should','will','would','may','might','shall']);
let verbTypeFilter = 'all';

const VERB_GROUP_LABELS = {
  modal:         'Verbos modales',
  irregular:     'Verbos irregulares',
  regular:       'Verbos regulares',
  phrasal:       'Verbos frasales',
};
const VERB_GROUP_ORDER = ['modal','irregular','regular','phrasal'];

function _verbType(v) { return MODAL_INFS.has(v.inf) ? 'modal' : (v.vtype || 'regular'); }

function renderVerbSelector() {
  // Update total badge in card header
  const badge = document.getElementById('verb-total-badge');
  if (badge) badge.textContent = verbs.length + ' verbos';

  const counts = { modal:0, irregular:0, regular:0, separable:0, reflexive:0 };
  verbs.forEach(v => { const t = _verbType(v); if (counts[t] !== undefined) counts[t]++; });

  const wrap = document.getElementById('verb-selector');
  wrap.innerHTML = `
    <input class="verb-search-input" id="verb-search" type="text"
      placeholder="Buscar verbo… ej. go, hacer" oninput="_filterVerbs()" autocomplete="off">
    <div class="verb-type-filters" id="verb-type-filters">
      <button class="filter-btn active" onclick="setVerbTypeFilter('all',this)">Todos <span class="vf-count">${verbs.length}</span></button>
      <button class="filter-btn" onclick="setVerbTypeFilter('modal',this)">Modales <span class="vf-count">${counts.modal}</span></button>
      <button class="filter-btn" onclick="setVerbTypeFilter('irregular',this)">Irregulares <span class="vf-count">${counts.irregular}</span></button>
      <button class="filter-btn" onclick="setVerbTypeFilter('regular',this)">Regulares <span class="vf-count">${counts.regular}</span></button>
    </div>
    <div id="verb-list"></div>
  `;
  _filterVerbs();
}

function setVerbTypeFilter(type, btn) {
  verbTypeFilter = type;
  document.querySelectorAll('#verb-type-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _filterVerbs();
}

function _filterVerbs() {
  const list = document.getElementById('verb-list');
  if (!list) return;
  const query = (document.getElementById('verb-search')?.value || '').toLowerCase().trim();

  const filtered = verbs.reduce((acc, v, i) => {
    const typeMatch = verbTypeFilter === 'all' || _verbType(v) === verbTypeFilter;
    const searchMatch = !query || v.inf.includes(query) || v.meaning.toLowerCase().includes(query);
    if (typeMatch && searchMatch) acc.push({ v, i });
    return acc;
  }, []);

  if (!filtered.length) {
    list.innerHTML = '<div class="verb-no-results">No se encontraron verbos.</div>';
    return;
  }

  const groups = {};
  filtered.forEach(({ v, i }) => {
    const t = _verbType(v);
    (groups[t] = groups[t] || []).push({ v, i });
  });

  const showHeaders = verbTypeFilter === 'all' || query;
  let html = '';
  VERB_GROUP_ORDER.forEach(type => {
    if (!groups[type]) return;
    if (showHeaders) {
      html += `<div class="verb-group-header">${VERB_GROUP_LABELS[type]}<span class="verb-group-count">${groups[type].length}</span></div>`;
    }
    html += `<div class="verb-chips-group">`;
    groups[type].forEach(({ v, i }) => {
      html += `<button class="verb-chip${i === currentVerb ? ' active' : ''}" onclick="selectVerb(${i},this)">
        <span class="verb-chip-inf">${v.inf}</span>
        <span class="verb-chip-en">${v.meaning}</span>
      </button>`;
    });
    html += `</div>`;
  });
  list.innerHTML = html;
}

function selectVerb(i, btn) {
  currentVerb = i;
  document.querySelectorAll('.verb-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('verb-study-card').style.display  = 'none';
  document.getElementById('verb-ex-card').style.display     = 'none';
  document.getElementById('verb-choice-card').style.display = '';
  document.getElementById('verb-choice-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showVerbStudy() {
  const v = verbs[currentVerb];
  document.getElementById('verb-study-title').textContent   = v.inf;
  document.getElementById('verb-study-meaning').textContent = v.meaning;
  document.getElementById('verb-study-card').style.display  = '';
  document.getElementById('verb-ex-card').style.display     = 'none';
  renderConjTable(v);
  renderTenseQuickRef();
  document.getElementById('verb-study-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showVerbExercise() {
  document.getElementById('verb-ex-card').style.display    = '';
  document.getElementById('verb-study-card').style.display = 'none';
  vexCorrect = 0; vexWrong = 0; vexTenseIdx = 0; vexPronounIdx = 0;
  document.getElementById('vex-correct').textContent = '✓ 0';
  document.getElementById('vex-wrong').textContent   = '✗ 0';
  loadVerbExercise();
  document.getElementById('verb-ex-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── DE / HET ─────────────────────────────────────────────────────────────────

// Build combined pool from vocabulary nouns + dehetWords (with grammar reasons)
const _dhPool = (function () {
  // Lookup by word for grammar reasons from dehetWords
  const dhLookup = {};
  dehetWords.forEach(w => { dhLookup[w.word.toLowerCase()] = w; });

  const seen = new Set();
  const pool = [];

  // Add all dehetWords first (they have grammar reasons)
  dehetWords.forEach(w => {
    seen.add(w.word.toLowerCase());
    pool.push(w);
  });

  // Add vocabulary nouns that have a clear single article
  vocabulary
    .filter(w => w.type === 'zn.' &&
      (w.nl.startsWith('de ') || w.nl.startsWith('het ')) &&
      !(w.nl.startsWith('de ') && w.nl.includes(' / het ')) &&
      !(w.nl.startsWith('het ') && w.nl.includes(' / de ')))
    .forEach(w => {
      const article = w.nl.startsWith('de ') ? 'de' : 'het';
      const word = w.nl.slice(article.length + 1).split(' / ')[0].trim();
      const key = word.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        pool.push({ word, article, level: w.level, en: w.en, topic: w.topic });
      }
    });

  return pool;
})();

let dhIdx = 0, dhCorrect = 0, dhWrong = 0;
let dhCurrentLevel = 'A1';
let dhOrder = [];
let dhUnitTopics = null; // null = filter by level only, array = filter by unit topics

function _dhBuildOrder() {
  let pool;
  if (dhUnitTopics && dhUnitTopics.length > 0) {
    // Unit active: only words whose topic matches the unit (vocab-derived words have topic)
    pool = _dhPool.filter(w => w.level === dhCurrentLevel && w.topic && dhUnitTopics.includes(w.topic));
    // If that gives nothing, fall back to level-only (e.g. unit has no matching nouns)
    if (pool.length === 0) pool = _dhPool.filter(w => w.level === dhCurrentLevel);
  } else {
    pool = dhCurrentLevel === 'all' ? _dhPool : _dhPool.filter(w => w.level === dhCurrentLevel);
  }
  dhOrder = [...pool].sort(() => Math.random() - 0.5);
  dhIdx = 0;
}

function _dhUpdateCounts() {
  if (!document.getElementById('dh-count-all')) return;
  const levels = ['A1', 'A2', 'B1', 'B2'];
  levels.forEach(l => {
    const el = document.getElementById('dh-count-' + l);
    if (el) el.textContent = _dhPool.filter(w => w.level === l).length + ' palabras';
  });
  document.getElementById('dh-count-all').textContent = _dhPool.length + ' palabras';
}

function setDeHetLevel(level, btn) {
  dhCurrentLevel = level;
  document.querySelectorAll('#dh-level-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  dhCorrect = 0;
  dhWrong = 0;
  document.getElementById('dh-correct').textContent = 0;
  document.getElementById('dh-wrong').textContent = 0;
  document.getElementById('dh-word-panel').style.display = '';
  document.getElementById('dh-done-panel').style.display = 'none';
  _dhBuildOrder();
  loadDeHet();
}

function _dhUpdateRemaining() {
  const rem = Math.max(0, dhOrder.length - dhIdx);
  const el = document.getElementById('dh-remaining');
  if (el) el.textContent = rem;
}

function loadDeHet() {
  if (!document.getElementById('dh-word-panel')) return;
  if (dhOrder.length === 0) _dhBuildOrder();
  // Show completion screen when all words are done
  if (dhIdx >= dhOrder.length) {
    document.getElementById('dh-word-panel').style.display = 'none';
    const donePanel = document.getElementById('dh-done-panel');
    donePanel.style.display = '';
    const pct = dhCorrect + dhWrong > 0 ? Math.round(dhCorrect / (dhCorrect + dhWrong) * 100) : 0;
    document.getElementById('dh-done-stats').innerHTML =
      `<strong>${dhCorrect}</strong> correcto &nbsp;·&nbsp; <strong>${dhWrong}</strong> incorrecto &nbsp;·&nbsp; <strong>${pct}%</strong> puntuación<br>
       <span style="font-size:0.8rem;color:var(--text-muted)">${dhOrder.length} palabras practicadas</span>`;
    // Show next-step button if a unit is active
    const nextStepBtn = document.getElementById('dh-next-step-btn');
    if (nextStepBtn) {
      const next = activeUnit ? _nextStepInfo('dehet') : null;
      nextStepBtn.style.display = next ? '' : 'none';
      if (next) nextStepBtn.textContent = 'Siguiente: ' + next.label + ' →';
    }
    _dhUpdateRemaining();
    return;
  }
  document.getElementById('dh-word-panel').style.display = '';
  document.getElementById('dh-done-panel').style.display = 'none';
  const w = dhOrder[dhIdx];
  document.getElementById('dh-noun').textContent = w.word;
  document.getElementById('dh-translation').textContent = w.en;
  document.getElementById('dh-feedback').textContent = '';
  document.getElementById('dh-feedback').className = 'dehet-feedback';
  document.getElementById('dh-de').className = 'dehet-btn';
  document.getElementById('dh-het').className = 'dehet-btn';
  document.getElementById('dh-de').disabled = false;
  document.getElementById('dh-het').disabled = false;
  document.getElementById('dh-next-btn').style.display = 'none';
  _dhUpdateRemaining();
}

function restartDeHet() {
  dhCorrect = 0;
  dhWrong = 0;
  document.getElementById('dh-correct').textContent = 0;
  document.getElementById('dh-wrong').textContent = 0;
  _dhBuildOrder(); // reshuffle
  loadDeHet();
}

function answerDeHet(choice) {
  const w = dhOrder[dhIdx];
  const correct = choice === w.article;
  document.getElementById('dh-de').disabled = true;
  document.getElementById('dh-het').disabled = true;
  const chosenBtn = document.getElementById('dh-' + choice);
  const correctBtn = document.getElementById('dh-' + w.article);
  const reasonHtml = w.reason
    ? `<div class="dh-reason">${w.reason}</div>`
    : '';
  if (correct) {
    chosenBtn.className = 'dehet-btn selected-correct';
    dhCorrect++;
    document.getElementById('dh-feedback').innerHTML = '✓ ¡Correcto! <strong>' + w.article + ' ' + w.word + '</strong>' + reasonHtml;
    document.getElementById('dh-feedback').className = 'dehet-feedback correct';
  } else {
    chosenBtn.className = 'dehet-btn selected-wrong';
    correctBtn.className = 'dehet-btn reveal-correct';
    dhWrong++;
    document.getElementById('dh-feedback').innerHTML = '✗ Incorrecto. Es: <strong>' + w.article + ' ' + w.word + '</strong>' + reasonHtml;
    document.getElementById('dh-feedback').className = 'dehet-feedback wrong';
  }
  document.getElementById('dh-correct').textContent = dhCorrect;
  document.getElementById('dh-wrong').textContent = dhWrong;
  document.getElementById('dh-next-btn').style.display = 'inline-flex';
}

function nextDeHet() {
  dhIdx++;
  // Auto-mark de/het done when the full unit set has been completed
  if (activeUnit && dhUnitTopics && dhIdx >= dhOrder.length) {
    markUnitExercise(activeUnit.unit, 'dehet');
  }
  loadDeHet(); // shows completion screen automatically when dhIdx >= dhOrder.length
}

// ─── EDIT SENTENCES ───────────────────────────────────────────────────────────

const SENTENCES_KEY = 'englishcoach_sentences';

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderEditTable() {
  document.getElementById('edit-tbody').innerHTML = sentences.map((raw, i) => {
    const s = resolveGrammar(raw);
    const enRule = s.stype ? (stypeEN[s.stype] || '') : '';
    return `
    <tr data-idx="${i}">
      <td><input class="edit-input" value="${escapeHtml(s.nl)}" data-field="nl" placeholder="Frase en inglés..." /></td>
      <td><input class="edit-input" value="${escapeHtml(s.en)}" data-field="en" placeholder="Traducción en español..." /></td>
      <td>
        <select class="edit-select" data-field="level">
          <option ${s.level==='A1'?'selected':''}>A1</option>
          <option ${s.level==='A2'?'selected':''}>A2</option>
          <option ${s.level==='B1'?'selected':''}>B1</option>
        </select>
      </td>
      <td class="edit-grammar-cell">
        ${s.stype ? `<span class="stype-badge stype-${s.stype.toLowerCase().replace(/[^a-z]/g,'-')}">${s.stype}</span>` : ''}
        ${enRule ? `<div class="edit-grammar-rule">${enRule}</div>` : ''}
      </td>
      <td><button class="delete-row-btn" onclick="this.closest('tr').remove()" title="Eliminar">✕</button></td>
    </tr>`;
  }).join('');
  document.getElementById('edit-count').textContent = sentences.length + ' zinnen';
}

function addEditRow() {
  const tbody = document.getElementById('edit-tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="edit-input" value="" data-field="nl" placeholder="English sentence..." /></td>
    <td><input class="edit-input" value="" data-field="en" placeholder="English sentence..." /></td>
    <td>
      <select class="edit-select" data-field="level">
        <option>A1</option><option>A2</option><option>B1</option>
      </select>
    </td>
    <td><button class="delete-row-btn" onclick="this.closest('tr').remove()" title="Eliminar">✕</button></td>`;
  tbody.appendChild(tr);
  tr.querySelector('.edit-input').focus();
}

function saveEditedSentences() {
  const rows = document.querySelectorAll('#edit-tbody tr');
  const updated = [];
  rows.forEach(row => {
    const nl    = row.querySelector('[data-field="nl"]').value.trim();
    const en    = row.querySelector('[data-field="en"]').value.trim();
    const level = row.querySelector('[data-field="level"]').value;
    if (nl && en) updated.push(_mergeGrammarMeta(nl, level, en));
  });
  if (updated.length === 0) { showToast('⚠ No hay frases para guardar.'); return; }
  sentences = updated;
  localStorage.setItem(SENTENCES_KEY, JSON.stringify(sentences));
  renderSentences('all');
  updateSentenceCount();
  exIdx = 0; exScore = 0;
  renderEditTable();
  showToast('✓ ' + sentences.length + ' frases guardadas!');
}

function resetSentences() {
  if (!confirm('Wil je alle aanpassingen verwijderen en teruggaan naar de standaard zinnen?')) return;
  sentences = [...defaultSentences];
  localStorage.removeItem(SENTENCES_KEY);
  renderEditTable();
  renderSentences('all');
  updateSentenceCount();
  exIdx = 0; exScore = 0;
  showToast('Frases por defecto restauradas');
}

function exportSentences() {
  const json = JSON.stringify(sentences, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'englishcoach_sentences.json'; a.click();
  URL.revokeObjectURL(url);
}

function updateSentenceCount() {
  const el = document.getElementById('sentence-count-badge');
  if (el) el.textContent = sentences.length + ' zinnen';
}

// ─── SAVE / LOAD PROGRESS ────────────────────────────────────────────────────

const STORAGE_KEY = 'englishcoach_progress';

function saveProgress() {
  // Also flush any unsaved edits from the Bewerken table
  _autoSaveEdits();
  // Always persist current sentences
  localStorage.setItem(SENTENCES_KEY, JSON.stringify(sentences));
  const data = {
    exIdx, exScore,
    dhCorrect, dhWrong,
    currentVerb,
    exMode,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  showToast('✓ Voortgang opgeslagen!');
  updateSaveDate(data.savedAt);
  const btn = document.getElementById('save-btn');
  btn.classList.add('saved');
  setTimeout(() => btn.classList.remove('saved'), 1500);
}

function restartApp() {
  localStorage.clear();
  window.location.href = window.location.href;
}

function _updateAccountability() {
  const pool      = _buildPool();
  const practiced = pool.filter(s => { const st = sentenceStats[s.nl]; return st && (st.c + st.w) > 0; }).length;
  const remaining = activeSentences.length - exIdx; // matches the session counter
  const errors    = pool.filter(s => { const st = sentenceStats[s.nl]; return st && st.w > st.c; }).length;
  const p = document.getElementById('ex-acc-practiced');
  const r = document.getElementById('ex-acc-remaining');
  const e = document.getElementById('ex-acc-errors');
  if (p) p.textContent = practiced + ' practicadas';
  if (r) r.textContent = remaining + ' restantes';
  if (e) { e.textContent = errors + ' errores'; e.style.color = errors > 0 ? 'var(--accent)' : 'var(--text-muted)'; }
}

function _autoSaveIdx() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data.exIdx = exIdx;
    data.exScore = exScore;
    data.exMode = exMode;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch(e) {}
}

function loadProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    exIdx        = data.exIdx        ?? 0;
    exScore      = data.exScore      ?? 0;
    dhCorrect    = data.dhCorrect    ?? 0;
    dhWrong      = data.dhWrong      ?? 0;
    currentVerb  = data.currentVerb  ?? 0;
    if (data.exMode) {
      exMode = data.exMode;
      document.querySelectorAll('.ex-mode-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.mode === exMode));
    }
    if (data.savedAt) updateSaveDate(data.savedAt);
  } catch (e) { /* ignore corrupt data */ }
}

function updateSaveDate(iso) {
  const el = document.getElementById('save-date');
  if (!el) return;
  const d = new Date(iso);
  el.textContent = 'Opgeslagen: ' + d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
    + ' ' + d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ─── UNIT STEP NAVIGATION ──────────────────────────────────────────────────────

const _TYPE_TO_TAB = {
  grammatica:   'grammatica',
  zinnen:       'oefening',
  werkwoorden:  'werkwoorden',
  woordenschat: 'woordenschat',
  dehet:        'dehet',
};
const _TAB_TO_TYPE = {
  grammatica:   'grammatica',
  oefening:     'zinnen',
  werkwoorden:  'werkwoorden',
  woordenschat: 'woordenschat',
  dehet:        'dehet',
};
const _STEP_LABELS = {
  grammatica:   'Gramática',
  zinnen:       'Frases',
  werkwoorden:  'Verbos',
  woordenschat: 'Vocabulario',
  dehet:        'A / An',
};

// Returns ordered unique step types for any unit object
function _unitStepsFor(unit) {
  if (!unit) return [];
  const seen = new Set();
  return (unit.activities || [])
    .map(a => a.type)
    .filter(t => _TYPE_TO_TAB[t] && !seen.has(t) && seen.add(t));
}

// Returns ordered unique steps for the active unit (from activities list)
function _unitSteps() { return _unitStepsFor(activeUnit); }

// Returns the tab for the first incomplete step in a unit
function _firstIncompleteTab(unit) {
  if (!unit) return null;
  const prog = unitProgress[unit.unit] || {};
  const typeToProgKey = { zinnen: 'sentences', werkwoorden: 'werkwoorden', woordenschat: 'vocab', dehet: 'dehet' };
  for (const type of _unitStepsFor(unit)) {
    if (type === 'grammatica') {
      const allRead = (unit.grammarTopics || []).every(id => grammarReadData[id]);
      if (!allRead) return 'grammatica';
    } else {
      const progKey = typeToProgKey[type];
      if (progKey && !prog[progKey]) return _TYPE_TO_TAB[type];
    }
  }
  return null; // all done
}

// Returns { label, tab } for the next step after fromTab, or null if last step
function _nextStepInfo(fromTab) {
  const steps = _unitSteps();
  const currentType = _TAB_TO_TYPE[fromTab];
  const idx = steps.indexOf(currentType);
  const nextType = steps[idx + 1];
  if (!nextType) return null;
  return { label: _STEP_LABELS[nextType] || nextType, tab: _TYPE_TO_TAB[nextType] };
}

// Navigate to the next step, or to leerplan if all done
function _goNextUnitStep(fromTab) {
  const next = _nextStepInfo(fromTab);
  if (next) {
    if (activeUnit) _saveLastPosition(activeUnit.unit, next.tab);
    switchTab(next.tab);
  } else {
    // All steps done — go to lesson plan
    switchTab('leerplan');
  }
}

// ─── GRAMMAR PROGRESS TRACKING ─────────────────────────────────────────────────

function markGrammarTopicRead(id) {
  grammarReadData[id] = true;
  localStorage.setItem(GRAMMAR_READ_KEY, JSON.stringify(grammarReadData));
  // Update the button in place
  const btn = document.querySelector(`[data-gtread="${id}"]`);
  if (btn) {
    btn.textContent = '✓ Estudiado';
    btn.classList.add('gt-read-done');
    btn.disabled = true;
  }
  _updateHomeGrammarStat();
}

function _updateHomeGrammarStat() {
  if (typeof grammarTopicsData === 'undefined') return;
  const total = grammarTopicsData.length;
  const read = grammarTopicsData.filter(t => grammarReadData[t.id]).length;
  const errCount = _totalGrammarErrors();
  let stat = read + '/' + total + ' estudiado';
  if (errCount > 0) stat += ' · ' + errCount + ' errores';
  _setStat('home-stat-grammatica', stat);
}

function _totalGrammarErrors() {
  return sentences.filter(s => { const st = sentenceStats[s.nl]; return st && st.w > st.c; }).length;
}

// Returns error count for sentences matching a grammar topic filter/id
function _grammarTopicErrors(topic) {
  const filterKey = topic.filter || topic.id;
  const matcher = exGrammarMap[filterKey] || (s => s.gtopic === filterKey || s.gtopic === topic.id);
  const pool = sentences.filter(matcher);
  return pool.reduce((n, s) => {
    const st = sentenceStats[s.nl];
    return n + (st && st.w > st.c ? 1 : 0);
  }, 0);
}

// Jump to oefening tab in errors mode filtered to a grammar topic
function practiceGrammarErrors(topicFilter) {
  exGrammar = topicFilter || 'all';
  exMode = 'errors';
  switchTab('oefening');
  // Activate the matching grammar filter button if it exists
  setTimeout(() => {
    document.querySelectorAll('.ex-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === 'errors'));
    const grammarBtns = document.querySelectorAll('#ex-grammar-filter .filter-btn');
    grammarBtns.forEach(b => b.classList.toggle('active', b.dataset.grammar === topicFilter));
    rebuildActive();
    exIdx = 0;
    loadSentence();
  }, 50);
}

// ─── GRAMMAR TOPICS A1–B2 ──────────────────────────────────────────────────────

function _renderGtCard(topic) {
  const levelClass = 'level-' + topic.level.toLowerCase();
  const tablesHtml = (topic.tables || []).map(tbl => `
    <div class="gt-table-wrap">
      <div class="gt-table-heading">${tbl.heading}</div>
      <table class="gt-table">
        <thead><tr>${tbl.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${tbl.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>`).join('');
  const rulesHtml = (topic.rules || []).map(r => `
    <div class="gt-rule">
      <span class="gt-rule-nl">${r.nl}</span>
    </div>`).join('');
  const examplesHtml = (topic.examples || []).map(ex => `
    <div class="gt-example">
      <span class="gt-ex-nl">${ex.nl}</span>
      <span class="gt-ex-en">${ex.en}</span>
      ${ex.note ? `<span class="gt-ex-note">${ex.note}</span>` : ''}
    </div>`).join('');
  return `
    <div class="gt-card gt-topic-block" data-gtlevel="${topic.level}" data-gtfilter="${topic.filter}" data-pill="${topic.id}">
      <div class="gt-card-header">
        <span class="level-badge ${levelClass}">${topic.level}</span>
        <span class="gt-title">${topic.title}</span>
      </div>
      <div class="gt-card-body">
        <div class="gt-intro">${topic.intro}</div>
        ${tablesHtml}
        ${rulesHtml ? `<div class="gt-rules">${rulesHtml}</div>` : ''}
        ${examplesHtml ? `<div class="gt-examples"><div class="gt-examples-label">Ejemplos</div>${examplesHtml}</div>` : ''}
        ${topic.tip ? `<div class="gt-tip"><span class="gt-tip-text">${topic.tip}</span></div>` : ''}
      </div>
    </div>`;
}

function filterGrammarLevel(level, btn) {
  document.querySelectorAll('#gt-level-filter .filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  // Reset all topic blocks to visible
  document.querySelectorAll('.gt-topic-block').forEach(b => b.style.display = '');
  // Show/hide level sections
  document.querySelectorAll('.gt-level-section').forEach(sec => {
    sec.style.display = (level === 'all' || sec.dataset.gtlevel === level) ? '' : 'none';
  });
  // Build sub-topic filter row
  const subRow = document.getElementById('gt-subtopic-filter');
  if (!subRow) return;
  if (level === 'all') { subRow.style.display = 'none'; subRow.innerHTML = ''; return; }
  const topics = _getTopicsForLevel(level);
  subRow.style.display = '';
  subRow.innerHTML = topics.map(t =>
    `<button class="filter-btn" data-subtopic="${t.key}" onclick="filterGrammarSubtopic('${t.key}',this)">${t.label}</button>`
  ).join('');
}

function _getTopicsForLevel(level) {
  const topics = [];
  if (level === 'A1') {
    topics.push(
      { key: 'pronouns',      label: 'Pronombres' },
      { key: 'verb-be',       label: 'To be' },
      { key: 'articles',      label: 'Artículos' },
      { key: 'tenses',        label: 'Tiempos' }
    );
  }
  if (typeof grammarTopicsData !== 'undefined') {
    grammarTopicsData.filter(t => t.level === level).forEach(t => {
      topics.push({ key: t.id, label: t.title });
    });
  }
  return topics;
}

function filterGrammarSubtopic(key, btn) {
  document.querySelectorAll('#gt-subtopic-filter .filter-btn').forEach(b => b.classList.remove('active'));
  const isActive = btn.dataset.subtopic === key && btn.classList.contains('active');
  if (isActive) {
    // Toggle off — show all blocks
    document.querySelectorAll('.gt-topic-block').forEach(b => b.style.display = '');
  } else {
    btn.classList.add('active');
    document.querySelectorAll('.gt-topic-block').forEach(b => {
      b.style.display = b.dataset.pill === key ? '' : 'none';
    });
  }
}

function navigateToGrammarTopic(level, topicKey) {
  switchTab('grammatica');
  const levelBtn = document.querySelector(`#gt-level-filter [data-gtlevel="${level}"]`);
  filterGrammarLevel(level, levelBtn);
  const subtopicBtn = document.querySelector(`#gt-subtopic-filter [data-subtopic="${topicKey}"]`);
  if (subtopicBtn) filterGrammarSubtopic(topicKey, subtopicBtn);
  document.getElementById('grammar-content')?.scrollIntoView({ behavior:'smooth', block:'start' });
}

// ─── UNIT FILTER ──────────────────────────────────────────────────────────────

let activeUnit = null;
let activeActivityIdx = 0; // current activity index within the unit
let _activityPracticing = false; // true when practicing sentences for a grammar activity

const ACTIVITY_PROGRESS_KEY = 'englishcoach_activity_progress';
let activityProgress = {}; // { "1": [true, true, false, false, false], "2": [...] }

function _loadActivityProgress() {
  try { activityProgress = JSON.parse(localStorage.getItem(ACTIVITY_PROGRESS_KEY)) || {}; } catch(e) { activityProgress = {}; }
}
function _saveActivityProgress() {
  localStorage.setItem(ACTIVITY_PROGRESS_KEY, JSON.stringify(activityProgress));
}

function _allUnits() {
  if (typeof lessonPlanData === 'undefined') return [];
  return lessonPlanData.levels.flatMap(lv =>
    lv.units.map(u => ({ ...u, level: lv.level }))
  );
}

function _getActivityLabel(unitNum, actIdx) {
  return unitNum + '.' + (actIdx + 1);
}

function _firstIncompleteActivity(unit) {
  const prog = activityProgress[unit.unit] || [];
  const acts = unit.activities || [];
  for (let i = 0; i < acts.length; i++) {
    if (!prog[i]) return i;
  }
  return null; // all done
}

function setActiveUnit(unitNumber, skipNav) {
  const all = _allUnits();
  activeUnit = all.find(u => u.unit === unitNumber) || null;
  if (activeUnit) {
    _applyUnitFilters();
    const firstIncomplete = _firstIncompleteActivity(activeUnit);
    activeActivityIdx = firstIncomplete !== null ? firstIncomplete : 0;
    _saveLastPosition(unitNumber, 'grammatica');
    if (!skipNav) _navigateToActivity(activeActivityIdx);
  }
  renderAllUnitBars();
}

function clearActiveUnit() {
  activeUnit = null;
  activeActivityIdx = 0;
  vocabUnitTopics = null;
  vocabUnitLevel = null;
  dhUnitTopics = null;
  _showAllContent();
  renderAllUnitBars();
  renderVocab();
}

function markActivityDone(actIdx) {
  if (!activeUnit) return;
  const key = activeUnit.unit;
  if (!activityProgress[key]) activityProgress[key] = [];
  activityProgress[key][actIdx] = true;
  _saveActivityProgress();
  renderAllUnitBars();
}

function _navigateToActivity(actIdx) {
  if (!activeUnit) return;
  const acts = activeUnit.activities || [];
  if (actIdx >= acts.length) {
    _showAllContent();
    switchTab('leerplan');
    return;
  }
  activeActivityIdx = actIdx;
  _activityPracticing = false;
  const act = acts[actIdx];
  const tab = _TYPE_TO_TAB[act.type] || 'grammatica';

  switchTab(tab);

  // After switching, hide irrelevant content and show only what matches this activity
  setTimeout(() => {
    if (act.type === 'grammatica') {
      // Find which grammar topic this activity maps to
      let gramIdx = 0;
      for (let i = 0; i < actIdx; i++) {
        if (acts[i].type === 'grammatica') gramIdx++;
      }
      const topicId = (activeUnit.grammarTopics || [])[gramIdx];

      // Hide filters and intro — only show the relevant topic
      const gtLevelFilter = document.getElementById('gt-level-filter');
      const gtSubFilter = document.getElementById('gt-subtopic-filter');
      const gtIntro = document.querySelector('.grammar-intro');
      if (gtLevelFilter) gtLevelFilter.style.display = 'none';
      if (gtSubFilter) gtSubFilter.style.display = 'none';
      if (gtIntro) gtIntro.style.display = 'none';

      // Hide all grammar content
      document.querySelectorAll('#grammar-content .gt-level-section').forEach(sec => sec.style.display = 'none');
      document.querySelectorAll('#grammar-content .gt-topic-block').forEach(block => block.style.display = 'none');
      document.querySelectorAll('#grammar-content [data-gfilter]').forEach(el => el.style.display = 'none');

      if (topicId) {
        const card = document.querySelector(`[data-pill="${topicId}"]`);
        if (card) {
          const levelSec = card.closest('.gt-level-section');
          if (levelSec) levelSec.style.display = '';
          card.style.display = '';
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else if (act.type === 'werkwoorden') {
      // Hide search, filters, and non-relevant verbs
      if (activeUnit.verbFocus && activeUnit.verbFocus.length) {
        const focusSet = new Set(activeUnit.verbFocus);
        // Hide search and filters
        const searchInput = document.getElementById('verb-search');
        const typeFilters = document.getElementById('verb-type-filters');
        if (searchInput) searchInput.style.display = 'none';
        if (typeFilters) typeFilters.style.display = 'none';
        // Hide all verb chips not in verbFocus
        document.querySelectorAll('.verb-chip').forEach(chip => {
          const inf = chip.querySelector('.verb-chip-inf')?.textContent?.trim();
          chip.style.display = focusSet.has(inf) ? '' : 'none';
        });
        // Hide group headers
        document.querySelectorAll('.verb-group-header').forEach(h => h.style.display = 'none');
        // Select the first verb in focus
        const firstVerb = activeUnit.verbFocus[0];
        const idx = verbs.findIndex(v => v.inf === firstVerb);
        if (idx >= 0) {
          const btn = document.querySelectorAll('.verb-chip')[idx];
          if (btn) selectVerb(idx, btn);
        }
      }
    } else if (act.type === 'woordenschat') {
      // For vocabulary, hide search and topic filters — unit filters already applied
      const vocabSearch = document.getElementById('vocab-search');
      const vocabTopicFilters = document.getElementById('vocab-topic-filters');
      const vocabLevelFilters = document.getElementById('vocab-level-filters');
      const vocabHideCb = document.querySelector('.vocab-hide-toggle');
      if (vocabSearch) vocabSearch.style.display = 'none';
      if (vocabTopicFilters) vocabTopicFilters.style.display = 'none';
      if (vocabLevelFilters) vocabLevelFilters.style.display = 'none';
    } else if (act.type === 'zinnen') {
      // Set tiles mode for beginners and reload sentences
      exGrammar = 'all';
      rebuildActive();
      exIdx = 0;
      setInputMode('tiles');
      loadSentence();
      const cs = activeSentences[exIdx];
      if (cs) loadTiles(cs);
    }

    renderAllUnitBars();
  }, 200);
}

// Restore all content visibility when leaving unit mode
function _showAllContent() {
  // Grammar
  document.querySelectorAll('#grammar-content .gt-level-section').forEach(sec => sec.style.display = '');
  document.querySelectorAll('#grammar-content .gt-topic-block').forEach(block => block.style.display = '');
  document.querySelectorAll('#grammar-content [data-gfilter]').forEach(el => el.style.display = '');
  const gtLevelFilter = document.getElementById('gt-level-filter');
  const gtIntro = document.querySelector('.grammar-intro');
  if (gtLevelFilter) gtLevelFilter.style.display = '';
  if (gtIntro) gtIntro.style.display = '';
  // Verbs
  const searchInput = document.getElementById('verb-search');
  const typeFilters = document.getElementById('verb-type-filters');
  if (searchInput) searchInput.style.display = '';
  if (typeFilters) typeFilters.style.display = '';
  document.querySelectorAll('.verb-chip').forEach(chip => chip.style.display = '');
  document.querySelectorAll('.verb-group-header').forEach(h => h.style.display = '');
  // Vocabulary
  const vocabSearch = document.getElementById('vocab-search');
  const vocabTopicFilters = document.getElementById('vocab-topic-filters');
  const vocabLevelFilters = document.getElementById('vocab-level-filters');
  if (vocabSearch) vocabSearch.style.display = '';
  if (vocabTopicFilters) vocabTopicFilters.style.display = '';
  if (vocabLevelFilters) vocabLevelFilters.style.display = '';
}

function _getGrammarFilterForActivity(actIdx) {
  // Map a grammar activity to its filter key for sentence filtering
  if (!activeUnit) return null;
  const acts = activeUnit.activities || [];
  const act = acts[actIdx];
  if (!act || act.type !== 'grammatica') return null;
  let gramIdx = 0;
  for (let i = 0; i < actIdx; i++) {
    if (acts[i].type === 'grammatica') gramIdx++;
  }
  const topicId = (activeUnit.grammarTopics || [])[gramIdx];
  if (!topicId) return null;
  // Find the grammar topic's filter key
  if (typeof grammarTopicsData !== 'undefined') {
    const topic = grammarTopicsData.find(t => t.id === topicId);
    if (topic) return topic.filter || topic.id;
  }
  return topicId;
}

function goToNextActivity() {
  if (!activeUnit) return;
  const acts = activeUnit.activities || [];
  const currentAct = acts[activeActivityIdx];

  // Mark current activity as done
  markActivityDone(activeActivityIdx);
  _activityPracticing = false;

  // Advance to the next activity
  const nextIdx = activeActivityIdx + 1;

  if (nextIdx >= acts.length) {
    switchTab('leerplan');
    return;
  }
  _navigateToActivity(nextIdx);
}

function _applyUnitFilters() {
  if (!activeUnit) return;
  const u = activeUnit;

  // Zinnen oefenen: set level filter, reset grammar to "all"
  const levelBtn = document.querySelector(`#ex-level-filter [data-level="${u.level}"]`);
  if (levelBtn) filterExLevel(u.level, levelBtn);
  // Reset grammar filter to "all" for the unit
  const gramAllBtn = document.querySelector('#ex-grammar-filter [data-grammar="all"]');
  if (gramAllBtn) filterExGrammar('all', gramAllBtn);

  // De/Het: filter by unit topics + level
  dhCurrentLevel = u.level;
  dhUnitTopics = (u.vocabTopics && u.vocabTopics.length > 0) ? u.vocabTopics.map(vt => vt.topic) : null;
  dhCorrect = 0; dhWrong = 0;
  const dhC = document.getElementById('dh-correct');
  const dhW = document.getElementById('dh-wrong');
  if (dhC) dhC.textContent = 0;
  if (dhW) dhW.textContent = 0;
  _dhBuildOrder();
  if (document.getElementById('dh-word-panel')) loadDeHet();

  // Woordenschat: filter by all vocabTopics for this unit
  if (u.vocabTopics && u.vocabTopics.length > 0) {
    vocabUnitTopics = u.vocabTopics.map(vt => vt.topic);
    vocabUnitLevel = u.level;
  } else {
    vocabUnitTopics = null;
    vocabUnitLevel = null;
  }
  renderVocab();

  // Grammatica: filter to unit's level
  const glBtn = document.querySelector(`#gt-level-filter [data-gtlevel="${u.level}"]`);
  if (glBtn) filterGrammarLevel(u.level, glBtn);
}

function renderUnitBar(panelId) {
  const container = document.getElementById('unit-bar-' + panelId);
  if (!container) return;
  const all = _allUnits();

  if (activeUnit) {
    const u = activeUnit;
    const acts = u.activities || [];
    const prog = activityProgress[u.unit] || [];
    const doneCount = prog.filter(Boolean).length;
    const totalActs = acts.length;
    const currentAct = acts[activeActivityIdx];
    const label = _getActivityLabel(u.unit, activeActivityIdx);
    const actDesc = currentAct ? currentAct.desc : '';

    // Activity steps row
    const stepsHtml = acts.map((a, i) => {
      const isDone = !!prog[i];
      const isCurrent = i === activeActivityIdx;
      return `<span class="up-step ${isDone ? 'up-step-done' : ''} ${isCurrent ? 'up-step-current' : ''}"
        onclick="_navigateToActivity(${i})"
        title="${_getActivityLabel(u.unit, i)}: ${a.desc}">
        ${_getActivityLabel(u.unit, i)}
      </span>`;
    }).join('');

    const isLastAct = activeActivityIdx >= totalActs - 1;
    const isGrammarAct = currentAct && currentAct.type === 'grammatica';

    let nextBtnText;
    if (isLastAct) {
      nextBtnText = '✓ Hecho — ¡Unidad completada!';
    } else {
      nextBtnText = `✓ Hecho — Siguiente: ${_getActivityLabel(u.unit, activeActivityIdx + 1)} →`;
    }

    const statusText = `Paso ${label}: ${actDesc}`;

    container.innerHTML = `<div class="unit-bar unit-bar--active">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
        <span class="unit-bar-chip unit-bar-chip--${u.level.toLowerCase()}">Unidad ${u.unit} · ${u.level}</span>
        <span class="unit-bar-title">${u.title}</span>
        <span style="font-size:0.8rem;color:var(--text-muted)">${doneCount}/${totalActs} completado</span>
        <button class="unit-bar-clear" onclick="clearActiveUnit()" title="Salir de la unidad">✕</button>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">
        ${stepsHtml}
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span style="font-weight:600;color:var(--primary)">${statusText}</span>
      </div>
      <div style="margin-top:8px">
        <button class="unit-bar-next-btn${isLastAct && !_activityPracticing && !isGrammarAct ? ' unit-bar-next-btn--done' : ''}" onclick="goToNextActivity()">${nextBtnText}</button>
      </div>
    </div>`;
  } else {
    container.innerHTML = '';
  }
}

function renderAllUnitBars() {
  ['oefening', 'dehet', 'woordenschat', 'werkwoorden', 'grammatica'].forEach(renderUnitBar);
}

// ─── LESSON PLAN NAVIGATION ───────────────────────────────────────────────────

function navigateToVocab(level, topic) {
  switchTab('woordenschat');
  // set level
  const levelBtn = document.querySelector(`#vocab-level-filters [data-level="${level}"]`);
  if (levelBtn) setVocabLevel(level, levelBtn);
  // set topic (after a tick so vocab renders first)
  setTimeout(() => {
    const topicBtn = document.querySelector(`#vocab-topic-filters [data-vtopic="${topic}"]`);
    if (topicBtn) setVocabTopic(topic, topicBtn);
    document.getElementById('panel-woordenschat')?.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 50);
}

function navigateToVerb(verbName) {
  switchTab('werkwoorden');
  setTimeout(() => {
    const chips = document.querySelectorAll('.verb-chip');
    chips.forEach(chip => {
      if (chip.textContent.trim().toLowerCase() === verbName.toLowerCase()) {
        chip.click();
        chip.scrollIntoView({ behavior:'smooth', block:'center' });
      }
    });
  }, 50);
}

function navigateToOefening(level, grammarFilter) {
  switchTab('oefening');
  setTimeout(() => {
    if (level && level !== 'all') {
      const levelBtn = document.querySelector(`#ex-level-filter [data-level="${level}"]`);
      if (levelBtn) filterExLevel(level, levelBtn);
    }
    if (grammarFilter && grammarFilter !== 'all') {
      const gramBtn = document.querySelector(`#ex-grammar-filter [data-grammar="${grammarFilter}"]`);
      if (gramBtn) filterExGrammar(grammarFilter, gramBtn);
    }
    document.getElementById('panel-oefening')?.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 50);
}

// ─── LESSON PLAN ──────────────────────────────────────────────────────────────

function renderLessonPlan() {
  const container = document.getElementById('leerplan-content');
  if (!container || typeof lessonPlanData === 'undefined') return;
  const d = lessonPlanData;

  // Build grammar topic title lookup (filter-id → human title)
  const gtLookup = {};
  if (typeof grammarTopicsData !== 'undefined') {
    grammarTopicsData.forEach(t => { gtLookup[t.id] = t.title; });
  }

  // Vocab topic labels — reuse the global topicLabels from renderVocab
  const lpTopicLabels = typeof topicLabels !== 'undefined' ? topicLabels : {};

  const actIcons = { grammatica:'📐', werkwoorden:'🔤', dehet:'📖', zinnen:'✏️', woordenschat:'⭐' };
  const levelEnNames = { A1:'Principiante', A2:'Elemental', B1:'Intermedio', B2:'Intermedio alto' };

  const grammarFilterLabels = {
    negation:'Negación', question:'Preguntas', tenses:'Tiempos verbales',
    'there-is':'There is/are', Statement:'Afirmativa', Question:'Pregunta',
  };

  container.innerHTML = `
    <p class="lp-intro">${d.intro}</p>
    <div class="lp-sessions">
      ${d.levels.map((lv, li) => {
        const sn = li + 1;
        const sessionTopics = _getTopicsForLevel(lv.level);
        return `
        <div class="lp-session" style="--lp-color:${lv.color}">
          <div class="lp-session-header">
            <span class="lp-session-num">Sesión ${sn}</span>
            <span class="level-badge level-${lv.level.toLowerCase()}">${lv.level}</span>
            <span class="lp-session-title">${lv.title} · ${levelEnNames[lv.level]}</span>
            <span class="lp-session-duration">${lv.duration} · ${lv.durationEn}</span>
          </div>
          <div class="lp-session-nav">
            ${sessionTopics.map(t =>
              `<button class="lp-nav-pill" onclick="navigateToGrammarTopic('${lv.level}','${t.key}')">${t.label}</button>`
            ).join('')}
          </div>
          <div class="lp-topics">
            ${lv.units.map((unit, ui) => {
              const tn = ui + 1;
              let sub = 0;

              // 1. Vocabulary
              const vocabRow = unit.vocabTopics && unit.vocabTopics.length
                ? (sub++, `<div class="lp-subtopic">
                    <span class="lp-sub-num">${tn}.${sub}</span>
                    <span class="lp-sub-icon">⭐</span>
                    <div class="lp-sub-content">
                      <span class="lp-sub-label">Vocabulario</span>
                      <div class="lp-tags">${unit.vocabTopics.map(vt =>
                        `<span class="lp-tag lp-tag-vocab lp-tag-link"
                          onclick="navigateToVocab('${vt.level}','${vt.topic}')"
                          title="Abrir en Vocabulario">${topicLabels[vt.topic] || vt.topic} (${vt.level}) ↗</span>`
                      ).join('')}</div>
                    </div>
                  </div>`) : '';

              // 2. Grammar
              const grammarRows = unit.grammarTopics && unit.grammarTopics.length
                ? unit.grammarTopics.map(t => {
                    sub++;
                    return `<div class="lp-subtopic">
                      <span class="lp-sub-num">${tn}.${sub}</span>
                      <span class="lp-sub-icon">📐</span>
                      <div class="lp-sub-content">
                        <span class="lp-sub-label">Gramática</span>
                        <span class="lp-tag lp-tag-grammar lp-tag-link"
                          onclick="navigateToGrammarTopic('${lv.level}','${t}')"
                          title="Abrir en Gramática">${gtLookup[t] || t} ↗</span>
                      </div>
                    </div>`;
                  }).join('') : '';

              // 3. Sentences
              const sentenceRow = unit.sentenceFilter
                ? (sub++, `<div class="lp-subtopic">
                    <span class="lp-sub-num">${tn}.${sub}</span>
                    <span class="lp-sub-icon">✏️</span>
                    <div class="lp-sub-content">
                      <span class="lp-sub-label">Practicar oraciones</span>
                      <span class="lp-tag lp-tag-zinnen lp-tag-link"
                        onclick="navigateToOefening('${lv.level}','${unit.sentenceFilter}')"
                        title="Abrir en Oraciones">
                        ${lv.level} oraciones ↗
                      </span>
                    </div>
                  </div>`) : '';

              // 4. Verbs
              const verbRow = unit.verbFocus && unit.verbFocus.length
                ? (sub++, `<div class="lp-subtopic">
                    <span class="lp-sub-num">${tn}.${sub}</span>
                    <span class="lp-sub-icon">🔤</span>
                    <div class="lp-sub-content">
                      <span class="lp-sub-label">Practicar verbos</span>
                      <div class="lp-tags">${unit.verbFocus.map(v =>
                        `<span class="lp-tag lp-tag-verb lp-tag-link"
                          onclick="navigateToVerb('${v}')"
                          title="Abrir en Verbos">${v} ↗</span>`).join('')}</div>
                    </div>
                  </div>`) : '';

              // 5. A / An (only for units that include it in activities)
              const hasDehet = (unit.activities || []).some(a => a.type === 'dehet');
              const dehetRow = hasDehet
                ? (sub++, `<div class="lp-subtopic">
                    <span class="lp-sub-num">${tn}.${sub}</span>
                    <span class="lp-sub-icon">📖</span>
                    <div class="lp-sub-content">
                      <span class="lp-sub-label">Practicar a / an</span>
                      <span class="lp-tag lp-tag-dehet lp-tag-link"
                        onclick="setDeHetLevel('${lv.level}', document.querySelector('[data-dhlevel=\\'${lv.level}\\']')); switchTab('dehet');"
                        title="Practicar a/an">
                        a / an · ${lv.level} ↗
                      </span>
                    </div>
                  </div>`) : '';

              // 6. Goals
              const goalsRow = unit.goals && unit.goals.length
                ? (sub++, `<div class="lp-subtopic lp-subtopic-col">
                    <div class="lp-subtopic-head">
                      <span class="lp-sub-num">${tn}.${sub}</span>
                      <span class="lp-sub-icon">🎯</span>
                      <span class="lp-sub-label">Objetivos</span>
                    </div>
                    <ul class="lp-goals">
                      ${unit.goals.map(g => `
                      <li class="lp-goal">
                        <span class="lp-goal-nl">${g}</span>
                      </li>`).join('')}
                    </ul>
                  </div>`) : '';

              const isCurrent = lastStudyPosition && lastStudyPosition.unit === unit.unit;
              const allDoneUnit = !_firstIncompleteTab({ ...unit, level: lv.level });
              const nextTabForUnit = isCurrent ? (_firstIncompleteTab({ ...unit, level: lv.level }) || lastStudyPosition.tab) : null;
              const nextStepLabelForUnit = nextTabForUnit ? (_STEP_LABELS[_TAB_TO_TYPE[nextTabForUnit]] || nextTabForUnit) : null;

              return `
              <div class="lp-topic${isCurrent ? ' lp-topic--current' : ''}" id="lp-unit-${unit.unit}">
                ${isCurrent ? `<div class="lp-current-marker">${allDoneUnit ? '✓ Completada' : '▶ Estás aquí — Siguiente: ' + nextStepLabelForUnit}</div>` : ''}
                <div class="lp-topic-header">
                  <span class="lp-topic-num">Unidad ${unit.unit}</span>
                  <div class="lp-topic-titles">
                    <span class="lp-topic-title">${unit.title}</span>
                  </div>
                  <span class="lp-topic-weeks">${unit.weeks}</span>
                  ${(() => {
                    const p = unitProgress[unit.unit] || {};
                    const n = ['vocab','dehet','sentences','werkwoorden'].filter(k => p[k]).length;
                    return n > 0
                      ? `<span class="lp-progress-badge ${n === 4 ? 'lp-progress-full' : ''}">${n}/4</span>`
                      : '';
                  })()}
                  ${isCurrent && nextTabForUnit
                    ? `<button class="lp-unit-continue-btn" onclick="setActiveUnit(${unit.unit}); switchTab('${nextTabForUnit}')">Continuar: ${nextStepLabelForUnit} →</button>`
                    : `<button class="lp-unit-practice-btn" onclick="setActiveUnit(${unit.unit})" title="Empezar esta unidad desde gramática">🎯 Empezar</button>`
                  }
                </div>
                <div class="lp-subtopics">
                  ${vocabRow}${grammarRows}${sentenceRow}${verbRow}${dehetRow}${goalsRow}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>
  `;

  // Scroll to current unit if set
  if (lastStudyPosition && lastStudyPosition.unit) {
    setTimeout(() => {
      const el = document.getElementById('lp-unit-' + lastStudyPosition.unit);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

// Restore custom sentences if previously saved
const _savedSentences = localStorage.getItem(SENTENCES_KEY);
if (_savedSentences) {
  try {
    const _saved = JSON.parse(_savedSentences);
    // Merge in gtopic/stype/srule from defaultSentences for matching sentences
    sentences = _saved.map(s => {
      const def = defaultSentences.find(d => d.nl === s.nl);
      return def ? { ...s, gtopic: def.gtopic, stype: def.stype, srule: def.srule, unit: def.unit } : s;
    });
    // Add any new defaultSentences not yet in saved set
    defaultSentences.forEach(d => {
      if (!sentences.find(s => s.nl === d.nl)) sentences.push(d);
    });
  } catch(e) {}
}

// Restore sentence stats
const _savedStats = localStorage.getItem(STATS_KEY);
if (_savedStats) { try { sentenceStats = JSON.parse(_savedStats); } catch(e) {} }

// Restore sentence flags (stars + comments)
const _savedFlags = localStorage.getItem(FLAGS_KEY);
if (_savedFlags) { try { sentenceFlags = JSON.parse(_savedFlags); } catch(e) {} }

// Restore grammar read data
const _savedGrammarRead = localStorage.getItem(GRAMMAR_READ_KEY);
if (_savedGrammarRead) { try { grammarReadData = JSON.parse(_savedGrammarRead); } catch(e) {} }

// Restore last study position
const _savedLastPos = localStorage.getItem(LAST_POSITION_KEY);
if (_savedLastPos) { try { lastStudyPosition = JSON.parse(_savedLastPos); } catch(e) {} }

loadProgress();
initStreak();
initSRS();
updateDueBadge();
rebuildActive();
loadSentence();
renderSentences('all');
updateSentenceCount();
renderVerbSelector();
if (document.getElementById('dh-correct')) {
  _dhBuildOrder();
  _dhUpdateCounts();
  loadDeHet();
  document.getElementById('dh-correct').textContent = dhCorrect;
  document.getElementById('dh-wrong').textContent = dhWrong;
}
renderGrammarContent();
_loadUnitProgress();
_loadActivityProgress();
renderAllUnitBars();
renderLessonPlan();

if (document.getElementById('flags-body')) renderFlagsSection();
renderHome();

// ─── WOORDENSCHAT OEFENMODUS ──────────────────────────────────────────────────

let _vpList = [];
let _vpIdx = 0;
let _vpCorrect = 0;
let _vpWrong = 0;

function startVocabPractice() {
  _vpList = _getVocabList().sort(() => Math.random() - 0.5);
  if (_vpList.length === 0) return;
  _vpIdx = 0;
  _vpCorrect = 0;
  _vpWrong = 0;
  document.getElementById('vocab-grid-area').style.display = 'none';
  document.getElementById('vocab-practice-area').style.display = '';
  _renderVpCard();
}

function _renderVpCard() {
  const area = document.getElementById('vocab-practice-area');
  const total = _vpList.length;
  if (_vpIdx >= total) { _renderVpResult(); return; }
  const w = _vpList[_vpIdx];
  area.innerHTML = `
    <div style="text-align:center; padding: 8px 0 16px">
      <span style="font-size:0.85rem; color:var(--text-muted)">${_vpIdx + 1} / ${total}</span>
      <div style="background:var(--border); height:6px; border-radius:4px; margin:8px 0">
        <div style="background:var(--primary); height:6px; border-radius:4px; width:${Math.round((_vpIdx/total)*100)}%"></div>
      </div>
    </div>
    <div style="background:var(--surface); border:2px solid var(--border); border-radius:12px; padding:32px 24px; text-align:center; margin-bottom:16px">
      <div style="font-size:1.6rem; font-weight:800; margin-bottom:8px">${w.nl}</div>
      <div style="font-size:0.85rem; color:var(--text-muted)">${w.type} · ${topicLabels[w.topic] || w.topic}</div>
      <div id="vp-translation" style="display:none; font-size:1.1rem; color:var(--primary); margin-top:16px; font-style:italic">${w.en}</div>
    </div>
    <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap">
      <button id="vp-reveal-btn" class="btn btn-secondary" onclick="revealVocabWord()" style="min-width:140px">Mostrar traducción</button>
      <div id="vp-grade-btns" style="display:none; gap:12px; flex-wrap:wrap; justify-content:center">
        <button class="btn btn-primary" onclick="gradeVocabWord(true)" style="min-width:120px">✓ Lo sé</button>
        <button class="btn" onclick="gradeVocabWord(false)" style="background:var(--error);color:#fff;min-width:120px;box-shadow:0 4px 0 #c43a3a">✗ No lo sé</button>
      </div>
    </div>
    <div style="text-align:center; margin-top:16px">
      <button class="btn btn-secondary" onclick="stopVocabPractice()" style="font-size:0.8rem">Parar</button>
    </div>`;
}

function revealVocabWord() {
  document.getElementById('vp-translation').style.display = '';
  document.getElementById('vp-reveal-btn').style.display = 'none';
  const gb = document.getElementById('vp-grade-btns');
  if (gb) { gb.style.display = 'flex'; }
}

function gradeVocabWord(correct) {
  if (correct) _vpCorrect++; else _vpWrong++;
  _vpIdx++;
  _renderVpCard();
}

function _renderVpResult() {
  // Auto-mark vocab as done for active unit
  if (activeUnit) markUnitExercise(activeUnit.unit, 'vocab');
  const total = _vpList.length;
  const pct = Math.round((_vpCorrect / total) * 100);
  const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
  const area = document.getElementById('vocab-practice-area');
  area.innerHTML = `
    <div style="text-align:center; padding:32px 16px">
      <div style="font-size:2.5rem; margin-bottom:8px">${emoji}</div>
      <div style="font-size:1.4rem; font-weight:700; margin-bottom:20px">¡Ejercicio completado!</div>
      <div style="display:flex; gap:32px; justify-content:center; margin-bottom:8px; flex-wrap:wrap">
        <div style="text-align:center">
          <div style="font-size:2.2rem; font-weight:900; color:var(--success)">${_vpCorrect}</div>
          <div style="font-size:0.85rem; color:var(--text-muted)">✓ correcto</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:2.2rem; font-weight:900; color:var(--error)">${_vpWrong}</div>
          <div style="font-size:0.85rem; color:var(--text-muted)">✗ incorrecto</div>
        </div>
        <div style="text-align:center">
          <div style="font-size:2.2rem; font-weight:700">${pct}%</div>
          <div style="font-size:0.85rem; color:var(--text-muted)">puntuación</div>
        </div>
      </div>
      <div style="color:var(--text-muted); font-size:0.9rem; margin-bottom:28px">de ${total} palabras</div>
      <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap">
        ${(() => { const n = activeUnit ? _nextStepInfo('woordenschat') : null; return n ? `<button class="btn btn-primary" onclick="_goNextUnitStep('woordenschat')">Siguiente: ${n.label} →</button>` : ''; })()}
        <button class="btn ${activeUnit && _nextStepInfo('woordenschat') ? 'btn-secondary' : 'btn-primary'}" onclick="startVocabPractice()">🔁 Practicar de nuevo</button>
        <button class="btn btn-secondary" onclick="stopVocabPractice()">Volver a la lista</button>
      </div>
    </div>`;
}

function stopVocabPractice() {
  document.getElementById('vocab-practice-area').style.display = 'none';
  document.getElementById('vocab-grid-area').style.display = '';
}
