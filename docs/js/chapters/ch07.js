// ── 07 · THE PATH ───────────────────────────────────────────────
// The last page of the book is the first page, emptied out.
//
// Puzzle: The Confused Shadow. For the whole game the player has cast no
// shadow. Here they cast two, and there is exactly one place on the moor
// where the two agree — and it is off the path.

import * as THREE from 'three';
import { noise } from '../lib/noise.js';
import {
  C, matte, unlit, makeSky, makeLights, makeTerrain, makePath, makeFigure,
  makeRuin, makeDeadTree, scatter, mulberry, clamp, lerp, Rain,
} from '../engine/world.js';

// off the path, in the heather, next to the close-standing figure
const CONVERGE = { x: -12, z: 96 };

export default {
  id: 'ch07',
  title: 'THE PATH',
  coda: null,

  build(ctx) {
    const { scene, player } = ctx;
    this.t = 0;
    this.phase = 'moor';
    this.solved = false;

    scene.fog = new THREE.FogExp2(new THREE.Color(C.petrol).getHex(), 0.021);
    this.sky = makeSky(scene, { low: C.moor, mid: C.petrol, high: C.cyan, power: 0.9 });

    // ── two lights, and the player casts two shadows ─────────────
    this.lights = makeLights(scene, {
      keyColor: C.ember, keyIntensity: 1.1,
      keyDir: new THREE.Vector3(0, 0.10, -1),
      ambient: 0.44, shadows: true,
    });
    // Light B: behind and below the horizon, at the position of the egg.
    // The thing that hatched is behind the player, casting them forward.
    this.lightB = new THREE.DirectionalLight(C.ember, 0.85);
    this.lightB.castShadow = true;
    this.lightB.shadow.mapSize.set(2048, 2048);
    const d = 50;
    Object.assign(this.lightB.shadow.camera, { left: -d, right: d, top: d, bottom: -d, near: 1, far: 400 });
    this.lightB.shadow.bias = -0.0012;
    scene.add(this.lightB);
    scene.add(this.lightB.target);

    const H = (x, z) => noise.fbm(x * 0.013, z * 0.013, 4) * 1.9;
    this.H = H;
    this.ground = makeTerrain(H, {
      size: 420, segments: 200, material: matte(C.moor), receiveShadow: true,
    });
    this.ground.position.z = 110;
    scene.add(this.ground);

    // the path runs dead straight — because it was drawn by something that
    // was not a person walking
    this.path = makePath(H, { length: 400, from: -60, width: 2.6 });
    scene.add(this.path);

    // there is no fence. It is not there at all.

    const heather = scatter(
      new THREE.ConeGeometry(0.13, 0.42, 4), matte(C.moor), 4200,
      (i) => {
        const r = mulberry(i + 21);
        const x = -110 + r() * 220, z = -40 + r() * 280;
        if (Math.abs(x) < 2.2) return null;
        return { x, y: H(x, z) + 0.18, z, s: 0.7 + r() * 0.8 };
      }
    );
    scene.add(heather);

    // ── the leaning tree, which is the same tree ─────────────────
    // Intervals shorten: by the fourth pass most players will have stopped.
    this.trees = [];
    [22, 52, 76, 94, 108].forEach((z, i) => {
      const t = makeDeadTree(5150, { height: 4.6 });   // one seed. One tree.
      t.position.set(4.6, H(4.6, z), z);
      t.rotation.z = 0.34;                              // it leans the same way
      t.castShadow = true;
      scene.add(t);
      this.trees.push(t);
    });

    // ── the Ones That Lost, more of them than ever ───────────────
    this.lost = [];
    for (let i = 0; i < 26; i++) {
      const r = mulberry(i + 6100);
      const x = (r() > 0.5 ? 1 : -1) * (18 + r() * 70);
      const z = 10 + r() * 200;
      const f = makeFigure(6100 + i, { height: 1.8 });
      f.position.set(x, H(x, z), z);
      f.castShadow = true;
      scene.add(f);
      this.lost.push(f);
    }
    // one much closer, standing at the convergence, wearing your clothes.
    // It has been the marker all along.
    this.near = makeFigure(101, { height: 1.84 });      // the ch01/ch05 seed
    this.near.position.set(CONVERGE.x + 1.6, H(CONVERGE.x + 1.6, CONVERGE.z), CONVERGE.z);
    // and it casts no shadow
    this.near.castShadow = false;
    scene.add(this.near);

    // ── the orchard, four hundred metres away ────────────────────
    this.orchard = new THREE.Group();
    for (let i = 0; i < 40; i++) {
      const r = mulberry(i + 9100);
      const x = -26 + r() * 52, z = 250 + r() * 40;
      const t = makeDeadTree(i + 400, { height: 4.4 });
      t.position.set(x, H(x, z), z);
      this.orchard.add(t);
    }
    const ruin = makeRuin(3);
    ruin.position.set(0, H(0, 300), 300);
    this.orchard.add(ruin);
    const fig = makeFigure(101, { height: 1.86 });
    fig.position.set(0, H(0, 298), 298);
    this.orchard.add(fig);
    this.orchard.visible = true;
    scene.add(this.orchard);
    this.ruin = ruin;

    // the four-hundred-metre shadow: a drawn shape, not a render
    this.longShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 200),
      unlit(C.moor, { transparent: true, opacity: 0 })
    );
    this.longShadow.rotation.x = -Math.PI / 2;
    this.longShadow.position.set(CONVERGE.x, 0.05, CONVERGE.z + 100);
    scene.add(this.longShadow);

    // held at zero until the last cut, where the ch01 rain returns
    this.rain = new Rain(scene, 2400, { radius: 22, height: 18, speed: 20 });
    this.rain.set(0);

    player.groundAt = (x, z) => H(x, z);
    player.surfaceAt = (x, z) => (Math.abs(x) < 1.4 ? 'slab' : 'heather');
    player.teleport(0, -20, Math.PI);
    // the limp is gone. Movement returns to 100% and nobody is told.
    player.speedScale = 1.0;
    player.strideLength = 0.82;
    player.eyeHeight = 1.70;

    ctx.post.set('uMisreg', 2);
    ctx.post.set('uVignette', 0.72);
  },

  async run(ctx) {
    const { vo, audio, player, post, until, wait, cut } = ctx;

    // the chapter is never silent. The loop does not offer a pause.
    audio.unsilence(3);
    audio.setAmbient(1, 3);
    audio.setWind(0.42, 0.42, 5);        // dry, continuous, no gusting structure
    audio.setRain(0, 1);                 // no rain. The founding sound is absent.
    audio.setScore(0.85, 8);
    audio.setOrgan(0.18, 12);            // the chord returns, complete
    audio.setStone(0.12, 4);
    player.enable();

    vo.say('I get up.', { hold: 4 });
    await wait(5);
    vo.say('A path of white cutting through a moor.', { hold: 5 });
    await wait(6);

    // singular — "shadow" — while the player has two. Not a bug.
    vo.say('Dusk. My shadow is confused.', { hold: 6 });
    await wait(9);

    vo.say('The air is thick with salt.', { hold: 5 });
    await until(() => player.pos.z > 70);
    vo.say('My eyes complain.', { hold: 5 });

    // ── PUZZLE: the confused shadow ──────────────────────────────
    this.phase = 'shadow';
    this.pz = { elapsed: 0 };
    await wait(6);
    vo.hint('your shadows do not agree', 6);

    await until(() => this.solved);

    // no line. Four seconds of nothing.
    await wait(4);

    // the horizon, which has refused to approach, is suddenly legible
    this.resolving = true;
    audio.resolveOrgan(9);               // the one chord change in the game
    post.set('uMisreg', 0);              // and it stays at zero
    await wait(8);

    // the shadow lengthens until it reaches the orchard
    this.lengthen = true;
    await wait(6);

    vo.say('My feet start walking.', { hold: 5 });
    await until(() => player.moving || this.pz.elapsed > 40);
    await wait(4);

    // flattest read in the game. Not despair — absence of affect.
    vo.say('I feel nothing.', { hold: 5 });
    await wait(5.4);

    // ── the last Cut, which is the first ─────────────────────────
    await cut();
    this.phase = 'orchard';
    player.canMove = false;
    player.locked = true;

    // ch01 beat 5, from the Figure's point of view: looking out at a soaked
    // barefoot traveller standing six metres away, motionless, in the rain.
    player.teleport(0, 300, 0);
    player.eyeHeight = 1.86;
    this.orchardTraveler = makeFigure(2, { height: 1.8 });
    this.orchardTraveler.position.set(0, this.H(0, 294), 294);
    ctx.scene.add(this.orchardTraveler);
    this.ruin.visible = true;

    audio.setRain(1, 2);                 // the ch01 rain, same levels
    audio.setWind(0.16, 0.3, 3);
    audio.setScore(0.3, 6);
    this.rain.set(1);

    // somewhere far above and behind, a lens turns and finds focus
    await wait(6);
    audio.setStone(0.4, 4);

    // and the knocking begins. It is not theirs yet. It will be.
    this.knocking = true;
    this._kt = 3;

    await wait(84);
  },

  update(dt, ctx) {
    this.t += dt;
    const { player, post, audio, camera, vo } = ctx;

    this.rain.update(dt, camera.position);

    // ── the two shadows ──────────────────────────────────────────
    // Light A at the vanishing point ahead; Light B behind and below, at the
    // egg. As the player moves, the angle between the shadows changes; they
    // agree in exactly one place.
    if (this.phase === 'shadow' || this.phase === 'moor') {
      const dx = player.pos.x - CONVERGE.x;
      const dz = player.pos.z - CONVERGE.z;
      const d = Math.hypot(dx, dz);
      const near = clamp(1 - d / 26, 0, 1);

      this.lights.key.position.set(player.pos.x, 30, player.pos.z + 120);
      this.lights.key.target.position.set(player.pos.x, 0, player.pos.z);

      // B swings toward alignment with A as you approach the convergence
      const spread = lerp(150, 0, near * near);
      this.lightB.position.set(
        player.pos.x + Math.sin(spread * 0.0175) * 90 + dx * 0.6,
        26,
        player.pos.z - 110
      );
      this.lightB.target.position.set(player.pos.x, 0, player.pos.z);
      this.lightB.intensity = lerp(0.85, 1.0, near);

      if (this.phase === 'shadow') {
        this.pz.elapsed += dt;

        if (d < 2.2 && !this.solved) {
          this.solved = true;
          audio.piano(146.83, 0.4);
        }

        // assist: once, the shadows snap into alignment wherever you stand
        if (this.pz.elapsed > 180 && !this._a1) {
          this._a1 = true;
          this._snap = 0.5;
        }
        // and then the figure standing at the convergence gains contrast
        if (this.pz.elapsed > 300 && !this._a2) {
          this._a2 = true;
          this.near.material = matte(C.ash);
          vo.hint('something is standing off the path', 5);
        }
      }
      if (this._snap > 0) {
        this._snap -= dt;
        this.lightB.position.set(player.pos.x, 30, player.pos.z + 120);
      }
    }

    // ── the vanishing point does not approach ────────────────────
    // Held at a ratio of 0.97 — below the perceptual threshold for a single
    // glance, above it for four minutes of glances.
    if (!this.resolving && this.orchard) {
      this.orchard.position.z = player.pos.z * 0.97;
    } else if (this.resolving && this.orchard.position.z > 0) {
      this.orchard.position.z = Math.max(0, this.orchard.position.z - dt * 26);
    }

    // the shadow reaches the orchard
    if (this.lengthen) {
      const m = this.longShadow.material;
      m.opacity = Math.min(0.8, m.opacity + dt * 0.25);
      this.longShadow.scale.y = Math.min(2.4, this.longShadow.scale.y + dt * 0.3);
    }

    if (this.knocking) {
      this._kt -= dt;
      if (this._kt <= 0) {
        this._kt = 4.15;
        audio.knock('inside', 0.5);
        setTimeout(() => audio.knock('inside', 0.45), 750);
        setTimeout(() => audio.knock('inside', 0.42), 1050);
        setTimeout(() => audio.knock('inside', 0.5), 3400);
      }
    }
  },

  dispose(ctx) {
    ctx.player.locked = false;
    ctx.player.canMove = true;
  },
};
