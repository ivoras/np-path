// THE PATH — bootstrap and chapter manager.

import * as THREE from 'three';
import { Post } from './engine/post.js';
import { Audio } from './engine/audio.js';
import { Player } from './engine/player.js';
import { VO, wait as sleep } from './engine/vo.js';
import { disposeTree, C } from './engine/world.js';
import { save } from './engine/save.js';
import { Menu } from './engine/menu.js';
import { TouchControls, isTouchDevice } from './engine/touch.js';
import { Q, applyTier } from './engine/quality.js';

import ch01 from './chapters/ch01.js';
import ch02 from './chapters/ch02.js';
import ch03 from './chapters/ch03.js';
import ch04 from './chapters/ch04.js';
import ch05 from './chapters/ch05.js';
import ch06 from './chapters/ch06.js';
import ch07 from './chapters/ch07.js';

const CHAPTERS = [ch01, ch02, ch03, ch04, ch05, ch06, ch07];

// ─────────────────────────────────────────────────────────────────
// The gate.
//
// This is a doorbell, not a lock. The page is static and public, so the check
// runs on the visitor's own machine and everything it guards is already in
// their browser. Hashing the phrase keeps it out of a casual "view source",
// and that is the whole of what it does. Anything that actually needs to be
// secret does not belong on a GitHub Pages site.
// ─────────────────────────────────────────────────────────────────
const PHRASE_SHA256 = 'c68d53d2857db9a60d3123af541188b6837aec4401e74a8f742da315e1b86804';

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const $ = (id) => document.getElementById(id);

function initGate() {
  const gate = $('gate'), form = $('gate-form'), input = $('gate-input'), err = $('gate-err');

  if (sessionStorage.getItem('path.open') === '1') { gate.classList.add('hidden'); openTitle(); return; }

  setTimeout(() => { if (!touchMode) input.focus(); }, 400);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = input.value.trim().toLowerCase();
    let ok = false;
    try {
      ok = (await sha256(v)) === PHRASE_SHA256;
    } catch {
      ok = false;     // crypto.subtle needs a secure context
    }
    if (ok) {
      try { sessionStorage.setItem('path.open', '1'); } catch {}
      input.blur();
      gate.style.transition = 'opacity 1.6s ease';
      gate.style.opacity = '0';
      setTimeout(() => { gate.classList.add('hidden'); openTitle(); }, 1600);
    } else {
      gate.classList.add('wrong');
      err.textContent = 'The path is. This is not.';
      err.classList.add('show');
      input.value = '';
      setTimeout(() => gate.classList.remove('wrong'), 500);
    }
  });
}

// ─────────────────────────────────────────────────────────────────
// The cover, drawn to canvas — the book's own composition, live.
// ─────────────────────────────────────────────────────────────────
function drawCover() {
  const cv = $('cover');
  const fit = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = innerWidth, H = innerHeight;

    const sky = g.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#12332f');
    sky.addColorStop(0.52, '#0f2a29');
    sky.addColorStop(1, '#0a1513');
    g.fillStyle = sky; g.fillRect(0, 0, W, H);

    const hx = W / 2, hy = H * 0.52;

    // the black disc that is not the sun
    g.fillStyle = '#0a1412';
    g.beginPath(); g.arc(hx, hy - H * 0.12, Math.min(W, H) * 0.20, 0, 6.29); g.fill();

    // the moor
    g.fillStyle = '#0b1614';
    g.beginPath();
    g.moveTo(0, hy);
    for (let x = 0; x <= W; x += 12) {
      g.lineTo(x, hy + Math.sin(x * 0.006) * 14 + Math.sin(x * 0.021) * 6);
    }
    g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();

    // the path, converging, ember-rimmed
    const grd = g.createLinearGradient(0, hy, 0, H);
    grd.addColorStop(0, '#e0762a');
    grd.addColorStop(1, '#b8571c');
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(hx - 6, hy); g.lineTo(hx + 6, hy);
    g.lineTo(W * 0.78, H); g.lineTo(W * 0.22, H);
    g.closePath(); g.fill();

    g.fillStyle = '#ede2c2';
    g.beginPath();
    g.moveTo(hx - 3, hy); g.lineTo(hx + 3, hy);
    g.lineTo(W * 0.70, H); g.lineTo(W * 0.30, H);
    g.closePath(); g.fill();

    // the egg, cracked, in the disc
    const er = Math.min(W, H) * 0.175;
    const ey = hy - H * 0.135;
    g.fillStyle = '#ede2c2';
    for (const s of [-1, 1]) {
      g.beginPath();
      g.ellipse(hx + s * er * 0.13, ey, er * 0.62, er * 0.94, 0, 0, 6.29);
      g.fill();
    }
    g.fillStyle = '#0a1412';
    g.beginPath();
    g.moveTo(hx, ey - er);
    for (let y = -er; y <= er; y += er / 7) {
      g.lineTo(hx + Math.sin(y * 0.09) * er * 0.055, ey + y);
    }
    g.lineTo(hx + er * 0.05, ey + er); g.lineTo(hx - er * 0.05, ey + er);
    g.closePath(); g.fill();

    // the lone figure, and a long shadow pointing back
    const fy = H * 0.82, fh = H * 0.075;
    g.fillStyle = 'rgba(11,22,20,.55)';
    g.beginPath(); g.ellipse(hx, fy + fh * 0.5, fh * 0.20, fh * 0.7, 0, 0, 6.29); g.fill();
    g.fillStyle = '#3a2a1a';
    g.fillRect(hx - fh * 0.10, fy - fh * 0.62, fh * 0.20, fh * 0.62);
    g.beginPath(); g.arc(hx, fy - fh * 0.70, fh * 0.10, 0, 6.29); g.fill();

    // grain
    const img = g.getImageData(0, 0, cv.width, cv.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 26;
      d[i] += n; d[i + 1] += n * 0.9; d[i + 2] += n * 0.8;
    }
    g.putImageData(img, 0, 0);

    g.strokeStyle = '#2a2a22'; g.lineWidth = Math.min(W, H) * 0.035;
    g.strokeRect(0, 0, W, H);

    // darken behind the menu so the type always reads
    const veil = g.createLinearGradient(0, 0, 0, H);
    veil.addColorStop(0, 'rgba(11,22,20,.35)');
    veil.addColorStop(0.4, 'rgba(11,22,20,.72)');
    veil.addColorStop(1, 'rgba(11,22,20,.85)');
    g.fillStyle = veil; g.fillRect(0, 0, W, H);
  };
  fit();
  addEventListener('resize', fit);
}

