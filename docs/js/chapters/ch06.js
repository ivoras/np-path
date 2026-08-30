// ── 06 · ABSENCE ────────────────────────────────────────────────
// Eleven lines of source. Nine minutes. The thinnest chapter in the game, and
// its brevity is its content.
//
// Puzzle: The Crooked Line. The white ground comes away where you walk. You
// are not drawing the path — you are wearing it. And the game will not let you
// make it straight, because a person walking cannot.
//
// This is the only chapter that world-locks the paper tooth: everywhere else
// the grain sits on the glass in front of the world; here you walk on it.

import * as THREE from 'three';
import { C, unlit, clamp, lerp } from '../engine/world.js';

const FRAGMENTS = [
  { x:   0, z:  10, len: 8 },
  { x:  22, z:  44, len: 7 },
  { x: -19, z:  70, len: 9 },
  { x:  14, z: 104, len: 6 },
  { x:  -6, z: 138, len: 8 },
];

export default {
  id: 'ch06',
  title: 'ABSENCE',
  coda: null,                      // the book gives ABSENCE no coda, and neither do we

  build(ctx) {
    const { scene, player } = ctx;
    this.t = 0;
    this.visited = new Set();
    this.marked = false;

    // No fog. No sky gradient. No light in the physical sense — ground, sky
    // and hands all sit at exactly the same value. The image is literally flat.
    scene.fog = null;
    scene.background = new THREE.Color(C.bone);

    // ── the sheet ────────────────────────────────────────────────
    // The erasure mask: white on top, moor black underneath. Walking wears
    // the white off. The path was never drawn onto the world — it was worn
    // into it.
    const S = 2048;   // 400 world units across — coarser and the line is a smear
    this.cv = document.createElement('canvas');
    this.cv.width = this.cv.height = S;
    this.cx = this.cv.getContext('2d');

    // start fully white, with paper tooth baked in — world-locked, for once
    this.cx.fillStyle = '#EDE2C2';
    this.cx.fillRect(0, 0, S, S);
    const img = this.cx.getImageData(0, 0, S, S);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 16;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    this.cx.putImageData(img, 0, 0);

    // the five fragments, already drawn, unconnected, ending mid-stroke
    this.cx.strokeStyle = '#0B1614';
    this.cx.lineCap = 'round';
    FRAGMENTS.forEach((f, i) => {
      const [u, v] = this.toUV(f.x, f.z);
      this.cx.lineWidth = 10;
      this.cx.beginPath();
      this.cx.moveTo(u, v - f.len * 2.4);
      this.cx.lineTo(u + (i % 2 ? 5 : -5), v + f.len * 2.4);
      this.cx.stroke();
    });

    this.tex = new THREE.CanvasTexture(this.cv);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.minFilter = THREE.LinearFilter;

    const sheet = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshBasicMaterial({ map: this.tex, fog: false })
    );
    sheet.rotation.x = -Math.PI / 2;
    sheet.position.set(0, 0, 80);
    scene.add(sheet);
    this.sheet = sheet;

    // ── the two objects ──────────────────────────────────────────
    // A cup and a pebble, from the turret. They cast small, precise, hard
    // shadows — drawn shadows, with no penumbra — and the player casts none.
    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.10, 0.075, 0.13, 14),
      unlit(C.bone, { fog: false })
    );
    cup.rotation.z = Math.PI / 2 - 0.2;
    cup.position.set(3.4, 0.07, 62);
    scene.add(cup);
    const cupSh = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.14), unlit(C.moor, { fog: false }));
    cupSh.rotation.x = -Math.PI / 2;
    cupSh.position.set(3.75, 0.012, 62);
    scene.add(cupSh);
    this.cup = cup;

    const peb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 1), unlit(C.bone, { fog: false }));
    peb.position.set(-2.6, 0.06, 96);
    scene.add(peb);
    const pebSh = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.09), unlit(C.moor, { fog: false }));
    pebSh.rotation.x = -Math.PI / 2;
    pebSh.position.set(-2.4, 0.012, 96);
    scene.add(pebSh);
    this.peb = peb;

    // there is no pick-up interaction. They are simply there.

    player.groundAt = () => 0;
    player.surfaceAt = () => 'paper';
    player.teleport(0, 0, Math.PI);
    player.eyeHeight = 2.40;
    // a person cannot walk a straight line, and there is nothing to sight on
    player.headingNoise = 0.028;

    ctx.post.set('uBitonal', 1);         // two values, nothing between
    ctx.post.set('uPosterize', 2);
    ctx.post.set('uVignette', 0);        // the image bleeds to the frame edge
    ctx.post.set('uMisreg', 0);          // a two-plate image has nothing to misregister
    ctx.post.set('uGrain', 0.0);         // the tooth is on the floor now, not the glass
    ctx.post.set('uPaletteMix', 1.0);
    ctx.post.setBloom(0);                // nothing here glows
  },

  toUV(x, z) {
    // world -> canvas. The sheet is 400 wide, centred on (0, 80).
    return [(x + 200) / 400 * 2048, (z - 80 + 200) / 400 * 2048];
  },

  erase(x, z, r = 9) {
    const [u, v] = this.toUV(x, z);
    const cx = this.cx;
    // irregular patches from a small set of shapes — no two footfalls alike
    cx.fillStyle = '#0B1614';
    cx.beginPath();
    const n = 7;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      const rr = r * (0.62 + Math.random() * 0.6);
      const px = u + Math.cos(a) * rr, py = v + Math.sin(a) * rr;
      i === 0 ? cx.moveTo(px, py) : cx.lineTo(px, py);
    }
    cx.closePath();
    cx.fill();
    this.tex.needsUpdate = true;
    this.marked = true;
  },

  async run(ctx) {
    const { vo, audio, player, post, until, wait } = ctx;

    // no ambient, no wind, no drone, no room tone, no breath.
    // Chapter 06 has no music of any kind.
    audio.setScore(0, 2);
    audio.setOrgan(0, 2);
    audio.setAmbient(0.55, 2);
    audio.setWind(0, 0.5, 2);
    audio.setRain(0, 1);
    audio.setStone(0, 2);
    audio.setSub(0, 2);
    player.enable();

    // before the player has understood what they just did
    await until(() => this.marked);
    vo.say('Erase.', { hold: 4 });

    // the realisation is the whole first minute, and it happens in silence
    await until(() => {
      const f = player.forward;
      return player.distance > 6;
    });
    await wait(2);
    vo.say('Redraw.', { hold: 4 });

    // then four minutes of no VO at all while they work it out
    await until(() => this.visited.size >= 2);
    vo.say('A crooked line.', { hold: 5 });          // not a judgement

    await until(() => this.visited.size >= 4);
    vo.say('I was. I am. I will be.', { hold: 6 });  // three tenses, one breath

    await until(() => this.visited.size >= 5);
    // note the inversion — not "a cause to an effect". Do not let it be fixed.
    vo.say('An effect to a cause.', { hold: 6 });
    this.running = true;                             // the erasure runs on alone
    await wait(7);

    vo.say('A cup.', { hold: 3 });
    await wait(3.4);
    vo.say('A pebble.', { hold: 3 });
    await wait(3.4);
    vo.say('Residue.', { hold: 4 });
    await wait(5);

    // the white gives out; fade up to bone, not down to black
    player.canMove = false;
    vo.say('I yield.', { hold: 5 });
    await ctx.fadeWhite(1, 11);
    audio.silence(1.5);

    // eleven seconds of bone white, silent, with no type at all.
    // Players will expect the coda card. Its absence is the card.
    await wait(11);
  },

  update(dt, ctx) {
    this.t += dt;
    const { player, vo } = ctx;
    this._lastInput = player.inputMag;

    // fragments the player has reached
    FRAGMENTS.forEach((f, i) => {
      if (this.visited.has(i)) return;
      if (Math.hypot(player.pos.x - f.x, player.pos.z - f.z) < 3.4) {
        this.visited.add(i);
        ctx.audio.step('paper', 0.4);
      }
    });

    // the erasure continues on its own, past a horizon that does not exist
    if (this.running) {
      this._r = (this._r || 0) + dt * 9;
      this.erase(player.pos.x + Math.sin(this._r * 0.2) * 2, player.pos.z + this._r, 7);
      this.erase(player.pos.x - Math.sin(this._r * 0.2) * 2, player.pos.z - this._r, 7);
    }

    // assists: a camera drift to the feet, then one fragment darkening
    this._idle = this.marked ? 0 : (this._idle || 0) + dt;
    if (this._idle > 90 && !this._a1) {
      this._a1 = true;
      vo.hint('look down', 4);
    }
    if (this.visited.size >= 3) {
      this._stall = (this._stall || 0) + dt;
      if (this._stall > 180 && !this._a2) {
        this._a2 = true;
        const next = FRAGMENTS.findIndex((f, i) => !this.visited.has(i));
        if (next >= 0) {
          const [u, v] = this.toUV(FRAGMENTS[next].x, FRAGMENTS[next].z);
          this.cx.globalAlpha = 0.15;
          this.cx.fillStyle = '#0B1614';
          this.cx.fillRect(u - 40, v - 40, 80, 80);
          this.cx.globalAlpha = 1;
          this.tex.needsUpdate = true;
        }
      }
    }
  },

  onStep(e) {
    // the mark is permanent. Nothing regenerates, and there is no undo.
    // Walking slowly wears more; a good line needs the same deliberate,
    // unnatural gait as ch04 — and the game does not explain the joke.
    // walking slowly wears more; a good line needs a deliberate gait
    const r = lerp(7.5, 3.4, this._lastInput ?? 0.5);
    this.erase(e.x, e.z, r);
  },

  dispose(ctx) {
    ctx.player.headingNoise = 0;
    ctx.player.canMove = true;
    ctx.post.set('uBitonal', 0);
    ctx.post.setBloom(0.62);
    ctx.post.set('uPosterize', 24);
    ctx.post.set('uVignette', 0.72);      // returns heavier than it has ever been
    ctx.post.set('uGrain', 0.09);
    ctx.post.set('uPaletteMix', 0.85);
    ctx.scene.background = null;
  },
};
