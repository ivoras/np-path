// Menus, set like the book: bone ground, black serif, no ornament.
//
// Screens: main -> (new | continue | start-from | settings | about)
//          pause -> (resume | settings | main)

import { save } from './save.js';

const CHAPTER_NAMES = [
  'PROLOGUE', 'ASCENT', 'INVERSION', 'EXPANSION',
  'CONSTRICTION', 'ABSENCE', 'THE PATH',
];

export class Menu {
  /**
   * Two mount points. The main menu lives inside the title layer, which is
   * hidden during play — so an in-game pause screen mounted there would be
   * invisible. The pause screen gets its own always-present root.
   */
  constructor(mainRoot, gameRoot) {
    this.mainRoot = mainRoot;
    this.gameRoot = gameRoot || mainRoot;
    this.root = mainRoot;
    this.stack = [];
    this.onNew = null;
    this.onContinue = null;
    this.onStartFrom = null;
    this.onResume = null;
    this.onQuitToMain = null;
    this.onSettingChange = null;
    this.inGame = false;
  }

  get open() { return this.stack.length > 0; }

  // ── plumbing ──────────────────────────────────────────────────
  _screen(title, rows, { sub = null, back = null, wide = false } = {}) {
    const el = document.createElement('div');
    // The first screen is translucent so the cover art (or the frozen game
    // behind a pause) shows through. Anything stacked on top of it is opaque,
    // or the screen underneath reads as ghost text.
    el.className = 'menu' + (wide ? ' wide' : '') +
                   (this.stack.length === 0 ? ' first' : '');

    const inner = document.createElement('div');
    inner.className = 'menu-inner';
    el.appendChild(inner);

    if (title) {
      const h = document.createElement('h2');
      h.className = 'menu-title';
      h.textContent = title;
      inner.appendChild(h);
    }
    if (sub) {
      const p = document.createElement('p');
      p.className = 'menu-sub';
      p.textContent = sub;
      inner.appendChild(p);
    }

    const list = document.createElement('div');
    list.className = 'menu-list';
    inner.appendChild(list);
    rows.forEach(r => list.appendChild(r));

    if (back) {
      const b = this.button('back', back, { quiet: true });
      b.classList.add('menu-back');
      inner.appendChild(b);
    }

    this.root.appendChild(el);
    this.stack.push(el);
    requestAnimationFrame(() => el.classList.add('in'));
    return el;
  }

  _pop() {
    const el = this.stack.pop();
    if (!el) return;
    el.classList.remove('in');
    setTimeout(() => el.remove(), 420);
  }

  closeAll() {
    while (this.stack.length) this._pop();
  }

  // ── widgets ───────────────────────────────────────────────────
  button(label, onClick, { note = null, disabled = false, quiet = false } = {}) {
    const b = document.createElement('button');
    b.className = 'menu-item' + (quiet ? ' quiet' : '');
    b.disabled = !!disabled;
    const t = document.createElement('span');
    t.className = 'mi-label';
    t.textContent = label;
    b.appendChild(t);
    if (note) {
      const n = document.createElement('span');
      n.className = 'mi-note';
      n.textContent = note;
      b.appendChild(n);
    }
    if (!disabled) b.addEventListener('click', onClick);
    return b;
  }

  toggle(label, key, note = null) {
    const b = document.createElement('button');
    b.className = 'menu-item toggle';
    const render = () => {
      b.innerHTML = '';
      const t = document.createElement('span');
      t.className = 'mi-label';
      t.textContent = label;
      const v = document.createElement('span');
      v.className = 'mi-value';
      v.textContent = save.settings[key] ? 'on' : 'off';
      b.appendChild(t);
      if (note) {
        const n = document.createElement('span');
        n.className = 'mi-note';
        n.textContent = note;
        b.appendChild(n);
      }
      b.appendChild(v);
    };
    render();
    b.addEventListener('click', () => {
      save.set(key, !save.settings[key]);
      render();
      this.onSettingChange?.(key, save.settings[key]);
    });
    return b;
  }

  slider(label, key, { min, max, step = 0.05, fmt = (v) => v.toFixed(2), note = null } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'menu-item slider';

    const t = document.createElement('span');
    t.className = 'mi-label';
    t.textContent = label;
    wrap.appendChild(t);

    if (note) {
      const n = document.createElement('span');
      n.className = 'mi-note';
      n.textContent = note;
      wrap.appendChild(n);
    }

    const v = document.createElement('span');
    v.className = 'mi-value';
    v.textContent = fmt(save.settings[key]);
    wrap.appendChild(v);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = min; input.max = max; input.step = step;
    input.value = save.settings[key];
    input.setAttribute('aria-label', label);
    input.addEventListener('input', () => {
      const val = parseFloat(input.value);
      save.set(key, val);
      v.textContent = fmt(val);
      this.onSettingChange?.(key, val);
    });
    wrap.appendChild(input);
    return wrap;
  }

  choice(label, key, options, note = null) {
    const wrap = document.createElement('div');
    wrap.className = 'menu-item choice';
    const t = document.createElement('span');
    t.className = 'mi-label';
    t.textContent = label;
    wrap.appendChild(t);
    if (note) {
      const n = document.createElement('span');
      n.className = 'mi-note';
      n.textContent = note;
      wrap.appendChild(n);
    }
    const row = document.createElement('span');
    row.className = 'mi-choices';
    options.forEach(([val, text]) => {
      const b = document.createElement('button');
      b.textContent = text;
      b.className = save.settings[key] === val ? 'on' : '';
      b.addEventListener('click', () => {
        save.set(key, val);
        [...row.children].forEach(c => c.classList.remove('on'));
        b.classList.add('on');
        this.onSettingChange?.(key, val);
      });
      row.appendChild(b);
    });
    wrap.appendChild(row);
    return wrap;
  }

