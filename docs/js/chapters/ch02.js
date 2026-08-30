// ── 02 · ASCENT ─────────────────────────────────────────────────
// "Moving costs you pieces of yourself, and the two worlds are connected."
//
// Puzzle: The Cairns. Restack three cairns in near-zero visibility; each one
// opens a corridor of fog for eight seconds. The third needs a capstone that
// does not exist on the plateau — so you spend one of your own white pebbles,
// and it rolls off the edge, and it lands beside the Watcher's teacup.
//
// That transfer is the hard proof that the two are one system, and it is
// delivered without a word of explanation: a count going from three to four.

import * as THREE from 'three';
import { noise } from '../lib/noise.js';
import {
  C, matte, unlit, makeSky, makeLights, makeTerrain, makeFigure, makePebble,
  scatter, mulberry, clamp, lerp,
} from '../engine/world.js';

export default {
  id: 'ch02',
  title: 'ASCENT',
  coda: ['The traveler strays.', 'The path remembers.', 'Movement.'],

  build(ctx) {
    const { scene, player } = ctx;
    this.phase = 'shore';
    this.t = 0;
    this.altitude = 0;

    scene.fog = new THREE.FogExp2(new THREE.Color(C.moor).getHex(), 0.055);
    // Water and sand both black — but the hill must still silhouette against
    // the sky, or the chapter is unnavigable rather than merely dark. Light is
    // the only breadcrumb this game has; under-guiding is the documented
    // failure mode of both reference games.
    this.sky = makeSky(scene, { low: C.moor, mid: C.petrol, high: C.cyan, power: 1.15 });
    this.lights = makeLights(scene, {
      keyColor: C.cyan, keyIntensity: 0.85,
      keyDir: new THREE.Vector3(-0.8, 0.14, -0.3),
      skyColor: C.cyan, groundColor: C.moor, ambient: 0.95,
    });

    // ── terrain: shore -> hill -> mountain, with no visible boundary ──
    // The player should look up at some point and realise the geology
    // changed underneath them twenty minutes ago.
    const H = (x, z) => {
      const t = clamp((z + 40) / 240, 0, 1);
      const shore = -0.4 + noise.fbm(x * 0.05, z * 0.05, 3) * 0.25;
      const hill = noise.fbm(x * 0.02, z * 0.02, 4) * 5 + t * t * 46;
      const mtn = noise.ridged(x * 0.016, z * 0.016, 5) * 26 + t * 74;
      const a = clamp((t - 0.06) / 0.22, 0, 1);
      const b = clamp((t - 0.42) / 0.34, 0, 1);
      let y = lerp(shore, hill, a);
      y = lerp(y, mtn, b);
      // the plateau: a flat shelf above where clouds ought to be
      if (t > 0.86) y = lerp(y, 120 + noise.fbm(x * 0.09, z * 0.09, 2) * 0.5, clamp((t - 0.86) / 0.08, 0, 1));
      return y;
    };
    this.H = H;

    this.ground = makeTerrain(H, { size: 420, segments: 240, material: matte(C.moor), centerZ: 100 });
    scene.add(this.ground);

    // black water, indistinguishable from black sand
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(600, 400), unlit(C.moor));
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(0, -0.62, -140);
    scene.add(sea);

    // ── the body-print in the black sand ─────────────────────────
    // Where the player wakes. Filling with water. Pays off in ch04.
    const print = new THREE.Mesh(new THREE.CircleGeometry(0.9, 16), unlit(C.petrol));
    print.rotation.x = -Math.PI / 2;
    print.position.set(0, H(0, -34) + 0.02, -34);
    print.scale.set(0.6, 1, 1);
    scene.add(print);

    // three white pebbles, in the sand where the body lay
    this.carried = [];
    for (let i = 0; i < 3; i++) {
      const p = makePebble(i + 300, 0.06);
      p.position.set(-0.5 + i * 0.5, H(0, -33) + 0.06, -33 + (i % 2) * 0.3);
      scene.add(p);
      this.carried.push(p);
    }
    this.pebblesHeld = 0;

    // ── scrub, then lichen, then bare rock, by altitude ──────────
    const scrub = scatter(
      new THREE.ConeGeometry(0.16, 0.5, 4),
      matte(C.moor),
      1400,
      (i) => {
        const r = mulberry(i + 11);
        const x = -70 + r() * 140, z = -20 + r() * 150;
        const y = H(x, z);
        if (y > 62) return null;                 // nothing grows up there
        return { x, y: y + 0.2, z, s: 0.6 + r() * 0.9 };
      }
    );
    scene.add(scrub);

    // ── the trees that were not here anymore ─────────────────────
    // Placed low, removed by altitude. Never seen to go.
    this.trees = [];
    for (let i = 0; i < 14; i++) {
      const r = mulberry(i + 600);
      const x = -40 + r() * 80, z = 10 + r() * 70;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.14, 3 + r() * 2, 5), matte(C.moor));
      t.position.set(x, H(x, z) + 1.6, z);
      scene.add(t);
      this.trees.push(t);
    }

    // ── the fog shelf: collapsed cairns ──────────────────────────
    this.cairns = [];
    const spots = [[6, 214], [-14, 232], [11, 248]];
    spots.forEach(([x, z], i) => {
      const g = new THREE.Group();
      g.position.set(x, H(x, z), z);
      // collapsed: a heap of flat stones
      for (let s = 0; s < 5; s++) {
        const r = mulberry(i * 20 + s);
        const st = new THREE.Mesh(
          new THREE.BoxGeometry(0.34 + r() * 0.2, 0.10 + r() * 0.05, 0.28 + r() * 0.16),
          matte(C.ash)
        );
        st.userData.home = new THREE.Vector3(0, 0.09 + s * 0.13, 0);
        st.userData.fallen = new THREE.Vector3((r() - 0.5) * 1.5, 0.06, (r() - 0.5) * 1.5);
        st.position.copy(st.userData.fallen);
        st.rotation.set((r() - 0.5) * 0.5, r() * 3, (r() - 0.5) * 0.5);
        g.add(st);
      }
      g.userData = { built: 0, index: i, stones: g.children.slice() };
      scene.add(g);
      this.cairns.push(g);
    });

    // ── the turret, for the payoff ───────────────────────────────
    this.turret = this._buildParapet(scene);
    this.turret.visible = false;

    // ── the Ones That Lost, closer than in ch01 ──────────────────
    [[-22, 60], [26, 88]].forEach(([x, z], i) => {
      const f = makeFigure(410 + i, { height: 1.8 });
      f.position.set(x, H(x, z), z);
      scene.add(f);
    });

    player.groundAt = (x, z) => (this.phase === 'turret' ? 40 : H(x, z));
    player.surfaceAt = (x, z) => {
      if (this.phase === 'turret') return 'stone';
      const y = H(x, z);
      if (y < 0.2) return 'sand';
      if (y < 20) return 'grass';
      if (y < 70) return 'scree';
      return 'slab';
    };
    player.teleport(0, -34, Math.PI);

    ctx.post.set('uMisreg', 2.0);
    ctx.post.set('uGrainScale', 1.0);
  },

  _buildParapet(scene) {
    const g = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 0.3, 26), matte(C.moor));
    floor.position.set(0, 39.9, 400);
    g.add(floor);
    const para = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.22, 8, 30), matte(C.moor));
    para.rotation.x = Math.PI / 2;
    para.position.set(0, 41.4, 400);
    g.add(para);

    // the cup — and the pebbles. Framed exactly as in ch01 so the count reads.
    this.cup = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.075, 0.13, 14), matte(C.bone));
    this.cup.position.set(1.9, 41.35, 403.2);
    g.add(this.cup);

    this.parapetPebbles = [];
    for (let i = 0; i < 4; i++) {
      const p = makePebble(i + 40, 0.055);
      p.position.set(2.25 + i * 0.16, 41.32, 403.15 + (i % 2) * 0.09);
      p.visible = i < 3;                       // the fourth arrives later
      g.add(p);
      this.parapetPebbles.push(p);
    }
    scene.add(g);
    return g;
  },

  async run(ctx) {
    const { vo, audio, player, post, until, wait, cut } = ctx;

    audio.setRain(0, 3);
    audio.setWind(0.05, 0.2, 4);
    audio.setAmbient(1, 2);
    audio.setScore(0.85, 8);
    audio.setOrgan(0.14, 14);
    audio.transposeOrgan(-2, 20);              // the chord drops a whole step
    player.enable();

    vo.say('I woke to waves touching my feet. Water and sand, both black. It was hard to tell where tide ended and the shore began.', { hold: 10 });
    await wait(11);
    vo.say('Buried and aching, I tried to stand.', { hold: 5 });
    await wait(6);

    // both voices, dead flat, hard-panned, slightly out of sync
    vo.say('The path is one. Its variations many.', { voice: 'merged', hold: 6 });
    await wait(7);

    await until(() => player.pos.z > 10);
    vo.say('Behind the beach lay a steep hill, strewn with sparse vegetation, climbing to meet the gray sky.', { hold: 8 });
    audio.setWind(0.3, 0.45, 10);

    await until(() => player.pos.z > 46);
    vo.say('Barefoot, I climbed, every root and stone a small argument against it.', { hold: 7 });

    // ── CUT: the lower mansion, and the teaching scene ───────────
    await until(() => player.pos.z > 78);
    await cut();
    this.phase = 'turret';
    this.turret.visible = true;
    player.teleport(0, 397);
    player.pos.y = 40;
    audio.setWind(0.5, 0.6, 2);
    audio.setStone(0.6, 1);
    this.knocking = true;
    this._kt = 0;

    vo.say('There was a time without the sound of knocking.', { voice: 'watcher', hold: 6 });
    await wait(7);
    vo.say('The lower part of the mansion is never quiet these days. But these days are the only ones I have.', { voice: 'watcher', hold: 9 });
    await wait(10);

    // processed as a tape loop, each pass more degraded
    vo.say('Yesterday is also the day after tomorrow, which is today.', { voice: 'watcher', hold: 7 });
    await wait(3);
    vo.say('Yesterday is also the day after tomorrow, which is today.', { voice: 'watcher', hold: 5 });
    await wait(3);
    vo.say('Yesterday is also the day after tomorrow, which is today.', { voice: 'watcher', hold: 4 });
    await wait(6);

    vo.say('And today, the knocking is unbearable.', { voice: 'watcher', hold: 5 });
    this.knockLoud = true;
    await wait(6);

    // the wind takes the cup. We hear it fall for far too long. It never lands.
    vo.say('The wind takes my tea cup off the turret wall.', { voice: 'watcher', hold: 5 });
    this.cupFalling = true;
    audio.cup();
    await wait(6);
    vo.say('I am forced to venture outside.', { voice: 'watcher', hold: 5 });
    await wait(6);

    // ── CUT: back to the mountain ────────────────────────────────
    await cut();
    this.phase = 'mountain';
    this.turret.visible = false;
    this.knocking = false;
    player.teleport(0, 96, Math.PI);
    audio.setStone(0.05, 3);
    audio.setWind(0.55, 0.7, 4);

    vo.say('The climb continued.', { hold: 4 });
    await wait(5);

    // the limp. Permanent, for the rest of the game.
    vo.say('The limp got worse.', { hold: 4 });
    player.speedScale = 0.85;
    player.strideLength = 0.70;
    await wait(5);

    await until(() => player.pos.z > 130);
    vo.say('My feet dragged on, leaving pieces of myself on the stone.', { hold: 7 });
    this.bleeding = true;
    await wait(8);
    vo.say('The hill was slowly turning into a mountain. I woke up with the taste of blood in my mouth.', { hold: 8 });
    await wait(9);
    vo.say('The stones. Pain.', { hold: 4 });

    await until(() => player.pos.z > 160);
    vo.say('The trees that were not here anymore.', { hold: 5 });
    this.trees.forEach(t => t.visible = false);

    await until(() => player.pos.z > 196);
    audio.setScore(0, 6);                       // no score on the shelf
    audio.setWind(0.75, 0.15, 6);               // pressure, not sound
    vo.say('I had to climb. When I managed to stand, it was hard to breathe.', { hold: 7 });
    await wait(8);
    vo.say('There should have been clouds here.', { hold: 4 });
    await wait(8);
    vo.say('There weren’t.', { hold: 4 });

    // ── PUZZLE: the cairns ───────────────────────────────────────
    this.phase = 'shelf';
    this.puzzle = { built: 0, searching: 0, placedCapstone: false, corridor: 0, corridorDir: null };
    await wait(4);
    vo.hint('hold E at a fallen cairn', 8);

    await until(() => this.puzzle.built >= 2);
    await wait(1);
    vo.hint('the third has no capstone', 6);

    // the wasted minutes are the puzzle
    await until(() => this.puzzle.placedCapstone);

    vo.say('A decision.', { hold: 4 });
    await wait(3);

    // the one line in the game that lands on its image
    vo.say('A pebble, loose underfoot, rolled toward the edge.', { hold: 6 });
    this.rolling = true;
    audio.piano(146.83, 0.6);
    await wait(6);

    vo.say('Then I left the path.', { hold: 5 });
    await vo.card(['The path remembers.'], { hold: 0.4 });

    // ── CUT: the transfer ────────────────────────────────────────
    await cut();
    this.phase = 'turret';
    this.turret.visible = true;
    player.teleport(0, 397);
    player.pos.y = 40;
    audio.setScore(0.8, 6);
    audio.setOrgan(0.16, 8);
    audio.setStone(0.6, 2);

    // four seconds of absolute silence between the last knock and the wind
    audio.silence(0.3);
    await wait(4);
    audio.unsilence(2);
    audio.setWind(0.9, 0.85, 2);

    vo.say('There is no one outside. The knocking has stopped. The wind is relentless.', { voice: 'watcher', hold: 8 });
    await wait(9);

    // Say nothing else. Let the player do the counting.
    this.parapetPebbles[3].visible = true;
    audio.cup();
    vo.say('I reach for the tea cup. Beside it lies a white pebble. One more for the collection.', { voice: 'watcher', hold: 9 });
    await wait(11);

    vo.say('Time to climb the stairs again.', { voice: 'watcher', hold: 5 });
    await wait(6);
    vo.say('The lens, still there, unbothered by birds and wind.', { voice: 'watcher', hold: 6 });
    await wait(6);
  },

  update(dt, ctx) {
    this.t += dt;
    const { player, post, audio, camera, vo } = ctx;

    // ── pick up the pebbles at the tideline ──────────────────────
    if (this.phase === 'shore' && this.pebblesHeld < 3) {
      this.carried.forEach((p) => {
        if (p.visible && p.position.distanceTo(player.pos) < 1.6) {
          p.visible = false;
          this.pebblesHeld++;
          audio.stoneSet();
        }
      });
    }

    // ── altitude drives the grade ────────────────────────────────
    if (this.phase !== 'turret') {
      const alt = clamp(player.pos.y / 120, 0, 1);
      this.altitude = alt;
      post.ease('uDesat', alt * 0.85, dt, 0.5);
      post.ease('uMisreg', 2 + alt * 2.5, dt, 0.4);        // coming apart as he does
      post.set('uGrainScale', 1 + alt * 1.1);              // worse stock as it goes on
      if (ctx.scene.fog) ctx.scene.fog.density = lerp(0.055, 0.10, alt);
      // shadowlessness on the shelf: without shadow you cannot read form
      this.lights.key.intensity = lerp(0.5, 0.05, clamp((alt - 0.7) / 0.3, 0, 1));
      this.lights.hemi.intensity = lerp(0.62, 1.15, alt);
    }

    // ── the knocking ─────────────────────────────────────────────
    if (this.knocking) {
      this._kt -= dt;
      if (this._kt <= 0) {
        this._kt = 4.15 + (Math.random() - 0.5) * 0.25;
        const v = this.knockLoud ? 0.95 : 0.5;
        audio.knock('inside', v);
        setTimeout(() => audio.knock('inside', v * 0.9), 750);
        setTimeout(() => audio.knock('inside', v * 0.85), 1050);
        setTimeout(() => audio.knock('inside', v), 3400);
      }
    }

    if (this.cupFalling && this.cup) {
      this.cup.position.y -= dt * 3;
      this.cup.position.x += dt * 0.6;
      if (this.cup.position.y < 10) { this.cup.visible = false; this.cupFalling = false; }
    }

    // ── the cairn puzzle ─────────────────────────────────────────
    if (this.phase === 'shelf' && this.puzzle) {
      const P = this.puzzle;

      // corridor of visibility, eased in over 1.5 s and out over 6
      if (P.corridor > 0) {
        P.corridor -= dt;
        ctx.scene.fog.density = lerp(0.10, 0.018, clamp(P.corridor / 8, 0, 1));
      } else {
        ctx.scene.fog.density = lerp(ctx.scene.fog.density, 0.10, dt * 0.3);
      }

      for (const g of this.cairns) {
        const d = g.position.distanceTo(player.pos);
        if (d > 2.4) continue;

        const u = g.userData;
        if (u.built < 1 && ctx.actionHeld) {
          // forty seconds of work, one stone at a time. It cannot be rushed.
          u.built = Math.min(1, u.built + dt / 12);
          const n = Math.floor(u.built * 5);
          if (n !== u.lastN) { u.lastN = n; audio.stoneSet(); }
          u.stones.forEach((s, i) => {
            const t = clamp(u.built * 5 - i, 0, 1);
            s.position.lerpVectors(s.userData.fallen, s.userData.home, t);
            s.rotation.x *= (1 - t * 0.1);
          });

          if (u.built >= 1 && !u.done) {
            u.done = true;
            if (u.index === 2) {
              // the third: no capstone exists anywhere on the plateau
              P.searching = 1;
            } else {
              P.built++;
              P.corridor = 8;
              audio.piano(174.61, 0.35);
            }
          }
        }

        // the capstone
        if (u.index === 2 && u.done && !P.placedCapstone && this.pebblesHeld > 0 && ctx.actionPressed) {
          P.placedCapstone = true;
          this.pebblesHeld--;
          const cap = makePebble(999, 0.06);
          cap.position.copy(g.position).add(new THREE.Vector3(0, 0.78, 0));
          ctx.scene.add(cap);
          this.capstone = cap;
          audio.stoneSet();
        }
      }

      // assist: after four minutes hunting, the hand opens. Once.
      P.searching += dt;
      if (P.searching > 240 && !P.handShown && !P.placedCapstone) {
        P.handShown = true;
        vo.hint('something white, in your hand', 4);
      }
    }

    // the pebble rolls, and you cannot catch it
    if (this.rolling && this.capstone) {
      this.capstone.position.x += dt * 1.8;
      this.capstone.position.z += dt * 0.9;
      this.capstone.position.y -= dt * 0.4;
      this.capstone.rotation.x += dt * 6;
    }

    if (this.bleeding) {
      // ember reaches full strength in the footprints
      post.ease('uPaletteMix', 0.9, dt, 0.2);
    }
  },

  dispose(ctx) {
    ctx.post.set('uDesat', 0);
    ctx.post.set('uGrainScale', 1);
    ctx.post.set('uPaletteMix', 0.85);
  },
};