// ─────────────────────────────────────────────────────────────────
// Game state
// ─────────────────────────────────────────────────────────────────
let renderer, camera, post, audio, player, vo, scene, menu, touch;
let clock, running = false, current = null, booted = false;
let chapterIndex = 0, chapterToken = 0, paused = false;
const input = { held: false, pressed: false };

const touchMode = isTouchDevice(save.settings);

function openTitle() {
  if (!menu) initMenu();

  // ?ch=4 jumps straight to a chapter, bypassing the menu. A convenience for
  // a two-and-a-half-hour game, and how the scenes get smoke-tested.
  const q = parseInt(new URLSearchParams(location.search).get('ch') || '', 10);
  if (Number.isFinite(q) && q >= 1 && q <= CHAPTERS.length && !openTitle._jumped) {
    openTitle._jumped = true;              // only on the first visit to the title
    $('title').classList.add('hidden');
    startGame(q);
    return;
  }

  $('title').classList.remove('hidden');
  $('title').style.opacity = '1';
  drawCover();
  menu.main();
}

function initMenu() {
  menu = new Menu($('menu-root'), $('pause-root'));

  menu.onNew = () => { save.clearProgress(); startGame(1); };
  menu.onContinue = () => startGame(save.furthest);
  menu.onStartFrom = (n) => startGame(n);
  menu.onResume = () => setPaused(false);
  menu.onQuitToMain = () => quitToMain();
  menu.onSettingChange = (key) => applySettings(key);

  applySettings('*');
}

/** One place where a settings change reaches the running game. */
function applySettings(key) {
  const s = save.settings;
  document.documentElement.style.setProperty('--text-scale', s.textScale);

  if (audio?.ready) {
    audio.setMuted(s.muted);
    audio.setVolume(s.volume);
  }
  if (player) {
    player.fovTarget = s.fov;
  }
  if (post) {
    post.setPrintScale(s.printEffects);
  }
  if (touch) {
    touch.setHanded(s.leftHanded);
    if (isTouchDevice(s)) { if (running && !paused) touch.show(); }
    else touch.hide();
  }
  if (key === 'quality') applyTier(s.quality);   // takes effect next chapter
}