  // ── screens ───────────────────────────────────────────────────
  main() {
    this.closeAll();
    this.inGame = false;
    this.root = this.mainRoot;

    const unlocked = save.unlocked();
    const rows = [
      this.button('New', () => {
        if (save.hasProgress) return this.confirmNew();
        this.closeAll(); this.onNew?.();
      }, { note: 'walk it from the first page' }),

      this.button('Continue', () => { this.closeAll(); this.onContinue?.(); }, {
        note: save.hasProgress
          ? `chapter ${save.furthest} · ${CHAPTER_NAMES[save.furthest - 1]}`
          : 'nothing walked yet',
        disabled: !save.hasProgress,
      }),

      this.button('Start From…', () => this.startFrom(), {
        note: unlocked.length
          ? `${unlocked.length} chapter${unlocked.length === 1 ? '' : 's'} finished`
          : 'finish a chapter to unlock',
        disabled: unlocked.length === 0,
      }),

      this.button('Settings', () => this.settings()),
      this.button('About', () => this.about(), { quiet: true }),
    ];

    return this._screen(null, rows);
  }

  confirmNew() {
    this._screen('Start again?', [
      this.button('Yes — erase the path', () => {
        save.clearProgress();
        this.closeAll();
        this.onNew?.();
      }, { note: 'finished chapters are forgotten' }),
      this.button('No', () => this._pop(), { quiet: true }),
    ], { sub: 'Progress is kept in this browser only.' });
  }

  startFrom() {
    const unlocked = save.unlocked();
    const rows = unlocked.map(n => this.button(
      `${String(n).padStart(2, '0')} · ${CHAPTER_NAMES[n - 1]}`,
      () => { this.closeAll(); this.onStartFrom?.(n); }
    ));
    this._screen('Start From', rows, {
      sub: 'Chapters you have finished. Continue picks up where you stopped.',
      back: () => this._pop(),
    });
  }

  settings() {
    const s = save.settings;
    const rows = [
      this.slider('Look sensitivity', 'sensitivity',
        { min: 0.3, max: 2.5, step: 0.05, fmt: v => `${v.toFixed(2)}×` }),
      this.toggle('Invert look — horizontal', 'invertX'),
      this.toggle('Invert look — vertical', 'invertY'),
      this.slider('Touch sensitivity', 'touchSensitivity',
        { min: 0.3, max: 2.5, step: 0.05, fmt: v => `${v.toFixed(2)}×`,
          note: 'virtual controller only' }),
      this.toggle('Left-handed layout', 'leftHanded', 'stick on the right'),
      this.toggle('Force touch controls', 'forceTouch', 'show them on a desktop too'),

      this.slider('Head bob', 'headBob',
        { min: 0, max: 1.5, step: 0.05, fmt: v => v === 0 ? 'off' : `${Math.round(v * 100)}%`,
          note: 'set to off if motion is uncomfortable' }),
      this.slider('Field of view', 'fov',
        { min: 55, max: 95, step: 1, fmt: v => `${Math.round(v)}°` }),

      this.slider('Print effects', 'printEffects',
        { min: 0, max: 1.4, step: 0.05, fmt: v => v === 0 ? 'off' : `${Math.round(v * 100)}%`,
          note: 'grain and plate misregistration' }),
      this.choice('Quality', 'quality', [
        ['auto', 'auto'], ['low', 'low'], ['medium', 'medium'], ['high', 'high'],
      ], 'takes effect on the next chapter'),
      this.choice('Text size', 'textScale', [
        [0.85, 'small'], [1, 'normal'], [1.25, 'large'], [1.5, 'larger'],
      ]),

      this.slider('Volume', 'volume',
        { min: 0, max: 1, step: 0.02, fmt: v => `${Math.round(v * 100)}%` }),
      this.toggle('Mute', 'muted'),

      this.button('Reset to defaults', () => {
        save.resetSettings();
        this.onSettingChange?.('*', null);
        this._pop();
        this.settings();
      }, { quiet: true }),
    ];

    this._screen('Settings', rows, { back: () => this._pop(), wide: true });
  }

  about() {
    const rows = [];
    const p = (text, cls = '') => {
      const d = document.createElement('p');
      d.className = 'menu-para ' + cls;
      d.textContent = text;
      rows.push(d);
    };
    p('THE PATH — a walking simulator adapted from the book by TLLOA.');
    p('All spoken text is verbatim from the source: 964 words across the whole game.');
    p('Nothing here can kill you. There is no score, no inventory, and no fail state. Every puzzle is made of looking, walking, standing, listening, or waiting.');
    p('Mouse to look, W A S D to walk, E or click to act, Esc for the menu. On a phone: left thumb walks, right thumb looks.', 'dim');
    p(save.available
      ? 'Progress is stored in this browser only.'
      : 'This browser is blocking site storage, so progress will not be kept.', 'dim');

    this._screen('About', rows, { back: () => this._pop(), wide: true });
  }

  // ── in-game ───────────────────────────────────────────────────
  pause() {
    if (this.open) return;
    this.inGame = true;
    this.root = this.gameRoot;
    this._screen(null, [
      this.button('Resume', () => { this.closeAll(); this.onResume?.(); }),
      this.button('Settings', () => this.settings()),
      this.button('Main menu', () => { this.closeAll(); this.onQuitToMain?.(); },
        { note: 'this chapter restarts if you come back to it', quiet: true }),
    ], { sub: 'The path waits.' });
  }
}

export { CHAPTER_NAMES };
