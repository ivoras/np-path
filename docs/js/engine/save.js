// Progress and settings, in localStorage.
//
// The game has no fail state and no score, so the only thing worth persisting
// is how far the path has been walked — and how the player wants to walk it.

const KEY = 'thepath.v1';

const DEFAULTS = {
  version: 1,
  completed: [],        // chapter numbers finished, 1-based
  furthest: 1,          // highest chapter reached — where Continue goes
  started: false,
  settings: {
    // look
    sensitivity: 1.0,   // 0.3 – 2.5
    invertX: false,
    invertY: false,
    touchSensitivity: 1.0,

    // comfort
    headBob: 1.0,       // 0 – 1.5; 0 is a genuine accessibility option
    fov: 68,            // 55 – 95

    // the print stack — some people cannot tolerate heavy grain
    printEffects: 1.0,  // 0 – 1.4, scales grain + misregistration

    // audio
    volume: 0.9,
    muted: false,

    // presentation
    textScale: 1.0,     // 0.8 – 1.5
    quality: 'auto',    // auto | low | medium | high

    // touch
    forceTouch: false,
    leftHanded: false,
  },
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

class Save {
  constructor() {
    this.data = clone(DEFAULTS);
    this.available = true;
    this.load();
  }

  load() {
    let raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch {
      // private mode, blocked site data — the game still plays, it just forgets
      this.available = false;
      return;
    }
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === DEFAULTS.version) {
        this.data = {
          ...clone(DEFAULTS),
          ...parsed,
          settings: { ...clone(DEFAULTS.settings), ...(parsed.settings || {}) },
        };
        if (!Array.isArray(this.data.completed)) this.data.completed = [];
      }
    } catch {
      this.data = clone(DEFAULTS);
    }
  }

  save() {
    if (!this.available) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      this.available = false;
    }
  }

  // ── settings ──────────────────────────────────────────────────
  get settings() { return this.data.settings; }

  set(key, value) {
    this.data.settings[key] = value;
    this.save();
  }

  resetSettings() {
    this.data.settings = clone(DEFAULTS.settings);
    this.save();
  }

  // ── progress ──────────────────────────────────────────────────
  get completed() { return this.data.completed.slice().sort((a, b) => a - b); }
  get furthest() { return this.data.furthest; }
  get hasProgress() { return this.data.started && (this.data.furthest > 1 || this.data.completed.length > 0); }

  reach(chapter) {
    this.data.started = true;
    if (chapter > this.data.furthest) this.data.furthest = chapter;
    this.save();
  }

  complete(chapter) {
    if (!this.data.completed.includes(chapter)) this.data.completed.push(chapter);
    this.data.completed.sort((a, b) => a - b);
    this.save();
  }

  /** Chapters the player may jump straight to: the ones they have finished. */
  unlocked() { return this.completed; }

  isComplete(chapter) { return this.data.completed.includes(chapter); }

  clearProgress() {
    this.data.completed = [];
    this.data.furthest = 1;
    this.data.started = false;
    this.save();
  }
}

export const save = new Save();
export const SETTING_DEFAULTS = DEFAULTS.settings;