// ─────────────────────────────────────────────────────────────────
async function boot() {
  if (booted) return;
  booted = true;

  applyTier(save.settings.quality);

  renderer = new THREE.WebGLRenderer({
    canvas: $('scene'), antialias: false, powerPreference: 'high-performance',
  });
  renderer.setClearColor(new THREE.Color(C.moor));
  renderer.shadowMap.enabled = Q.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera = new THREE.PerspectiveCamera(save.settings.fov, innerWidth / innerHeight, 0.08, 900);
  scene = new THREE.Scene();
  post = new Post(renderer, scene, camera);

  audio = new Audio();
  audio.init();
  audio.resume();

  player = new Player(camera, $('scene'));
  player.touchMode = touchMode;
  vo = new VO($('vo'), $('card'), $('chapter-title'), $('hint'), $('flash'));

  if (touchMode || save.settings.forceTouch) {
    touch = new TouchControls($('touch-root'), save.settings);
    touch.onPause = () => setPaused(true);
    touch.setHanded(save.settings.leftHanded);
    player.touch = touch;
  }

  clock = new THREE.Clock();
  running = true;

  addEventListener('resize', onResize);
  addEventListener('orientationchange', () => setTimeout(onResize, 250));

  // ── action input: E, Space, Enter, or the mouse ──────────────
  const codes = ['KeyE', 'Space', 'Enter'];
  addEventListener('keydown', (e) => {
    if (e.code === 'Escape') { e.preventDefault(); togglePause(); return; }
    if (paused || !codes.includes(e.code)) return;
    if (!input.held) input.pressed = true;
    input.held = true;
  });
  addEventListener('keyup', (e) => { if (codes.includes(e.code)) input.held = false; });
  addEventListener('mousedown', () => {
    if (paused || touchMode) return;
    if (!input.held) input.pressed = true;
    input.held = true;
  });
  addEventListener('mouseup', () => { input.held = false; });

  addEventListener('keydown', (e) => {
    if (e.code === 'KeyM') { save.set('muted', !save.settings.muted); applySettings('muted'); }
  });

  // a phone that locks or backgrounds should not keep the drone running
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running && !paused) setPaused(true);
  });

  applySettings('*');
  loop();
}

function onResize() {
  if (!camera) return;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  post.resize();
  checkOrientation();
}

function checkOrientation() {
  const portrait = innerHeight > innerWidth;
  $('rotate').classList.toggle('hidden', !(touchMode && portrait && running));
}

// ─────────────────────────────────────────────────────────────────
async function startGame(chapter) {
  const t = $('title');
  t.style.transition = 'opacity 1.4s ease';
  t.style.opacity = '0';
  setTimeout(() => t.classList.add('hidden'), 1400);
  $('hud').classList.remove('hidden');

  await boot();
  audio.resume();
  audio.fadeIn(4);
  if (touch) touch.show();
  checkOrientation();

  runChapter(Math.min(Math.max(chapter, 1), CHAPTERS.length) - 1);
}

function quitToMain() {
  chapterToken++;                       // orphan any in-flight chapter script
  paused = false;
  player?.setPaused(false);
  player?.disable();
  if (touch) touch.hide();
  audio?.fadeOut(1.2);
  vo?.clear();
  vo?.clearHint();
  $('hud').classList.add('hidden');
  $('rotate').classList.add('hidden');
  document.getElementById('credits')?.remove();
  if (current) {
    current.chapter.dispose?.(current.ctx);
    [...scene.children].forEach(disposeTree);
    current = null;
  }
  post?.set('uFade', 1);
  openTitle();
}

function togglePause() {
  if (!running || !current) return;
  setPaused(!paused);
}

function setPaused(p) {
  if (!current) return;
  paused = p;
  player.setPaused(p);
  if (p) {
    audio?.fadeOut(0.4);
    if (touch) touch.hide();
    menu.pause();
  } else {
    menu.closeAll();
    audio?.unsilence(0.8);
    if (touch && isTouchDevice(save.settings)) touch.show();
  }
}

