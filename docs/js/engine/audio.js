// Fully procedural Web Audio. No sample downloads — every sound in the game
// is synthesised at runtime.
//
// Instrumentation (00_design_bible.md §7):
//   bowed double bass · prepared piano (screws and felt) · one detuned pump
//   organ · contact-mic'd stone and metal · a female voice used only as
//   texture, never as melody, never with words.
//   No drums, ever.
//
// The chord: D minor with a flat fifth (D–F–Ab), stated in ch01 and never
// resolved. It drops a whole step in ch02, inverts in ch03, is reduced to its
// bare root in ch05, is absent in ch06, and resolves exactly once — in ch07,
// at the shadow convergence, when the Ab becomes an A.

const NOTE = {
  D2: 73.42,  F2: 87.31,  Ab2: 103.83, A2: 110.00,
  D3: 146.83, F3: 174.61, Ab3: 207.65, A3: 220.00,
  C3: 130.81, Eb3: 155.56, Bb2: 116.54,
  D4: 293.66, F4: 349.23, A4: 440.00,
};

function noiseBuffer(ctx, seconds = 2.5) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/** Brown-ish noise — heavier low end, for wind pressure and sub beds. */
function brownBuffer(ctx, seconds = 3) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    d[i] = last * 3.2;
  }
  return buf;
}

/** Generated impulse response. A real stone stairwell, not a plate. */
function impulse(ctx, seconds, decay, bright = 0.6) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      // sparse early reflections + diffuse tail
      const spark = Math.random() < 0.0016 ? (Math.random() * 2 - 1) * 2.2 : 0;
      const tail = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      d[i] = (tail * bright + spark * (1 - t)) * (1 - t * 0.15);
    }
  }
  return buf;
}

export class Audio {
  constructor() {
    this.ready = false;
    this.muted = false;
    this.time = 0;
  }

  /** Must be called from a user gesture. */
  init() {
    if (this.ready) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = this.ctx = new Ctx();

    this.master = ctx.createGain();
    this.master.gain.value = 0.0;
    // gentle limiter so the burst and the collapse cannot clip
    this.limiter = ctx.createDynamicsCompressor();
    this.limiter.threshold.value = -6;
    this.limiter.knee.value = 12;
    this.limiter.ratio.value = 8;
    this.limiter.attack.value = 0.004;
    this.limiter.release.value = 0.25;
    this.master.connect(this.limiter).connect(ctx.destination);

    // ── buses ────────────────────────────────────────────────────
    const bus = (v) => { const g = ctx.createGain(); g.gain.value = v; g.connect(this.master); return g; };
    this.score   = bus(0.0);
    this.ambient = bus(0.0);
    this.foley   = bus(0.9);
    this.voice   = bus(0.9);

    // ── spaces ───────────────────────────────────────────────────
    this.stone = ctx.createConvolver();          // the turret stairwell
    this.stone.buffer = impulse(ctx, 3.4, 2.6, 0.7);
    this.stoneSend = ctx.createGain();
    this.stoneSend.gain.value = 0.0;
    this.stoneSend.connect(this.stone).connect(this.master);

    this.nBuf = noiseBuffer(ctx, 3);
    this.bBuf = brownBuffer(ctx, 4);

    this._buildWind();
    this._buildRain();
    this._buildOrgan();
    this._buildVoiceTexture();
    this._buildSub();

    this.ready = true;
  }

  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  get now() { return this.ctx ? this.ctx.currentTime : 0; }

  _ramp(param, value, time = 1.2) {
    if (!this.ctx) return;
    const t = this.now;
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(value, t + Math.max(0.001, time));
  }

  // ── master ────────────────────────────────────────────────────
  fadeIn(t = 3)  { this._ramp(this.master.gain, this.muted ? 0 : 0.9, t); }
  fadeOut(t = 2) { this._ramp(this.master.gain, 0, t); }

  /**
   * An engineered silence. All buses to -inf — not a duck, not a filter.
   * Silence is a resource; the game spends it six times.
   */
  silence(t = 0.25) {
    this._ramp(this.master.gain, 0, t);
  }
  unsilence(t = 2) { this._ramp(this.master.gain, this.muted ? 0 : 0.9, t); }

  setMuted(m) {
    this.muted = m;
    if (this.ctx) this._ramp(this.master.gain, m ? 0 : 0.9, 0.3);
  }

  // ── wind ──────────────────────────────────────────────────────
  _buildWind() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.bBuf; src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.7;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 90;

    const g = ctx.createGain(); g.gain.value = 0;

