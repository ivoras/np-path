// Voice-over, set as typography.
//
// The source text is 964 words across roughly 150 minutes of design runtime —
// about 6.4 words per minute, a twentieth of conversational density. Nothing
// is added, cut, reordered or paraphrased. The lines are set in the book's own
// face, low and left, ragged right, exactly as they sit on the page.
//
// The `…` glyph in the source is a POV switch, not an ellipsis of omitted
// speech. It is never spoken and never printed — it fires the Cut instead.

const VOICE_CLASS = {
  traveler: '',
  watcher:  'watcher',
  merged:   'merged',
  stripped: 'merged',
};

export class VO {
  constructor(root, cardEl, titleEl, hintEl, flashEl) {
    this.root = root;
    this.cardEl = cardEl;
    this.titleEl = titleEl;
    this.hintEl = hintEl;
    this.flashEl = flashEl;
    this.queue = [];
    this.active = [];
    this.t = 0;
    this.busy = false;
  }

  clear() {
    this.queue.length = 0;
    this.active.forEach(a => a.el.remove());
    this.active.length = 0;
    this.root.innerHTML = '';
  }

  /**
   * Say a line.
   * @param {string} text   verbatim source text
   * @param {object} opt    { voice, hold, delay }
   *   hold  — seconds the line stays up (default scales with length)
   *   delay — seconds before it appears. Lines land 3–6 s late, never on the
   *           image they describe.
   */
  say(text, opt = {}) {
    const words = text.split(/\s+/).length;
    this.queue.push({
      text,
      voice: opt.voice || 'traveler',
      delay: opt.delay ?? 0,
      hold: opt.hold ?? Math.max(3.4, words * 0.42 + 2.2),
      fired: false,
    });
    return this;
  }

  /** Convenience: a run of lines, each waiting for the previous to clear. */
  sequence(lines, opt = {}) {
    let t = opt.delay ?? 0;
    lines.forEach(([text, o = {}]) => {
      const words = text.split(/\s+/).length;
      const hold = o.hold ?? Math.max(3.4, words * 0.42 + 2.2);
      this.say(text, { ...opt, ...o, delay: t + (o.gap ?? 0) });
      t += hold + (o.gap ?? 0) + (o.after ?? 1.1);
    });
    return this;
  }

  update(dt) {
    this.t += dt;

    for (const item of this.queue) {
      if (item.fired) continue;
      item.delay -= dt;
      if (item.delay > 0) continue;
      item.fired = true;

      const el = document.createElement('p');
      el.className = 'ln ' + (VOICE_CLASS[item.voice] || '');
      el.textContent = item.text;
      this.root.appendChild(el);
      requestAnimationFrame(() => el.classList.add('in'));

      this.active.push({ el, life: item.hold });
    }
    if (this.queue.length && this.queue.every(q => q.fired)) this.queue.length = 0;

    for (let i = this.active.length - 1; i >= 0; i--) {
      const a = this.active[i];
      a.life -= dt;
      if (a.life <= 0 && !a.fading) {
        a.fading = true;
        a.el.classList.remove('in');
        a.el.classList.add('out');
        setTimeout(() => a.el.remove(), 3600);
        this.active.splice(i, 1);
      }
    }
  }

  get idle() { return this.queue.length === 0 && this.active.length === 0; }

  // ── the Cut ───────────────────────────────────────────────────
  /** One frame of pure bone white, no fade. */
  flash(duration = 0.05) {
    const el = this.flashEl;
    el.style.transition = 'none';
    el.style.opacity = '1';
    setTimeout(() => {
      el.style.transition = `opacity ${duration}s linear`;
      el.style.opacity = '0';
    }, 16);
  }

  // ── coda cards ────────────────────────────────────────────────
  /**
   * The three-line card that closes each section. Whispered by both voices
   * at once, slightly out of sync — here, two lines fading up 1.5 s apart.
   */
  card(lines, { invert = false, bigFirst = false, hold = 7 } = {}) {
    return new Promise((resolve) => {
      const el = this.cardEl;
      el.className = invert ? 'invert' : '';
      el.innerHTML = '';
      const els = lines.map((ln, i) => {
        const p = document.createElement('p');
        p.className = 'cl' + (bigFirst && i === 0 ? ' big' : '');
        p.textContent = ln;
        el.appendChild(p);
        return p;
      });
      el.classList.remove('hidden');
      els.forEach((p, i) => setTimeout(() => p.classList.add('in'), 400 + i * 1500));

      const total = 400 + els.length * 1500 + hold * 1000;
      setTimeout(() => {
        els.forEach(p => p.classList.remove('in'));
        setTimeout(() => { el.classList.add('hidden'); resolve(); }, 2100);
      }, total);
    });
  }

  /** Chapter title, in the same position and face as every card. */
  title(text, hold = 3.4) {
    return new Promise((resolve) => {
      const el = this.titleEl;
      el.textContent = text;
      el.classList.remove('hidden');
      requestAnimationFrame(() => el.classList.add('in'));
      setTimeout(() => {
        el.classList.remove('in');
        setTimeout(() => { el.classList.add('hidden'); resolve(); }, 1900);
      }, hold * 1000);
    });
  }

  // ── the assist ladder ─────────────────────────────────────────
  /**
   * Diegetic, italic, low-contrast, and never a prompt box. Assists are a
   * camera drift, a change in the mix, or a line already heard — never a
   * glow, an outline, a marker, or a "press X".
   */
  hint(text, seconds = 6) {
    this.hintEl.textContent = text;
    this.hintEl.classList.add('in');
    clearTimeout(this._hintT);
    this._hintT = setTimeout(() => this.hintEl.classList.remove('in'), seconds * 1000);
  }
  clearHint() {
    this.hintEl.classList.remove('in');
    clearTimeout(this._hintT);
  }
}

export const wait = (s) => new Promise(r => setTimeout(r, s * 1000));