// ── ctx helpers the chapter scripts run on ─────────────────────
function makeCtx(chapter, token) {
  const alive = () => running && token === chapterToken;
  return {
    THREE, scene, camera, renderer, post, audio, player, vo, chapter,
    get isTouch() { return !!touch?.enabled; },
    get actionHeld() { return input.held || !!touch?.actHeld; },
    get actionPressed() { return input.pressed || !!touch?.actPressed; },

    /**
     * Pause-aware wait. Measured in real elapsed time, not frames — a
     * per-frame decrement would stretch every timed beat in the game on a
     * slow device, and this game is built out of timed beats.
     */
    wait: (s) => new Promise((resolve) => {
      let left = s * 1000;
      let last = performance.now();
      const tick = (now) => {
        if (!alive()) return resolve();
        const dt = now - last;
        last = now;
        if (!paused) left -= dt;
        if (left <= 0) return resolve();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }),

    until: (fn) => new Promise((resolve) => {
      const check = () => {
        if (!alive()) return resolve();
        if (!paused && fn()) return resolve();
        requestAnimationFrame(check);
      };
      check();
    }),

    /** The Cut. One frame of bone white; look-direction is preserved. */
    cut: async () => {
      audio.shutter();
      vo.flash(0.06);
      await sleep(0.14);
    },

    fade: (to, dur = 2) => new Promise((resolve) => {
      const from = post.get('uFade');
      const t0 = performance.now();
      const tick = () => {
        if (!alive()) return resolve();
        const k = Math.min(1, (performance.now() - t0) / (dur * 1000));
        post.set('uFade', from + (to - from) * k);
        k < 1 ? requestAnimationFrame(tick) : resolve();
      };
      tick();
    }),

    fadeWhite: (to, dur = 2) => new Promise((resolve) => {
      const from = post.get('uWhiteFade');
      const t0 = performance.now();
      const tick = () => {
        if (!alive()) return resolve();
        const k = Math.min(1, (performance.now() - t0) / (dur * 1000));
        post.set('uWhiteFade', from + (to - from) * k);
        k < 1 ? requestAnimationFrame(tick) : resolve();
      };
      tick();
    }),
  };
}

async function runChapter(i) {
  chapterIndex = i;
  const chapter = CHAPTERS[i];
  if (!chapter) return theEnd();

  const token = ++chapterToken;

  // ── tear down ────────────────────────────────────────────────
  if (current) {
    current.chapter.dispose?.(current.ctx);
    [...scene.children].forEach(disposeTree);
    vo.clear();
    vo.clearHint();
  }

  scene = new THREE.Scene();
  post.setScene(scene);
  post.set('uFade', 1);
  post.set('uWhiteFade', 0);

  const ctx = makeCtx(chapter, token);
  current = { chapter, ctx };

  save.reach(i + 1);

  player.onStep = (e) => {
    audio.step(e.surface, e.vel);
    chapter.onStep?.(e);
  };

  chapter.build(ctx);
  applySettings('*');            // the chapter may have changed the camera

  await vo.title(chapter.title, 3.2);
  if (token !== chapterToken) return;
  await ctx.fade(0, 3);

  try {
    await chapter.run(ctx);
  } catch (err) {
    console.error(`[${chapter.id}]`, err);
  }
  if (token !== chapterToken) return;

  // ── coda ─────────────────────────────────────────────────────
  save.complete(i + 1);
  player.disable();
  await ctx.fade(1, 3);
  await sleep(1);
  if (token !== chapterToken) return;

  if (chapter.coda) {
    await vo.card(chapter.coda, {
      invert: !!chapter.codaInvert,
      bigFirst: !!chapter.codaBigFirst,
      hold: 5,
    });
  }
  if (token !== chapterToken) return;

  vo.clear();
  post.set('uWhiteFade', 0);
  player.enable();
  runChapter(i + 1);
}

async function theEnd() {
  player.disable();
  if (touch) touch.hide();
  audio.setScore(0, 4);
  audio.setWind(0, 3);

  const el = document.createElement('div');
  el.id = 'credits';
  el.innerHTML = `
    <div class="cr-title">THE PATH</div>
    <div class="cr-mark">TLLOA</div>
    <div class="cr-line">adapted as a walking simulator</div>
    <div class="cr-line">all text verbatim from the source</div>`;
  el.style.opacity = '0';
  el.style.transition = 'opacity 4s ease';
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; });

  // credits roll in silence over the sound of rain on mud, unbroken
  audio.setRain(0.85, 3);
  await sleep(26);
  audio.fadeOut(0.1);            // cut off, mid-fall, at the last frame

  el.innerHTML += `<div class="cr-line" style="margin-top:2rem">The path is.</div>`;
  const back = document.createElement('button');
  back.className = 'menu-item quiet';
  back.style.marginTop = '2rem';
  back.textContent = 'main menu';
  back.addEventListener('click', () => { el.remove(); quitToMain(); });
  el.appendChild(back);
}

// ── the loop ────────────────────────────────────────────────────
/**
 * On desktop, looking does nothing until the pointer is locked, and nothing on
 * screen says so — a player who never clicks the canvas concludes the mouse is
 * broken. Say it, quietly, until they do.
 */
let _hintShown = false;
function pointerHint() {
  if (!current || paused || touchMode) return;
  const need = !player.pointerLocked && player.enabled;
  if (need === _hintShown) return;
  _hintShown = need;
  if (need) vo.hint('click to look around', 60);
  else vo.clearHint();
}

function loop() {
  requestAnimationFrame(loop);
  if (!running) return;

  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  if (!paused) {
    player.update(dt);
    vo.update(dt);
    pointerHint();
    current?.chapter.update?.(dt, current.ctx);
  }
  post.update(dt, elapsed);
  post.render();

  input.pressed = false;         // edge-triggered, consumed once per frame
  touch?.endFrame();
}

initGate();