    // two slow LFOs so the wind never gusts on a loop the ear can learn
    const lfo1 = ctx.createOscillator(); lfo1.frequency.value = 0.07;
    const lfo2 = ctx.createOscillator(); lfo2.frequency.value = 0.031;
    const la = ctx.createGain(); la.gain.value = 240;
    const lb = ctx.createGain(); lb.gain.value = 0.22;
    lfo1.connect(la).connect(bp.frequency);
    lfo2.connect(lb).connect(g.gain);
    lfo1.start(); lfo2.start();

    // "ear wind" layer — what sells altitude in ch02
    const ear = ctx.createBiquadFilter();
    ear.type = 'bandpass'; ear.frequency.value = 1900; ear.Q.value = 0.5;
    const earG = ctx.createGain(); earG.gain.value = 0;

    src.connect(hp).connect(bp).connect(g).connect(this.ambient);
    src.connect(ear).connect(earG).connect(this.ambient);
    src.start();

    this.wind = { g, bp, earG, base: 0 };
  }

  /** level 0..1, tone 0..1 (0 = low pressure/muffled, 1 = bright and thin) */
  setWind(level, tone = 0.5, t = 3) {
    if (!this.ready) return;
    this.wind.base = level;
    this._ramp(this.wind.g.gain, level * 0.5, t);
    this._ramp(this.wind.bp.frequency, 180 + tone * 900, t);
    this._ramp(this.wind.earG.gain, level * tone * 0.16, t);
  }

  // ── rain ──────────────────────────────────────────────────────
  _buildRain() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.nBuf; src.loop = true;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 800;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 6500;

    const g = ctx.createGain(); g.gain.value = 0;
    src.connect(hp).connect(lp).connect(g).connect(this.ambient);
    src.start();

    // a second, closer layer: rain on the player's own head
    const src2 = ctx.createBufferSource();
    src2.buffer = this.nBuf; src2.loop = true; src2.playbackRate.value = 0.7;
    const bp2 = ctx.createBiquadFilter();
    bp2.type = 'bandpass'; bp2.frequency.value = 2600; bp2.Q.value = 0.6;
    const g2 = ctx.createGain(); g2.gain.value = 0;
    src2.connect(bp2).connect(g2).connect(this.ambient);
    src2.start();

    this.rain = { g, g2, lp };
  }

  setRain(level, t = 3) {
    if (!this.ready) return;
    this._ramp(this.rain.g.gain, level * 0.32, t);
    this._ramp(this.rain.g2.gain, level * 0.14, t);
  }

  // ── the sub bed (the egg, felt not heard) ─────────────────────
  _buildSub() {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = 31;
    const g = ctx.createGain(); g.gain.value = 0;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.4;
    const la = ctx.createGain(); la.gain.value = 0.5;
    lfo.connect(la).connect(g.gain);
    o.connect(g).connect(this.ambient);
    o.start(); lfo.start();
    this.sub = { g, o };
  }
  setSub(level, t = 4) {
    if (!this.ready) return;
    this._ramp(this.sub.g.gain, level * 0.22, t);
  }

  // ── the pump organ ────────────────────────────────────────────
  _buildOrgan() {
    const ctx = this.ctx;
    this.organ = { voices: [], gain: ctx.createGain() };
    this.organ.gain.gain.value = 0;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1500; lp.Q.value = 0.4;
    this.organ.gain.connect(lp).connect(this.score);
    // organ also feeds the stone room a little
    lp.connect(this.stoneSend);

    // reedy: two slightly detuned saws per note, tremolo on top
    const trem = ctx.createOscillator(); trem.frequency.value = 4.6;
    const tremA = ctx.createGain(); tremA.gain.value = 0.055;
    const tremBase = ctx.createGain(); tremBase.gain.value = 1;
    trem.connect(tremA).connect(tremBase.gain);
    trem.start();
    tremBase.connect(this.organ.gain);
    this.organ.pre = tremBase;

    const mk = (freq) => {
      const a = ctx.createOscillator(); a.type = 'sawtooth'; a.frequency.value = freq;
      const b = ctx.createOscillator(); b.type = 'sawtooth'; b.frequency.value = freq * 1.006;
      const g = ctx.createGain(); g.gain.value = 0.09;
      a.connect(g); b.connect(g); g.connect(tremBase);
      a.start(); b.start();
      return { a, b, g, freq };
    };

    // D minor with a flat fifth
    this.organ.voices = [mk(NOTE.D2), mk(NOTE.D3), mk(NOTE.F3), mk(NOTE.Ab3)];
  }

  setOrgan(level, t = 6) {
    if (!this.ready) return;
    this._ramp(this.organ.gain.gain, level, t);
  }

  /** ch02 drops the chord a whole step. */
  transposeOrgan(semitones, t = 8) {
    if (!this.ready) return;
    const r = Math.pow(2, semitones / 12);
    this.organ.voices.forEach(v => {
      this._ramp(v.a.frequency, v.freq * r, t);
      this._ramp(v.b.frequency, v.freq * r * 1.006, t);
    });
  }

  /** ch05 reduces the chord to its own bare root. */
  organRootOnly(t = 8) {
    if (!this.ready) return;
    this.organ.voices.forEach((v, i) => this._ramp(v.g.gain, i === 0 ? 0.13 : 0, t));
  }

  /**
   * The one chord change in two and a half hours. Ab -> A.
   * It is not triumphant; it is the end of a suspension held since minute four.
   */
  resolveOrgan(t = 9) {
    if (!this.ready) return;
    this.organ.voices.forEach((v, i) => this._ramp(v.g.gain, 0.10, t * 0.5));
    const fifth = this.organ.voices[3];
    this._ramp(fifth.a.frequency, NOTE.A3, t);
    this._ramp(fifth.b.frequency, NOTE.A3 * 1.006, t);
  }

  // ── the female voice, as texture only ─────────────────────────
  _buildVoiceTexture() {
    const ctx = this.ctx;
    const g = ctx.createGain(); g.gain.value = 0;

    // two layers ~7 cents apart, so they beat at about 1.5 Hz.
    // It should read as tinnitus that happens to be beautiful.
    const mk = (f, detune) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      o.detune.value = detune;
      const fm = ctx.createBiquadFilter();       // a formant-ish peak
      fm.type = 'bandpass'; fm.frequency.value = f * 3.1; fm.Q.value = 5;
      const og = ctx.createGain(); og.gain.value = 0.5;
      o.connect(og).connect(g);
      const partial = ctx.createOscillator();
      partial.type = 'sine'; partial.frequency.value = f * 2.02; partial.detune.value = detune;
      const pg = ctx.createGain(); pg.gain.value = 0.12;
      partial.connect(pg).connect(g);
      o.start(); partial.start();
      return o;
    };
    mk(NOTE.A4 * 0.75, 0);
    mk(NOTE.A4 * 0.75, 7);

    g.connect(this.score);
    this.vox = { g };
  }
  setVoiceTexture(level, t = 6) {
    if (!this.ready) return;
    this._ramp(this.vox.g.gain, level * 0.06, t);
  }

  // ── one-shots ─────────────────────────────────────────────────

  /**
   * Bare feet. The most important sound in the game.
   * Each surface is its own filter shape — no shared sample pool.
   */
  step(surface = 'mud', vel = 1) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;

    const S = {
      mud:     { f: 300,  q: 1.1, d: 0.16, g: 0.42, type: 'lowpass',  wet: 0.5 },
      water:   { f: 1400, q: 0.7, d: 0.30, g: 0.40, type: 'bandpass', wet: 0.7 },
      grass:   { f: 2200, q: 0.5, d: 0.13, g: 0.24, type: 'highpass', wet: 0.1 },
      heather: { f: 2600, q: 0.4, d: 0.11, g: 0.22, type: 'highpass', wet: 0.0 },
      sand:    { f: 900,  q: 0.6, d: 0.19, g: 0.30, type: 'lowpass',  wet: 0.2 },
      scree:   { f: 1800, q: 1.6, d: 0.22, g: 0.34, type: 'bandpass', wet: 0.0 },
      slab:    { f: 700,  q: 2.4, d: 0.26, g: 0.36, type: 'bandpass', wet: 0.0 },
      wood:    { f: 420,  q: 3.6, d: 0.30, g: 0.40, type: 'bandpass', wet: 0.0 },
      stone:   { f: 560,  q: 2.0, d: 0.34, g: 0.34, type: 'bandpass', wet: 0.0 },
      ash:     { f: 1100, q: 0.5, d: 0.10, g: 0.20, type: 'lowpass',  wet: 0.0 },
      paper:   { f: 3200, q: 0.6, d: 0.07, g: 0.26, type: 'highpass', wet: 0.0 },
      // ch03's white: "a foot landing on nothing, recorded in an anechoic
      // chamber, and then made smaller"
      nothing: { f: 5200, q: 0.4, d: 0.035, g: 0.11, type: 'highpass', wet: 0.0 },
    }[surface] || { f: 600, q: 1, d: 0.2, g: 0.3, type: 'lowpass', wet: 0 };

    const src = ctx.createBufferSource();
    src.buffer = this.nBuf;
    src.playbackRate.value = 0.8 + Math.random() * 0.5;

    const f = ctx.createBiquadFilter();
    f.type = S.type; f.frequency.value = S.f * (0.85 + Math.random() * 0.3); f.Q.value = S.q;

    const g = ctx.createGain();
    const amp = S.g * vel * (0.8 + Math.random() * 0.4);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(amp, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + S.d);

    src.connect(f).connect(g).connect(this.foley);
    if (S.wet > 0) {
      const w = ctx.createGain(); w.gain.value = S.wet * 0.25;
      g.connect(w).connect(this.stoneSend);
    }
    src.start(t, Math.random() * 2);
    src.stop(t + S.d + 0.05);
  }

  /**
   * The knock. One fixed performance, never quantised.
   * Two libraries from the same takes: 'outside' (close, dry, hand-flesh in
   * it) and 'inside' (re-amped through a door, heard from a stone room).
   */
  knock(side = 'inside', vel = 1) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;
    const inside = side === 'inside';

    // body: a struck resonant panel
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(inside ? 96 : 132, t);
    o.frequency.exponentialRampToValueAtTime(inside ? 47 : 62, t + 0.09);

    const og = ctx.createGain();
    og.gain.setValueAtTime(0, t);
    og.gain.linearRampToValueAtTime(0.5 * vel, t + 0.004);
    og.gain.exponentialRampToValueAtTime(0.0001, t + (inside ? 0.34 : 0.19));

    // knuckle: a short filtered noise transient
    const n = ctx.createBufferSource();
    n.buffer = this.nBuf;
    n.playbackRate.value = 1 + Math.random() * 0.3;
    const nf = ctx.createBiquadFilter();
    nf.type = inside ? 'lowpass' : 'bandpass';
    nf.frequency.value = inside ? 900 : 2100;
    nf.Q.value = 1.2;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0, t);
    ng.gain.linearRampToValueAtTime(0.3 * vel, t + 0.003);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

    const out = ctx.createGain();
    out.gain.value = inside ? 0.8 : 1.0;
    o.connect(og).connect(out);
    n.connect(nf).connect(ng).connect(out);
    out.connect(this.foley);
    if (inside) { const w = ctx.createGain(); w.gain.value = 0.6; out.connect(w).connect(this.stoneSend); }

    o.start(t); o.stop(t + 0.45);
    n.start(t, Math.random()); n.stop(t + 0.1);
  }

  /** The Cut. A large-format shutter, slowed 30%, with a wet click in it. */
  shutter() {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;

    const n = ctx.createBufferSource();
    n.buffer = this.nBuf; n.playbackRate.value = 0.42;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.setValueAtTime(2400, t);
    f.frequency.exponentialRampToValueAtTime(320, t + 0.22);
    f.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

    const click = ctx.createOscillator();
    click.type = 'triangle';
    click.frequency.setValueAtTime(180, t);
    click.frequency.exponentialRampToValueAtTime(60, t + 0.05);
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.34, t);
    cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    n.connect(f).connect(g).connect(this.foley);
    click.connect(cg).connect(this.foley);
    n.start(t); n.stop(t + 0.35);
    click.start(t); click.stop(t + 0.12);
  }

  /** Prepared piano — screws and felt, no bright strikes. */
  piano(freq = NOTE.D4, vel = 0.5) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;
    const out = ctx.createGain(); out.gain.value = vel * 0.5;
    out.connect(this.score);
    const w = ctx.createGain(); w.gain.value = 0.35; out.connect(w).connect(this.stoneSend);

    // inharmonic partials — the preparation
    [[1, 1], [2.41, 0.32], [3.78, 0.18], [5.13, 0.09]].forEach(([mult, amp], i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'triangle' : 'sine';
      o.frequency.value = freq * mult;
      const g = ctx.createGain();
      const d = 1.9 / (1 + i * 0.9);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(out);
      o.start(t); o.stop(t + d + 0.1);
    });
    // felt: a damped thud
    const n = ctx.createBufferSource(); n.buffer = this.nBuf; n.playbackRate.value = 0.5;
    const nf = ctx.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 380;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.2, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    n.connect(nf).connect(ng).connect(out);
    n.start(t, Math.random()); n.stop(t + 0.2);
  }

  /** Bowed double bass — slow attack, no articulation. */
  bass(freq = NOTE.D2, dur = 7, vel = 0.5) {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq;
    const o2 = ctx.createOscillator(); o2.type = 'sawtooth'; o2.frequency.value = freq * 1.004;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.Q.value = 3;
    lp.frequency.setValueAtTime(180, t);
    lp.frequency.linearRampToValueAtTime(620, t + dur * 0.4);
    lp.frequency.linearRampToValueAtTime(220, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel * 0.24, t + dur * 0.35);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(lp); o2.connect(lp); lp.connect(g).connect(this.score);
    o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
  }

  /** Contact-mic'd stone. Used for the closing walls and the collapse. */
  grind(level, t = 2) {
    if (!this.ready) return;
    if (!this._grind) {
      const ctx = this.ctx;
      const src = ctx.createBufferSource(); src.buffer = this.bBuf; src.loop = true;
      src.playbackRate.value = 0.35;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 74; bp.Q.value = 2;
      const g = ctx.createGain(); g.gain.value = 0;
      src.connect(lp).connect(g).connect(this.ambient);
      src.connect(bp).connect(g);
      src.start();
      this._grind = g;
    }
    this._ramp(this._grind.gain, level * 0.5, t);
  }

  /** Ceramic — the only pleasant noise in the game. */
  cup() {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;
    [1810, 2740, 4100].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16 / (i + 1), t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9 / (i + 1));
      o.connect(g).connect(this.foley);
      o.start(t); o.stop(t + 1.1);
    });
  }

  /** Stone on stone — the cairns. */
  stoneSet() {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;
    const n = ctx.createBufferSource(); n.buffer = this.nBuf;
    n.playbackRate.value = 0.55 + Math.random() * 0.3;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 380 + Math.random() * 260; f.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    n.connect(f).connect(g).connect(this.foley);
    n.start(t, Math.random()); n.stop(t + 0.6);
  }

  /** The swallow. Plays over the Cut and continues after it. */
  swallow() {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(320, t + 0.15);
    o.frequency.exponentialRampToValueAtTime(70, t + 3.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.13, t + 0.3);
    g.gain.linearRampToValueAtTime(0.0001, t + 3.8);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
    o.connect(lp).connect(g).connect(this.foley);
    o.start(t); o.stop(t + 4);
    // the click at the back of the throat
    const n = ctx.createBufferSource(); n.buffer = this.nBuf; n.playbackRate.value = 1.6;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 1500;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.22, t + 0.1);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    n.connect(nf).connect(ng).connect(this.foley);
    n.start(t + 0.1); n.stop(t + 0.3);
  }

  /** White noise as a substance, not a stinger. ch04's "White noise." */
  whiteNoise(level, t = 0.2) {
    if (!this.ready) return;
    if (!this._wn) {
      const ctx = this.ctx;
      const src = ctx.createBufferSource(); src.buffer = this.nBuf; src.loop = true;
      const g = ctx.createGain(); g.gain.value = 0;
      src.connect(g).connect(this.ambient);
      src.start();
      this._wn = g;
    }
    this._ramp(this._wn.gain, level * 0.3, t);
  }

  /** Everything at once, 100 ms, then gone. The burst. */
  burst() {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;
    const n = ctx.createBufferSource(); n.buffer = this.nBuf; n.playbackRate.value = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.85, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    n.connect(g).connect(this.master);
    n.start(t); n.stop(t + 0.2);
    this.bass(NOTE.D2, 0.6, 1.0);
    this.piano(NOTE.D4, 1.0);
  }

  /**
   * ch03: "The white hit me back."
   * A reversed swell — rising envelope, opening filter, cut dead at the peak.
   */
  reverseHit() {
    if (!this.ready || this.muted) return;
    const ctx = this.ctx, t = this.now;
    const n = ctx.createBufferSource();
    n.buffer = this.nBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(200, t);
    f.frequency.exponentialRampToValueAtTime(7000, t + 0.4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.6, t + 0.4);   // reversed envelope
    g.gain.linearRampToValueAtTime(0, t + 0.44);
    n.connect(f).connect(g).connect(this.master);
    n.start(t); n.stop(t + 0.5);
  }

  setStone(level, t = 2) {
    if (!this.ready) return;
    this._ramp(this.stoneSend.gain, level, t);
  }
  setScore(level, t = 4)   { if (this.ready) this._ramp(this.score.gain, level, t); }
  setAmbient(level, t = 3) { if (this.ready) this._ramp(this.ambient.gain, level, t); }
}

export const AUDIO_NOTES = NOTE;
