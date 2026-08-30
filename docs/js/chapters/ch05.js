// ── 05 · CONSTRICTION ───────────────────────────────────────────
// "The world narrows until there is room for exactly one body, and there are
//  two of them."
//
// Puzzle: Passage Refused. Five niches, four pebbles, and the fifth does not
// exist. The only white object left in the world is you.

import * as THREE from 'three';
import { noise } from '../lib/noise.js';
import {
  C, matte, unlit, makeSky, makeLights, makeTerrain, makeFigure, makePebble,
  makePath, mulberry, clamp, lerp,
} from '../engine/world.js';

const GAP_Z = 150;

export default {
  id: 'ch05',
  title: 'CONSTRICTION',
  coda: ['The one that lost.', 'Dissolution.', 'The burden.'],

  build(ctx) {
    const { scene, player } = ctx;
    this.phase = 'narrowing';
    this.t = 0;

    scene.fog = new THREE.FogExp2(new THREE.Color(C.moor).getHex(), 0.045);
    this.sky = makeSky(scene, { low: C.moor, mid: C.petrol, high: C.cyan, power: 1.1 });
    this.lights = makeLights(scene, {
      keyColor: C.ember, keyIntensity: 1.2,
      keyDir: new THREE.Vector3(0, 0.09, -1),
      ambient: 0.42,
    });

    // Begins as open moor at dusk, indistinguishable from the game's opening.
    // Players should half-think they have looped already.
    const H = (x, z) => noise.fbm(x * 0.012, z * 0.012, 4) * 2.0;
    this.H = H;
    this.ground = makeTerrain(H, { size: 400, segments: 180, material: matte(C.moor), centerZ: 120 });
    scene.add(this.ground);

    this.path = makePath(H, { length: 340, from: -30, width: 2.6 });
    scene.add(this.path);

    // ── the Ones That Lost are the walls ─────────────────────────
    // The passage narrows because more of them are standing closer to it.
    // Each individually generated — no instancing at close range.
    this.figures = [];
    for (let i = 0; i < 46; i++) {
      const t = i / 45;
      const z = 10 + t * 128;
      const spread = lerp(40, 1.9, Math.pow(t, 1.35));
      for (const s of [-1, 1]) {
        const f = makeFigure(1000 + i * 2 + (s > 0 ? 1 : 0), { height: 1.78 + (i % 5) * 0.03 });
        const x = s * spread * (0.85 + ((i * 7) % 10) / 30);
        f.position.set(x, H(x, z), z);
        scene.add(f);
        this.figures.push(f);
      }
    }

    // ── rock closing in ──────────────────────────────────────────
    this.walls = [];
    for (let i = 0; i < 40; i++) {
      const t = i / 39;
      const z = 96 + t * 62;
      const spread = lerp(7, 0.62, Math.pow(t, 1.2));
      for (const s of [-1, 1]) {
        const r = mulberry(i * 5 + (s > 0 ? 1 : 0));
        const h = 4 + r() * 5;
        const w = new THREE.Mesh(new THREE.BoxGeometry(3.2, h, 2.2), matte(C.moor));
        w.position.set(s * (spread + 1.6), H(0, z) + h / 2 - 1.4, z);
        w.rotation.z = -s * (0.06 + t * 0.22);          // leaning in
        w.rotation.y = (r() - 0.5) * 0.3;
        w.castShadow = true;
        scene.add(w);
        this.walls.push(w);
      }
    }

    // the sky closes last, and it closes as a seam
    for (let i = 0; i < 22; i++) {
      const t = i / 21;
      const z = 128 + t * 34;
      const s = new THREE.Mesh(new THREE.BoxGeometry(9, 2.4, 1.9), matte(C.moor));
      s.position.set(0, 5.4 - t * 0.9, z);
      scene.add(s);
      // the seam of sky overhead: a bright line, the shape of the egg's fracture
      const gap = new THREE.Mesh(new THREE.PlaneGeometry(lerp(1.1, 0.16, t), 1.9), unlit(C.bone));
      gap.rotation.x = Math.PI / 2;
      gap.position.set(0, 4.19 - t * 0.9, z);
      scene.add(gap);
    }

    // ── the Figure, in a gap sixty centimetres wide ──────────────
    this.figure = makeFigure(101, { height: 1.86 });   // the same seed as ch01
    this.figure.position.set(0, H(0, GAP_Z), GAP_Z);
    this.figure.rotation.y = 0;
    scene.add(this.figure);

    // ── the five niches ──────────────────────────────────────────
    // Not marked, not lit, not glowing. They are shaped like the pebbles.
    this.niches = [];
    [[-1.0, 138, 1.3], [1.0, 141, 0.7], [-0.95, 144, 1.8], [1.0, 147, 1.1], [-0.9, GAP_Z, 1.0]]
      .forEach(([x, z, y], i) => {
        const n = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), unlit(C.moor));
        n.position.set(x, H(0, z) + y, z);
        n.userData = { i, filled: false };
        scene.add(n);
        this.niches.push(n);
        ctx.highlight.add(n, { scale: 2.0, rate: 0.5 });
        const light = new THREE.PointLight(C.bone, 0, 7, 2);
        light.position.copy(n.position);
        scene.add(light);
        n.userData.light = light;
      });

    // ── the four findable pebbles ────────────────────────────────
    this.held = 1;                              // the one ch03 did not eat
    this.findable = [];
    const spots = [
      { x: 0, z: 120, y: 0.06, note: 'in the ash still on your feet' },
      { x: -2.1, z: 130, y: 1.15, note: 'white on white, at chest height' },
      { x: 0, z: 134, y: 0.06, note: 'in your other hand' },
    ];
    spots.forEach((s, i) => {
      const p = makePebble(i + 700, 0.055);
      p.position.set(s.x, H(0, s.z) + s.y, s.z);
      p.userData = s;
      scene.add(p);
      ctx.highlight.add(p, { scale: 2.0, rate: 0.62 });
      this.findable.push(p);
    });
    // one of them is calcified into a standing figure
    this.findable[1].position.set(-2.1, H(0, 130) + 1.15, 130);

    // ── the turret, collapsing ───────────────────────────────────
    this.turret = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 0.3, 26), matte(C.moor));
    floor.position.set(0, 39.9, 400);
    this.turret.add(floor);
    this.rubble = [];
    for (let i = 0; i < 60; i++) {
      const r = mulberry(i + 4000);
      const a = r() * 6.28, rad = 3.4 + r() * 1.2;
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.4 + r() * 0.5, 0.35, 0.4), matte(C.moor));
      b.position.set(Math.cos(a) * rad, 40.2 + r() * 3, 400 + Math.sin(a) * rad);
      b.userData.a = a;
      this.turret.add(b);
      this.rubble.push(b);
    }
    // both cups. Both empty. Never explain how the second one got there.
    this.cups = [];
    for (let i = 0; i < 2; i++) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.075, 0.13, 14), matte(C.bone));
      c.position.set(1.9 + i * 0.4, 41.35, 403.2);
      this.turret.add(c);
      this.cups.push(c);
    }
    const para = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.22, 8, 30), matte(C.moor));
    para.rotation.x = Math.PI / 2; para.position.set(0, 41.4, 400);
    this.turret.add(para);
    this.turret.visible = false;
    scene.add(this.turret);

    player.groundAt = (x, z) => (this.phase === 'turret' ? 40 : H(x, z));
    player.surfaceAt = () => (this.phase === 'turret' ? 'stone' : 'slab');
    player.teleport(0, -10, Math.PI);
    player.eyeHeight = 2.40;                    // never restored since ch03

    ctx.post.set('uMisreg', 6);
  },

  async run(ctx) {
    const { vo, audio, player, post, until, wait, cut } = ctx;

    audio.setAmbient(1, 2);
    audio.setWind(0.5, 0.55, 4);
    audio.setScore(0.8, 6);
    audio.setOrgan(0.16, 8);
    audio.organRootOnly(14);                    // the chord reduced to its root
    audio.setStone(0.2, 4);
    player.enable();

    await until(() => player.pos.z > 118);
    // no `…` before this page: the voice here is neither and both
    vo.say('A figure without motion and no intent. Just a fixed object in space.', { voice: 'merged', hold: 8 });
    await wait(9);
    vo.say('Nothing was around it. Everything narrowed to it.', { voice: 'merged', hold: 6 });

    await until(() => player.pos.z > 146);
    this.phase = 'refused';
    this.grinding = true;
    audio.grind(0.5, 3);
    vo.say('Passage refused.', { voice: 'merged', hold: 5 });
    await wait(6);
    vo.hint('press E', 5);

    await until(() => this.niches.filter(n => n.userData.filled).length >= 1);
    vo.say('Pebbles. Insulting the dark with white.', { voice: 'merged', hold: 6 });

    await until(() => this.niches.filter(n => n.userData.filled).length >= 4);
    vo.say('A clash of white and dark closing in to crush it.', { voice: 'merged', hold: 7 });

    // assist ladder — a camera drift, then two empty white hands
    this.assistT = 0;
    await until(() => this.merged);

    // ── the merge ────────────────────────────────────────────────
    player.canMove = false;
    vo.say('Flattened.', { voice: 'merged', hold: 3 });
    post.set('uSqueeze', 0.42);
    player.fovTarget = 35;
    audio.grind(0.9, 0.4);
    await wait(2.6);

    vo.say('Expanded.', { voice: 'merged', hold: 3 });
    vo.flash(0.001);
    post.set('uSqueeze', -0.4);
    player.fovTarget = 118;
    await wait(2.6);

    vo.say('Silenced.', { voice: 'merged', hold: 3 });
    audio.silence(0.15);
    audio.grind(0, 0.1);
    post.set('uSqueeze', 0);
    player.fovTarget = 68;
    await wait(4);

    // the wind, from the far side of the gap, alone
    audio.unsilence(3);
    audio.setAmbient(0.5, 4);
    audio.setWind(0.4, 0.5, 5);
    audio.setScore(0, 2);
    this.figure.visible = false;
    post.set('uMisreg', 2);                     // never zero again
    await wait(9);

    vo.say('Remade together without purpose.', { voice: 'merged', hold: 6 });
    await wait(7);
    vo.say('We continue.', { voice: 'merged', hold: 5 });
    player.canMove = true;
    this.phase = 'after';
    // footsteps become different assets — two people's worth
    player.strideLength = 0.94;
    await until(() => player.pos.z > GAP_Z + 8);

    // ── CUT: the turret disintegrates inwards ────────────────────
    await cut();
    this.phase = 'turret';
    this.turret.visible = true;
    player.teleport(0, 398);
    player.pos.y = 40;
    audio.setStone(0.7, 2);
    audio.setWind(0.95, 0.8, 3);                // from outside, at full
    audio.setScore(0.5, 4);
    audio.setOrgan(0.14, 6);

    // the merge floors at 30% and never goes below
    vo.say('Even when it started crumbling I stayed.', { voice: 'watcher', hold: 6 });
    await wait(7);
    vo.say('Yesterday. This was an echo.', { voice: 'watcher', hold: 6 });
    await wait(7);

    vo.say('The cups empty.', { voice: 'watcher', hold: 4 });
    audio.cup();
    await wait(5);
    // the parapet is bare. Match the framing so the emptiness is legible.
    vo.say('Pebbles gone.', { voice: 'watcher', hold: 4 });
    await wait(5);

    vo.say('Collapse.', { voice: 'watcher', hold: 3 });
    this.collapsing = true;
    audio.grind(0.4, 2);                        // mixed quietly. Resist the swell.
    await wait(4);

    vo.say('The winds howled. The trees swayed in the dusk. The turret started to disintegrate inwards.', { voice: 'watcher', hold: 9 });
    await wait(10);
    vo.say('I reach outwards.', { voice: 'watcher', hold: 5 });
    await wait(5);
    audio.grind(0, 3);
  },

  update(dt, ctx) {
    this.t += dt;
    const { player, post, audio, vo } = ctx;

    // 80% of the frame below 10% luminance for the final minutes
    if (this.phase !== 'turret') {
      const t = clamp((player.pos.z - 60) / 90, 0, 1);
      this.lights.key.intensity = lerp(1.2, 0.05, t);
      this.lights.hemi.intensity = lerp(0.42, 0.06, t);
      // the narrowing, as a reverb automation
      audio.setStone(lerp(0.2, 0.85, t), 1.5);
      post.ease('uMisreg', lerp(6, 18, t), dt, 0.4);
    }

    // ── the niches ───────────────────────────────────────────────
    if (this.phase === 'refused') {
      // find the pebbles
      this.findable.forEach(p => {
        if (p.visible && p.position.distanceTo(player.pos) < 1.7 && ctx.actionPressed) {
          p.visible = false; ctx.highlight.remove(p); this.held++; audio.stoneSet();
        }
      });

      // brace a niche
      if (ctx.actionPressed && this.held > 0) {
        for (const n of this.niches) {
          if (n.userData.filled) continue;
          if (n.position.distanceTo(player.pos) > 1.9) continue;
          n.userData.filled = true;
          ctx.highlight.remove(n);
          n.userData.light.intensity = 3.2;
          n.material = unlit(C.bone);
          this.held--;
          audio.stoneSet();
          // the grinding stops, per section — the puzzle's only feedback
          const filled = this.niches.filter(q => q.userData.filled).length;
          audio.grind(0.5 * (1 - filled / 5), 1.2);
          break;
        }
      }

      // the fifth does not exist. Stand in the gap instead.
      const filled = this.niches.filter(n => n.userData.filled).length;
      if (filled >= 4 && !this.merged) {
        const d = Math.hypot(player.pos.x, player.pos.z - GAP_Z);
        if (d < 1.1 && !player.moving) {
          this._still = (this._still || 0) + dt;
          if (this._still > 1.4) this.merged = true;
        } else {
          this._still = 0;
        }

        this.assistT = (this.assistT || 0) + dt;
        if (this.assistT > 240 && !this._a1) {
          this._a1 = true;
          vo.hint('there is no fifth', 5);
        }
        if (this.assistT > 360 && !this._a2) {
          this._a2 = true;
          vo.hint('the only white thing left is you', 6);
        }
      }
    }

    // ── the turret falls into itself ─────────────────────────────
    if (this.collapsing) {
      this.rubble.forEach(b => {
        const dir = new THREE.Vector3(0, 40, 400).sub(b.position).normalize();
        b.position.addScaledVector(dir, dt * 0.55);       // stone travels inward
        b.rotation.x += dt * 0.4;
      });
    }
  },

  dispose(ctx) {
    ctx.post.set('uSqueeze', 0);
    ctx.post.set('uMisreg', 2);
    ctx.player.canMove = true;
    ctx.player.fovTarget = ctx.player.settingsFov;
    ctx.audio.grind(0, 1);
  },
};
