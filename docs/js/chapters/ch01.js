// ── 01 · PROLOGUE ───────────────────────────────────────────────
// "Establish that there are two of you, and that neither can move."
//
// Puzzle: The Great Lens. Three brass collars, two ink plates drifting apart.
// The puzzle drives the game's own misregistration uniform — the first thing
// the player does is re-register the image they are looking through.

import * as THREE from 'three';
import { noise } from '../lib/noise.js';
import {
  C, matte, unlit, makeSky, makeLights, makeTerrain, makePath, makeDeadTree,
  makeFigure, makeRuin, makePebble, Rain, scatter, mulberry, clamp, smooth,
} from '../engine/world.js';

export default {
  id: 'ch01',
  title: 'PROLOGUE',
  coda: ['Failure.', 'The loop.', 'Static.'],

  build(ctx) {
    const { scene, player } = ctx;
    this.phase = 'moor';
    this.t = 0;

    scene.fog = new THREE.FogExp2(new THREE.Color(C.petrol).getHex(), 0.030);
    makeSky(scene, { low: C.moor, mid: C.petrol, high: C.cyan, power: 0.85 });
    this.lights = makeLights(scene, {
      keyColor: C.ember, keyIntensity: 2.6,
      keyDir: new THREE.Vector3(0, 0.10, -1),
      skyColor: C.cyan, groundColor: C.petrol, ambient: 1.15,
      fillColor: C.petrol, fillIntensity: 0.5,
    });

    // ── terrain: flooded moorland ────────────────────────────────
    // The player can never step off the path here — not with an invisible
    // wall, but with water they will not walk into. The corridor sits well
    // above the flood line; everything either side of it is underwater.
    const H = (x, z) => {
      const ridge = smooth(clamp(1 - Math.abs(x) / 13, 0, 1));
      const base = noise.fbm(x * 0.011, z * 0.011, 4) * 1.5;
      return 0.8 * ridge - 2.6 * (1 - ridge) + base * (1 - ridge * 0.75);
    };
    this.H = H;
    this.ground = makeTerrain((x, z) => H(x, z), {
      size: 900, segments: 240, material: matte(C.petrol),
    });
    scene.add(this.ground);

    // the flood, either side
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(2400, 2400),
      unlit(C.cyan, { transparent: true, opacity: 0.5 })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = -0.6;
    scene.add(water);
    this.water = water;

    this.path = makePath((x, z) => H(x, z), { length: 620, from: -80, width: 2.8 });
    scene.add(this.path);

    // ── the broken fence ─────────────────────────────────────────
    const fence = new THREE.Group();
    const rng = mulberry(7);
    for (let i = 0; i < 26; i++) {
      const x = -13 + i * 1.05;
      if (Math.abs(x) < 1.9) continue;              // the gap you walk through
      const h = 1.1 + rng() * 0.5;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, h, 0.09), matte(C.moor));
      post.position.set(x, H(x, 62) + h / 2 - 0.1, 62);
      post.rotation.z = (rng() - 0.5) * 0.5;
      post.castShadow = true;
      fence.add(post);
    }
    scene.add(fence);

    // ── the orchard ──────────────────────────────────────────────
    // Ranks of dead fruit trees. The first place straying is allowed, and
    // straying is rewarded with nothing except more orchard.
    this.orchard = new THREE.Group();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 12; col++) {
        const x = -26 + col * 4.7 + (row % 2) * 1.4;
        const z = 74 + row * 6.2;
        if (Math.abs(x) < 3.2) continue;
        const tree = makeDeadTree(row * 31 + col, { height: 4.4 + ((row * col) % 5) * 0.3 });
        tree.position.set(x, H(x, z), z);
        tree.castShadow = true;
        this.orchard.add(tree);
      }
    }
    scene.add(this.orchard);

    // rotted fruit underfoot
    const fruit = scatter(
      new THREE.IcosahedronGeometry(0.07, 0),
      matte(C.moor),
      420,
      (i) => {
        const r = mulberry(i + 900);
        const x = -30 + r() * 60, z = 72 + r() * 58;
        return { x, y: H(x, z) + 0.05, z, s: 0.7 + r() * 0.8 };
      }
    );
    scene.add(fruit);

    // ── the house ────────────────────────────────────────────────
    this.ruin = makeRuin(3);
    this.ruin.position.set(0, H(0, 128), 128);
    scene.add(this.ruin);

    // ── the Figure ───────────────────────────────────────────────
    // Visible from four minutes away, silhouetted against the last light.
    // Everything after that is approach. You never reach it.
    this.figure = makeFigure(101, { height: 1.86 });
    this.figure.position.set(0, H(0, 126), 126);
    this.figure.rotation.y = Math.PI;
    scene.add(this.figure);

    // ── the Ones That Lost — two, barely resolvable, off the path ─
    this.lost = [];
    [[-38, 150], [44, 168]].forEach(([x, z], i) => {
      const f = makeFigure(200 + i, { height: 1.8 });
      f.position.set(x, H(x, z), z);
      scene.add(f);
      this.lost.push(f);
    });

    // ── rain ─────────────────────────────────────────────────────
    this.rain = new Rain(scene, 2800, { radius: 24, height: 18, speed: 20 });

    // ── the turret (built now, shown after the Cut) ───────────────
    this.turret = this._buildTurret(scene);
    this.turret.visible = false;

    // ── player ───────────────────────────────────────────────────
    player.groundAt = (x, z) => (this.phase === 'turret' ? 40 : H(x, z));
    player.surfaceAt = (x, z) => {
      if (this.phase === 'turret') return 'stone';
      if (Math.abs(x) < 1.5) return z > 70 && z < 140 ? 'mud' : 'water';
      return 'mud';
    };
    player.teleport(0, -40, Math.PI);
    player.speedScale = 1.0;

    ctx.post.set('uMisreg', 1.6);
    ctx.post.set('uSmear', 0.0);
    ctx.post.set('uGrainScale', 1.0);
  },

  _buildTurret(scene) {
    const g = new THREE.Group();
    const stone = matte(C.moor);

    // the drum, half open to the sky
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 3.0, 26, 1, true), stone);
    drum.position.set(0, 41.5, 200);
    drum.material = matte(C.moor, { side: THREE.DoubleSide });
    g.add(drum);

    const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 0.3, 26), stone);
    floor.position.set(0, 39.9, 200);
    floor.receiveShadow = true;
    g.add(floor);

    // the hairline crack under the lens mount
    const crack = new THREE.Mesh(
      new THREE.PlaneGeometry(0.04, 4.2),
      unlit(C.moor)
    );
    crack.rotation.x = -Math.PI / 2;
    crack.rotation.z = 0.4;
    crack.position.set(0.6, 40.07, 200);
    g.add(crack);

    // ── the great lens: a brass-collared refractor ───────────────
    const lens = new THREE.Group();
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.30, 0.36, 2.6, 18),
      matte(C.ash)
    );
    tube.rotation.x = Math.PI / 2 - 0.12;
    lens.add(tube);
    this.collars = [];
    [-0.75, 0.05, 0.85].forEach((z, i) => {
      const col = new THREE.Mesh(
        new THREE.TorusGeometry(0.40 - i * 0.03, 0.075, 8, 22),
        matte(C.ember)
      );
      col.position.z = z;
      col.rotation.y = 0.12;
      lens.add(col);
      this.collars.push(col);
    });
    // Actual glass. The tube was solid brass end to end, which is why it did
    // not read as something you look through.
    const glass = (r, z) => {
      const g = new THREE.Mesh(
        new THREE.CircleGeometry(r, 24),
        new THREE.MeshBasicMaterial({
          color: C.cyan, transparent: true, opacity: 0.30,
          depthWrite: false, side: THREE.DoubleSide,
        })
      );
      g.position.z = z;
      lens.add(g);
      return g;
    };
    this.objective = glass(0.30, 1.28);      // far end, aimed at the path
    this.eyepiece  = glass(0.16, -1.28);     // the end you put your eye to

    const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.22, 1.2, 10), matte(C.ash));
    mount.position.y = -0.9;
    lens.add(mount);
    lens.position.set(0, 41.1, 202.6);
    lens.rotation.y = Math.PI;
    g.add(lens);
    this.lens = lens;

    // the cup, and three white pebbles nobody mentions
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.075, 0.13, 14), matte(C.bone));
    cup.position.set(1.9, 41.35, 203.2);
    g.add(cup);
    this.cup = cup;
    this.pebbles = [];
    for (let i = 0; i < 3; i++) {
      const p = makePebble(i + 40, 0.055);
      p.position.set(2.25 + i * 0.16, 41.32, 203.15 + (i % 2) * 0.09);
      g.add(p);
      this.pebbles.push(p);
    }

    // the parapet
    const para = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.22, 8, 30), stone);
    para.rotation.x = Math.PI / 2;
    para.position.set(0, 41.4, 200);
    g.add(para);

    scene.add(g);
    return g;
  },

  // ── the script ─────────────────────────────────────────────────
  async run(ctx) {
    const { vo, audio, player, post, until, wait, cut } = ctx;

    audio.setAmbient(1.0, 2);
    audio.setRain(1.0, 6);
    audio.setWind(0.16, 0.3, 8);
    audio.setScore(0.9, 10);
    audio.setOrgan(0.0);
    player.enable();

    // 1.1 — bone dry, no reverb, the only line with zero space around it
    vo.say('The path is. As far back as I can remember, it was. It will be.\nMy memory is useless. What is left is to keep moving.', { hold: 9 });

    await wait(11);
    vo.say('Rain. A broken fence. Drenched to the bone, mud on my bare feet.', { hold: 7 });

    // the organ enters beneath the rain, felt rather than heard
    audio.setOrgan(0.16, 22);

    await until(() => player.pos.z > 62);
    await wait(3.5);
    vo.say('The orchard.', { hold: 4 });

    await until(() => player.pos.z > 88);
    await wait(4);
    vo.say('It had long surrendered to rot. The house was worse: roof gone, one wall collapsed, ivy claiming what was left.', { hold: 9 });

    await until(() => player.pos.z > 110);
    vo.say('A figure in front.', { hold: 5 });
    audio.setOrgan(0.34, 6);

    await until(() => player.pos.z > 116);
    // 1.6 — the Watcher's line bleeding into the Traveler's chapter.
    // A second person in the room the player cannot place.
    audio.setStone(0.5, 1);
    vo.say('Travelers and the Ones That Lost die without a sound. I never buried any of them.', { voice: 'watcher', hold: 8 });
    await wait(8);
    audio.setStone(0.0, 3);

    vo.say('Rain gathered on its shoulders and ran from its sleeves. The air heavy, pressing down.', { hold: 8 });

    await until(() => player.pos.z > 120);
    vo.say('Twilight rode the path. Neither of us moved.', { hold: 5 });
    await wait(5.4);

    // ── CUT ──────────────────────────────────────────────────────
    await cut();
    this.phase = 'turret';
    this.turret.visible = true;
    this.rain.set(0.25);
    audio.setRain(0.16, 3);
    audio.setWind(0.7, 0.75, 4);
    audio.setStone(0.55, 2);
    player.teleport(0, 197);
    player.pos.y = 40;

    vo.say('The tea is cold and tasteless. I banished them.', { voice: 'watcher', hold: 6 });

    // the knocking, four floors below — ambient, unremarked
    this.knocking = true;
    this._knockTimer = 0;

    await wait(7);
    vo.say('Every night they knock on the door. Every day the sharp winds batter my bones. I climb to the only surviving turret.', { voice: 'watcher', hold: 9 });
    await wait(10);
    vo.say('I observe.', { voice: 'watcher', hold: 4 });

    // ── PUZZLE: the great lens ───────────────────────────────────
    // The lens carries the gold aura from the moment you arrive, so the one
    // thing in a dark room that does anything is visibly the one thing that
    // does anything.
    ctx.highlight.add(this.lens.children[0], { scale: 1.5, rate: 0.4 });
    this.collars.forEach(c => ctx.highlight.add(c, { scale: 1.6, rate: 0.5 }));

    // Say where to go. The turret is dark and the lens is the only thing in
    // it that does anything; a player who does not walk to it gets no hints
    // at all and simply stands there.
    this._nudge = setInterval(() => {
      if (this.phase === 'lens') return;
      if (player.pos.distanceTo(this.lens.position) < 3.2) return;
      vo.hint('the great lens, at the parapet', 5);
    }, 22000);

    await until(() => player.pos.distanceTo(this.lens.position) < 3.2);
    clearInterval(this._nudge);
    await wait(1.2);
    vo.hint('the glass is filthy', 5);

    this.phase = 'lens';
    player.canMove = false;
    this.lensState = {
      wiped: 0,
      collars: [0.72, -0.55, 0.38],   // error per collar; target is 0
      active: 0,
      solved: false,
      idle: 0,
      sips: 0,
    };

    vo.say('I rest my trembling hands on the great lens overlooking the path. It continues, oblivious to its audience.', { voice: 'watcher', delay: 2, hold: 9 });

    const LOOK = ctx.isTouch ? 'drag' : 'move the mouse';
    const ACT  = ctx.isTouch ? 'tap' : 'press E';

    // you are at the eyepiece now — the frame becomes a view down the tube
    this.eyepieceIn = true;

    // The instruction stays up for as long as the step lasts. A prompt that
    // flashes for five seconds and vanishes is the same as no prompt.
    vo.hint(`${LOOK} to wipe the glass`, 999);
    await until(() => this.lensState.wiped >= 1);
    post.set('uSmear', 1.0);            // you polish the glass with a dirty sleeve
    vo.hint('it will not come properly clean', 4);
    await wait(4);
    vo.hint(`${ACT} for the next collar · ${LOOK} to turn it · line the two images up`, 999);

    await until(() => this.lensState.solved);

    // ── the solve ────────────────────────────────────────────────
    vo.clearHint();
    ctx.highlight.clear();              // spent: the aura goes out
    // Perfect registration. Four full seconds with no audio at all.
    audio.silence(0.4);
    post.set('uMisreg', 0);
    await wait(4);

    // the Watcher's hands tremble, the collars slip
    audio.unsilence(1.5);
    post.set('uMisreg', 2.2);
    this.lensState.solved = false;
    this.lensState.collars = [0.3, -0.22, 0.18];
    this.lensState.seated = [false, false, false];
    this.eyepieceIn = false;
    await wait(1.6);

    await cut();
    this.phase = 'static';
    this.turret.visible = false;
    this.rain.set(1);
    audio.setRain(1, 2);
    audio.setWind(0.16, 0.3, 4);
    audio.setStone(0.05, 2);
    player.teleport(0, 120, Math.PI);
    player.canMove = true;
    player.locked = true;                 // the stick is read and discarded

    vo.say('I had to move, but my resolve was broken. Something bore into my mind.', { hold: 6 });
    await wait(7);
    for (const w of ['Patient.', 'Buried.', 'Fear.']) {
      vo.say(w, { hold: 3.2 });
      vo.flash(0.02);
      audio.knock('outside', 0.4);
      await wait(4);
    }

    vo.say('Every direction a mistake. The failure, unacceptable.', { hold: 6 });
    await wait(7);
    vo.say('The figure stood in the ruins, taking root in my emptiness.', { hold: 6 });
    this.ivyGrow = 0;
    await wait(7);
    vo.say('I was still.', { hold: 3 });
    await wait(3.4);
    vo.say('Static.', { hold: 3 });

    // on the word, the image degrades to literal analogue static
    this.staticBurst = 0.5;
    audio.whiteNoise(0.5, 0.02);
    await wait(0.35);
    audio.whiteNoise(0, 0.3);
    await wait(3);

    await cut();
    this.phase = 'turret';
    this.turret.visible = true;
    this.rain.set(0.25);
    audio.setRain(0.16, 2);
    audio.setWind(0.85, 0.8, 3);
    audio.setStone(0.55, 2);
    player.teleport(0, 197);
    player.pos.y = 40;
    player.locked = false;
    this.knockLoud = true;

    vo.say('The knocking.\nUnstoppable.', { voice: 'watcher', hold: 6 });
    await wait(7);
    vo.say('Its echoes torment the walls around me. The wooden stairs leading to the turret squeak under every step.', { voice: 'watcher', hold: 9 });
    await wait(10);
    vo.say('My eyes twitch. I have to clean the great lens—the birds had soiled it again. I polish the glass with my dirty sleeve.', { voice: 'watcher', hold: 9 });
    await wait(10);
    vo.say('A sip.', { voice: 'watcher', hold: 3 });
    audio.cup();
    await wait(4);

    await cut();
    this.phase = 'release';
    this.turret.visible = false;
    this.knocking = false;
    this.rain.set(1);
    audio.setRain(1, 2);
    audio.setWind(0.16, 0.3, 4);
    audio.setStone(0.05, 2);
    player.teleport(0, 120, Math.PI);

    vo.say('The path demands sacrifice.', { hold: 4 });
    await wait(5);
    vo.say('The figure obeys—it breaks my resolve.', { hold: 5 });
    this.figureTurns = true;                 // the one time it moves
    await wait(6);

    vo.say('I let go.', { hold: 3.5 });
    player.canMove = false;
    this.falling = true;
    await wait(4);

    // fully submerged: everything low-passed
    audio.setRain(0.1, 2);
    audio.setWind(0.05, 0.1, 2);
    audio.setSub(0.7, 2);
    vo.say('A corpse driven by the current, dragged down a cold river.', { hold: 7 });
    await wait(8);
    vo.say('No turning back. No direction.', { hold: 5 });
    await wait(6);
    vo.say("I've let the water carry my remains. The current gave up its burden.", { hold: 7 });
    await wait(8);

    await ctx.fade(1, 2.5);
    vo.say('I washed up on another shore.', { hold: 5 });
    audio.silence(1.5);
    await wait(6);                            // hold black six seconds

    // ── final cut: the Watcher, and the fourth wall ──────────────
    audio.unsilence(2);
    await cut();
    this.phase = 'turret';
    this.turret.visible = true;
    this.rain.set(0.25);
    audio.setSub(0, 2);
    audio.setRain(0.14, 2);
    audio.setWind(0.8, 0.8, 3);
    audio.setStone(0.55, 2);
    player.teleport(0, 197);
    player.pos.y = 40;
    await ctx.fade(0, 3);

    vo.say('Through the glass, I see him on the path. The razor wind begins its work — clothes, skin, whatever’s left.', { voice: 'watcher', hold: 9 });
    await wait(10);

    // Break the fourth wall here and nowhere else in the game.
    vo.say('Tea?', { voice: 'watcher', hold: 4 });
    audio.cup();
    await wait(4.5);
  },

  update(dt, ctx) {
    this.t += dt;
    const { player, post, audio, camera } = ctx;

    this.rain.update(dt, camera.position);

    // ── the knocking ─────────────────────────────────────────────
    // knock · knock-knock ········· knock — 4.15 s, never quantised.
    if (this.knocking) {
      this._knockTimer -= dt;
      if (this._knockTimer <= 0) {
        this._knockTimer = 4.15 + (Math.random() - 0.5) * 0.25;
        const v = this.knockLoud ? 0.85 : 0.42;
        audio.knock('inside', v);
        setTimeout(() => audio.knock('inside', v * 0.9), 750);
        setTimeout(() => audio.knock('inside', v * 0.85), 1050);
        setTimeout(() => audio.knock('inside', v), 3400);
      }
    }

    post.ease('uEyepiece', this.eyepieceIn ? 1 : 0, dt, 1.4);

    // ── the lens puzzle ──────────────────────────────────────────
    if (this.phase === 'lens' && this.lensState) {
      const L = this.lensState;

      if (L.wiped < 1) {
        // the wipe is a drag: accumulate look movement
        const dx = Math.abs(player.yaw - (this._lastYaw ?? player.yaw));
        this._lastYaw = player.yaw;
        L.wiped = Math.min(1, L.wiped + dx * 0.55);
        post.set('uSmear', L.wiped * 0.85);
      } else if (!L.solved) {
        // The act input takes the next collar. Without this only collar 0 can
        // be turned, and since the solve needs all three near zero the puzzle
        // is unsolvable — which is exactly what shipped.
        if (ctx.actionPressed) {
          L.active = (L.active + 1) % L.collars.length;
          audio.stoneSet();
          ctx.vo.hint(`collar ${L.active + 1} of ${L.collars.length}`, 2.5);
        }

        // look-X turns the active collar
        const dx = player.yaw - (this._lastYaw ?? player.yaw);
        this._lastYaw = player.yaw;
        L.collars[L.active] = clamp(L.collars[L.active] - dx * 1.15, -1.4, 1.4);
        this.collars[L.active].rotation.z += dx * 2.2;

        // A brass collar seats. Without a detent the solve asks the player to
        // hold three continuous values inside a combined 0.10 window using one
        // aggregate audio cue — 1px of mouse is 0.0024 units, so that is luck,
        // not attention. Inside the detent the collar drops onto its seat and
        // stays there, and the player hears it.
        L.seated = L.seated || [false, false, false];
        L.collars.forEach((v, i) => {
          if (!L.seated[i] && Math.abs(v) < 0.05) {
            L.seated[i] = true;
            L.collars[i] = 0;
            audio.stoneSet();
            ctx.vo.hint(`collar ${i + 1} seats`, 2.2);
          } else if (L.seated[i] && Math.abs(v) > 0.14) {
            L.seated[i] = false;             // turned back off its seat
          }
        });

        // Which collar your hands are on is mechanism state, not a solution
        // hint. Its brightness is the per-collar feedback the aggregate tone
        // cannot give: warmer as that collar nears its seat.
        this.collars.forEach((c, i) => {
          const near = 1 - Math.min(1, Math.abs(L.collars[i]) / 1.4);
          c.material.emissive = new THREE.Color(C.ember).multiplyScalar(
            i === L.active ? 0.18 + near * 0.75 : (L.seated[i] ? 0.16 : 0.0));
        });

        const err = L.collars.reduce((a, v) => a + Math.abs(v), 0);

        // the puzzle drives the game's own misregistration
        post.set('uMisreg', 1.0 + err * 9);

        // No meter, no UI. Each collar seats (above); short of that the wind
        // thins and a sub-bass swell rises as the plates approach
        // registration. Perfect registration is a silence.
        audio.setWind(0.7 * clamp(err, 0.06, 1), 0.75, 0.4);
        audio.setSub(clamp(1 - err, 0, 1) * 0.8, 0.4);

        if (err < 0.10) {
          L.solved = true;
          audio.setSub(0, 0.3);
        }

        // assist ladder: every 90 s the Watcher takes a sip and the mix
        // biases so the convergence tone is easier to hear.
        L.idle += dt;
        L.total = (L.total || 0) + dt;
        if (L.idle > 90 && L.sips < 3) {
          L.idle = 0; L.sips++;
          ctx.vo.say('Another sip.', { voice: 'watcher', hold: 3 });
          audio.cup();
          audio.setWind(0.7 * (1 - L.sips * 0.25), 0.7, 3);
        }
        // and after four and a half minutes, name the worst collar. The
        // player still has to turn it; the audio alone reports total error,
        // so without this there is no way to tell which of three is at fault.
        if (L.total > (L._nameAt ?? 270)) {
          L._nameAt = L.total + 120;         // and again, on the current worst
          let worst = 0;
          L.collars.forEach((v, i) => { if (Math.abs(v) > Math.abs(L.collars[worst])) worst = i; });
          ctx.vo.hint(`collar ${worst + 1} is furthest out`, 6);
        }
      }
    }

    // wipe interaction needs a click-to-start; approximate with proximity
    if (this.phase === 'lens' && this.lensState && this.lensState.wiped < 1) {
      if (ctx.actionHeld) this.lensState.wiped = Math.min(1, this.lensState.wiped + dt * 0.5);
    }

    // ── the figure turns its head, once ──────────────────────────
    if (this.figureTurns && this.figure) {
      this.figure.rotation.y += (Math.PI + 0.5 - this.figure.rotation.y) * Math.min(1, dt * 0.6);
    }

    // ── ivy takes root in the emptiness ──────────────────────────
    if (this.ivyGrow !== undefined && this.ivyGrow < 1) {
      this.ivyGrow = Math.min(1, this.ivyGrow + dt * 0.09);
      this.figure.scale.y = 1 + this.ivyGrow * 0.02;
    }

    // ── analogue static ──────────────────────────────────────────
    if (this.staticBurst > 0) {
      this.staticBurst -= dt;
      post.set('uGrain', 0.55);
      post.set('uMisreg', 14);
      if (this.staticBurst <= 0) {
        post.set('uGrain', 0.09);
        post.set('uMisreg', 2.0);
      }
    }

    // ── the fall ─────────────────────────────────────────────────
    if (this.falling) {
      player.pos.y -= dt * 1.6;
      player.eyeHeight = Math.max(0.15, player.eyeHeight - dt * 0.5);
      post.ease('uDesat', 0.6, dt, 0.4);
    }

    // twilight rides the path: the key follows the vanishing point
    this.lights.key.target.position.set(player.pos.x, 0, player.pos.z + 60);
  },

  dispose(ctx) {
    this.rain?.dispose();
    ctx.player.eyeHeight = 1.70;
    ctx.player.canMove = true;
    ctx.player.locked = false;
    ctx.post.set('uDesat', 0);
    ctx.post.set('uGrain', 0.09);
  },
};
