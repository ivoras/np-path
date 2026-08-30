// ── 03 · INVERSION ──────────────────────────────────────────────
// "The player finds out they have been playing both sides of a locked door."
//
// Puzzle: The Knock. Reproduce, from memory, the rhythm the Watcher has been
// tormented by for two chapters. Not memorisation — recognition. Getting it
// right opens nothing: the door does not answer. Solving it correctly changes
// nothing, which is the game's central cruelty and its central honesty.

import * as THREE from 'three';
import {
  C, matte, unlit, makeSky, makeLights, makeTerrain, makeFigure, makePebble,
  mulberry, clamp, lerp,
} from '../engine/world.js';
import { noise } from '../lib/noise.js';

// knock · knock-knock ············· knock
const PATTERN = [0, 0.75, 1.05, 3.40];
const TOL = 0.18;

export default {
  id: 'ch03',
  title: 'INVERSION',
  coda: ['A tea for two.', 'Pebble eaters.', 'Contractions.'],
  codaInvert: true,

  build(ctx) {
    const { scene, player } = ctx;
    this.phase = 'door';
    this.t = 0;

    scene.fog = new THREE.FogExp2(new THREE.Color(C.moor).getHex(), 0.062);
    this.sky = makeSky(scene, { low: C.moor, mid: C.moor, high: C.petrol, power: 1.6 });
    // The darkest scene in the game — value range compressed to the bottom of
    // the histogram, and held there for seven minutes so the eye fully adapts
    // before the white. But the door still has to read: it is the only thing
    // the player can act on.
    this.lights = makeLights(scene, {
      keyColor: C.cyan, keyIntensity: 0.55,
      keyDir: new THREE.Vector3(0.4, 0.25, 1),
      skyColor: C.petrol, groundColor: C.moor, ambient: 0.5,
      fillColor: C.ember, fillIntensity: 0.35,
    });
    // one practical on the porch, so the door and the hands are legible
    const porchLight = new THREE.PointLight(C.ember, 5.5, 11, 2);
    porchLight.position.set(0, 2.9, 2.2);
    scene.add(porchLight);

    // ── the porch ────────────────────────────────────────────────
    // A single static location. The player cannot leave. After two chapters
    // of relentless forward motion, being stopped at a threshold is the
    // chapter's first statement.
    const H = (x, z) => noise.fbm(x * 0.04, z * 0.04, 3) * 0.4;
    this.H = H;
    this.ground = makeTerrain(H, { size: 140, segments: 90, material: matte(C.moor) });
    scene.add(this.ground);

    const wallMat = matte(C.moor);
    const front = new THREE.Mesh(new THREE.BoxGeometry(16, 8, 0.6), wallMat);
    front.position.set(0, 4, 4);
    scene.add(front);

    // ── the door: oak, swollen, no handle on this side ───────────
    this.door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 0.22), matte(C.ash));
    this.door.position.set(0, 1.5, 3.72);
    scene.add(this.door);
    ctx.highlight.add(this.door, { scale: 1.06, rate: 0.35 });

    // blood accumulates here — the door carries the record of every failure
    this.bloodGroup = new THREE.Group();
    scene.add(this.bloodGroup);

    // a porch roof, so the sky is a strip
    const roof = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 3.4), wallMat);
    roof.position.set(0, 3.4, 2.1);
    scene.add(roof);

    // the trees, bending
    this.trees = [];
    for (let i = 0; i < 22; i++) {
      const r = mulberry(i + 77);
      const x = -34 + r() * 68, z = -34 + r() * 30;
      const h = 3 + r() * 3;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, h, 5), matte(C.moor));
      t.position.set(x, h / 2, z);
      t.userData.phase = r() * 6.28;
      scene.add(t);
      this.trees.push(t);
    }

    // ── the others, drifting ─────────────────────────────────────
    this.lost = [];
    for (let i = 0; i < 5; i++) {
      const r = mulberry(i + 500);
      const f = makeFigure(500 + i, { height: 1.8 });
      f.position.set(-26 + r() * 52, 0, -24 + r() * 16);
      f.userData.baseX = f.position.x;
      scene.add(f);
      this.lost.push(f);
    }

    // ── the white (built now, entered later) ─────────────────────
    this.white = new THREE.Group();
    this.white.visible = false;
    // a doorway-shaped hole punched in paper. Not a 3D object — a flat shape
    // that never turns to face you.
    this.hole = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 3.2), unlit(C.moor, { fog: false }));
    this.hole.position.set(0, 1.6, -30);
    this.white.add(this.hole);
    scene.add(this.white);

    // the turret, for the last beat
    this.turret = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 0.3, 26), matte(C.moor));
    floor.position.set(0, 39.9, 400);
    this.turret.add(floor);
    const crack = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 4.4), unlit(C.moor));
    crack.rotation.x = -Math.PI / 2; crack.rotation.z = 0.4;
    crack.position.set(0.6, 40.08, 400);
    this.turret.add(crack);
    this.parapetPebbles = [];
    for (let i = 0; i < 4; i++) {
      const p = makePebble(i + 40, 0.055);
      p.position.set(2.25 + i * 0.16, 41.32, 403.15 + (i % 2) * 0.09);
      this.turret.add(p);
      this.parapetPebbles.push(p);
    }
    const para = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.22, 8, 30), matte(C.moor));
    para.rotation.x = Math.PI / 2; para.position.set(0, 41.4, 400);
    this.turret.add(para);
    this.turret.visible = false;
    scene.add(this.turret);

    player.groundAt = (x, z) => {
      if (this.phase === 'turret') return 40;
      if (this.phase === 'white') return 0;
      return H(x, z);
    };
    player.surfaceAt = () => {
      if (this.phase === 'turret') return 'stone';
      if (this.phase === 'white') return 'nothing';
      return 'wood';
    };
    // facing the door, which is the only thing in this chapter
    player.teleport(0, 1.4, Math.PI);
    player.canMove = false;                    // you cannot leave the porch

    ctx.post.set('uMisreg', 4.0);
  },

  async run(ctx) {
    const { vo, audio, player, post, until, wait, cut } = ctx;

    audio.setRain(0, 2);
    audio.setWind(1.0, 0.9, 3);                // the highest sustained wind in the game
    audio.setScore(0, 2);                      // no score for seven minutes
    audio.setAmbient(1, 2);
    audio.setStone(0.1, 2);
    player.enable();

    vo.say('There’s blood on my knuckles. Blood on the door.', { hold: 6 });

    // ── PUZZLE: the knock ────────────────────────────────────────
    this.k = { taps: [], fails: 0, solved: false, involuntary: 0, elapsed: 0, hinted: 0 };
    await wait(4);
    vo.hint('knock', 5);

    await until(() => this.k.solved);

    // six seconds of absolute silence. Not a duck, not a filter.
    audio.silence(0.2);
    await wait(6);

    vo.say('There is no answer.', { hold: 4 });
    await wait(3);
    vo.say('I’m lost.', { hold: 4 });
    await wait(3);

    audio.unsilence(0.1);
    audio.setWind(1.0, 0.95, 0.1);             // returns at +4 dB, no fade
    vo.say('The wind howls, bending the trees. The others drift. Where should I go? What is left?', { hold: 9 });

    // the Ones That Lost move. Two seconds. Then never again.
    this.drift = 2.0;
    await wait(10);

    // Flat. Domestic. The delivery of a man remembering to take a pill.
    vo.say('Eat a pebble.', { hold: 5 });
    this.phase = 'swallow';
    ctx.highlight.clear();
    vo.hint(ctx.isTouch ? 'tap' : 'press E', 999);
    await until(() => this.ate);

    // ── the first Cut the player causes ──────────────────────────
    audio.swallow();
    await cut();
    this.phase = 'white';
    this.white.visible = true;
    this.turret.visible = false;
    ctx.scene.fog = new THREE.FogExp2(new THREE.Color(C.bone).getHex(), 0.045);
    this.lights.hemi.color = new THREE.Color(C.bone);
    this.lights.hemi.groundColor = new THREE.Color(C.bone);
    this.lights.hemi.intensity = 2.4;
    this.lights.key.intensity = 0;
    this.sky.material.uniforms.cLow.value = new THREE.Color(C.bone);
    this.sky.material.uniforms.cMid.value = new THREE.Color(C.bone);
    this.sky.material.uniforms.cHigh.value = new THREE.Color(C.bone);
    player.canMove = true;
    player.teleport(0, 0);
    audio.setWind(0, 0.5, 1);
    audio.setAmbient(0.0, 1);                  // no ambient at all
    audio.setScore(0.9, 4);
    audio.setVoiceTexture(1.0, 8);             // the female voice, alone
    post.set('uMisreg', 0);                    // perfect registration = death

    vo.say('I opened my eyes. I closed them again. All is white—the absence of dark, hard to focus on.', { hold: 9 });
    await wait(10);
    vo.say('I walked towards it.', { hold: 4 });

    this.drift3 = 0;
    await wait(20);
    vo.say('The closer I got, the further away it seemed.', { hold: 6 });
    await wait(7);
    vo.say('Was I getting bigger?', { hold: 5 });

    await until(() => this.drift3 > 0.85);
    // the crack opens where the player is not looking
    this.crackOpen = true;
    vo.say('A crack appeared. Only darkness poured from it. I walked. Faster.', { hold: 7 });
    player.baseSpeed = 3.4;                    // sprint, unlocked once
    audio.setOrgan(0.3, 3);
    await wait(8);

    vo.say('It turned into a run.', { hold: 4 });
    await wait(4);
    vo.say('I hit the white.', { hold: 3 });
    await wait(2.4);
    vo.say('The white hit me back.', { hold: 3 });
    audio.reverseHit();
    await wait(1.6);

    vo.say('It burst.', { hold: 2.5 });
    await wait(1.2);

    // the burst frame
    vo.flash(0.001);
    audio.burst();
    await ctx.fade(1, 0.05);
    await wait(0.4);
    this.staticBurst = 0.25;
    await wait(1.2);
    audio.silence(0.3);
    await wait(2);

    // ── CUT: the turret, after ───────────────────────────────────
    audio.unsilence(2);
    await cut();
    this.phase = 'turret';
    this.white.visible = false;
    this.turret.visible = true;
    ctx.scene.fog = new THREE.FogExp2(new THREE.Color(C.moor).getHex(), 0.05);
    this.lights.hemi.color = new THREE.Color(C.cyan);
    this.lights.hemi.groundColor = new THREE.Color(C.moor);
    this.lights.hemi.intensity = 0.5;
    this.sky.material.uniforms.cLow.value = new THREE.Color(C.moor);
    this.sky.material.uniforms.cMid.value = new THREE.Color(C.petrol);
    this.sky.material.uniforms.cHigh.value = new THREE.Color(C.cyan);
    player.baseSpeed = 1.55;
    player.teleport(0, 400);
    player.pos.y = 40;
    audio.setVoiceTexture(0, 3);
    audio.setStone(0.7, 2);
    audio.setAmbient(1, 2);
    audio.setWind(0.5, 0.6, 3);
    post.set('uMisreg', 6);
    await ctx.fade(0, 2.5);

    // Do not show it. The camera is down at the flagstones.
    player.eyeHeight = 0.55;
    vo.say('I vomited.', { hold: 4 });
    await wait(6);

    // the player has to sit with the fact that they are hearing themselves
    this.knocking = true;
    this._kt = 0.2;
    vo.say('Someone was knocking.', { hold: 5 });
    await wait(8);

    player.eyeHeight = 1.70;
    vo.say('Have to find another cup.', { voice: 'watcher', hold: 5 });
    await wait(6);
  },

  _knock(ctx, involuntary = false) {
    const { audio, vo } = ctx;
    const K = this.k;
    if (!K || K.solved) return;

    audio.knock('outside', K.fails > 8 ? 1.0 : 0.85);
    const now = this.t;
    K.taps.push(now);
    if (K.taps.length > 4) K.taps.shift();

    if (K.taps.length < 4) return;

    // evaluate the last four against the pattern
    const base = K.taps[0];
    const rel = K.taps.map(t => t - base);
    const ok =
      Math.abs(rel[1] - PATTERN[1]) < TOL &&
      Math.abs(rel[2] - PATTERN[2]) < TOL &&
      rel[3] - rel[2] > 1.4 && rel[3] - rel[2] < 3.6;

    if (ok) {
      K.solved = true;
      return;
    }

    // partial: the first two right drops the wind fractionally for a second
    if (Math.abs(rel[1] - PATTERN[1]) < TOL) {
      ctx.audio.setWind(0.75, 0.9, 0.3);
      setTimeout(() => ctx.audio.setWind(1.0, 0.9, 0.6), 900);
    }

    K.fails++;
    K.taps.length = 0;
    this._bleed(ctx);
  },

  _bleed(ctx) {
    // a new split on the knuckles, and blood transfers to the door
    const r = mulberry(this.k.fails * 13 + 7);
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(0.035 + r() * 0.05, 7),
      unlit(C.ember, { transparent: true, opacity: 0.55 + r() * 0.3 })
    );
    m.position.set((r() - 0.5) * 1.0, 1.0 + r() * 1.2, 3.61);
    this.bloodGroup.add(m);
  },

  update(dt, ctx) {
    this.t += dt;
    const { player, post, audio, vo } = ctx;

    // the trees bend
    this.trees.forEach(t => {
      t.rotation.z = Math.sin(this.t * 0.7 + t.userData.phase) * 0.11;
    });

    // ── the knock puzzle ─────────────────────────────────────────
    if (this.phase === 'door' && this.k && !this.k.solved) {
      const K = this.k;
      K.elapsed += dt;

      if (ctx.actionPressed) this._knock(ctx);

      // after ~15 failures the body knocks without input, and it is always
      // hit 1 of the pattern
      if (K.fails > 15) {
        K.involuntary -= dt;
        if (K.involuntary <= 0) {
          K.involuntary = 3.2 + Math.random();
          audio.knock('outside', 0.6);
          K.taps.length = 0;
          K.taps.push(this.t);
        }
      }

      // assist ladder — a line already heard, then the pattern on the wind.
      // Never looped.
      if (K.elapsed > 60 && K.hinted < 1) {
        K.hinted = 1;
        vo.say('Every night they knock on the door.', { voice: 'watcher', hold: 5 });
      }
      if (K.elapsed > 110 && K.hinted < 2) {
        K.hinted = 2;
        const v = 0.3;
        audio.knock('inside', v);
        setTimeout(() => audio.knock('inside', v), 750);
        setTimeout(() => audio.knock('inside', v), 1050);
        setTimeout(() => audio.knock('inside', v), 3400);
      }
      if (K.elapsed > 170 && K.hinted < 3) {
        K.hinted = 3;
        vo.hint('a beat · two fast · a long wait · one', 8);
      }
    }

    if (this.phase === 'swallow' && ctx.actionPressed) { this.ate = true; ctx.vo.clearHint(); }

    // the others drift — two seconds, then never again
    if (this.drift > 0) {
      this.drift -= dt;
      this.lost.forEach((f, i) => { f.position.x += dt * (i % 2 ? 0.5 : -0.5); });
    }

    // ── the white ────────────────────────────────────────────────
    if (this.phase === 'white') {
      // the hole grows, insufficiently: it gets subjectively further as you close
      const d = Math.abs(this.hole.position.z - player.pos.z);
      this.hole.position.z = player.pos.z - Math.max(8, d * 0.997);
      this.hole.position.x = player.pos.x;
      this.hole.position.y = player.pos.y + 1.6;

      // "Was I getting bigger?" — nobody will consciously detect this
      if (this.drift3 !== undefined && this.drift3 < 1) {
        this.drift3 = Math.min(1, this.drift3 + dt / 90);
        player.eyeHeight = lerp(1.70, 2.40, this.drift3);
        player.strideLength = lerp(0.70, 1.02, this.drift3);
      }

      if (this.crackOpen) {
        this.hole.scale.x = Math.min(4, this.hole.scale.x + dt * 0.5);
        this.hole.scale.y = Math.min(3, this.hole.scale.y + dt * 0.3);
      }
      post.ease('uPosterize', 6, dt, 0.3);
    }

    if (this.knocking) {
      this._kt -= dt;
      if (this._kt <= 0) {
        this._kt = 4.15;
        audio.knock('inside', 0.8);
        setTimeout(() => audio.knock('inside', 0.72), 750);
        setTimeout(() => audio.knock('inside', 0.68), 1050);
        setTimeout(() => audio.knock('inside', 0.8), 3400);
      }
    }

    if (this.staticBurst > 0) {
      this.staticBurst -= dt;
      post.set('uGrain', 0.6);
      post.set('uMisreg', 12);
      if (this.staticBurst <= 0) { post.set('uGrain', 0.09); post.set('uMisreg', 6); }
    }
  },

  dispose(ctx) {
    ctx.player.canMove = true;
    ctx.player.eyeHeight = 2.40;              // never restored
    ctx.player.strideLength = 1.02;
    ctx.player.baseSpeed = 1.55;
    ctx.post.set('uPosterize', 24);
    ctx.audio.setVoiceTexture(0, 1);
  },
};
