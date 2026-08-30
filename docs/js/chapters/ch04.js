// ── 04 · EXPANSION ──────────────────────────────────────────────
// "The two voices stop being two."
//
// Puzzle: The Footprints. Thirty-two bare prints circle the egg. Walk the ring
// by stepping into them — but they are not spaced to your stride, so you have
// to walk like somebody else, and the somebody else is you.
//
// Then ninety seconds of nothing, which the player must choose to meet.

import * as THREE from 'three';
import { noise } from '../lib/noise.js';
import {
  C, matte, unlit, makeSky, makeLights, makeTerrain, makeEgg, makePebble,
  scatter, mulberry, clamp, lerp,
} from '../engine/world.js';

const RING_R = 8.0;
const PRINTS = 32;

export default {
  id: 'ch04',
  title: 'EXPANSION',
  coda: ['The Silence.', 'The wait.', 'The rebirth.'],
  codaBigFirst: true,

  build(ctx) {
    const { scene, player } = ctx;
    this.phase = 'shallows';
    this.t = 0;

    scene.fog = new THREE.FogExp2(new THREE.Color(C.petrol).getHex(), 0.038);
    this.sky = makeSky(scene, { low: C.moor, mid: C.petrol, high: C.bone, power: 0.7 });
    this.lights = makeLights(scene, {
      keyColor: C.bone, keyIntensity: 0.75,
      keyDir: new THREE.Vector3(0, 1, -0.15),
      skyColor: C.bone, groundColor: C.petrol, ambient: 0.8,
      fillColor: C.bone, fillIntensity: 0.3,
      shadows: true,
    });

    const H = (x, z) => {
      const d = Math.hypot(x, z - 60);
      const hill = Math.max(0, 4.2 - d * 0.16);          // the bare hill
      const island = noise.fbm(x * 0.02, z * 0.02, 4) * 2.2;
      const beach = clamp((z + 40) / 40, 0, 1);
      return lerp(-0.8, island + hill, beach);
    };
    this.H = H;
    this.ground = makeTerrain(H, { size: 300, segments: 200, material: matte(C.petrol), receiveShadow: true, centerZ: 40 });
    scene.add(this.ground);

    const sea = new THREE.Mesh(new THREE.PlaneGeometry(500, 300), unlit(C.moor));
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(0, -0.85, -120);
    scene.add(sea);

    // ── the half-tone forest ─────────────────────────────────────
    // Leaves black above, bone below. In wind the canopy inverts in patches,
    // and the forest reads as a moving half-tone screen.
    // Instanced, not 3,600 individual meshes — the naive version is thousands
    // of draw calls and tanks the frame rate on any hardware.
    const spots = [];
    for (let i = 0; i < 900; i++) {
      const r = mulberry(i + 3000);
      const a = r() * Math.PI * 2, rad = 14 + r() * 62;
      const x = Math.cos(a) * rad, z = 60 + Math.sin(a) * rad;
      if (Math.hypot(x, z - 60) < 13) continue;           // the clearing
      spots.push({ x, z, y: H(x, z), h: 3 + r() * 5, r });
    }

    const trunks = scatter(
      new THREE.CylinderGeometry(0.06, 0.13, 1, 5), matte(C.moor), spots.length,
      (i) => {
        const s = spots[i];
        return { x: s.x, y: s.y + s.h / 2, z: s.z, s: 1, sy: s.h };
      }
    );
    // scatter() only does uniform scale, so stretch the trunks after the fact
    {
      const d = new THREE.Object3D(), m = new THREE.Matrix4();
      for (let i = 0; i < spots.length; i++) {
        trunks.getMatrixAt(i, m);
        d.position.setFromMatrixPosition(m);
        d.scale.set(1, spots[i].h, 1);
        d.rotation.set(0, 0, 0);
        d.updateMatrix();
        trunks.setMatrixAt(i, d.matrix);
      }
      trunks.instanceMatrix.needsUpdate = true;
    }
    scene.add(trunks);

    const leafCount = spots.length * 3;
    this.leafMesh = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(1.5, 1.5),
      matte(C.moor, { side: THREE.DoubleSide }),
      leafCount
    );
    this.leafMesh.frustumCulled = false;
    this.leafPh = new Float32Array(leafCount);
    this.leafBase = [];
    {
      const d = new THREE.Object3D();
      let n = 0;
      for (const s of spots) {
        for (let l = 0; l < 3; l++) {
          d.position.set(s.x + (s.r() - 0.5) * 1.6, s.y + s.h * (0.6 + l * 0.16), s.z + (s.r() - 0.5) * 1.6);
          const rx = -Math.PI / 2 + (s.r() - 0.5) * 0.7;
          d.rotation.set(rx, s.r() * 3, (s.r() - 0.5) * 0.7);
          d.scale.setScalar(1);
          d.updateMatrix();
          this.leafMesh.setMatrixAt(n, d.matrix);
          this.leafMesh.setColorAt(n, new THREE.Color(C.moor));
          this.leafPh[n] = s.r() * 6.28;
          n++;
        }
      }
      this.leafMesh.count = n;
      this.leafMesh.instanceMatrix.needsUpdate = true;
      if (this.leafMesh.instanceColor) this.leafMesh.instanceColor.needsUpdate = true;
    }
    scene.add(this.leafMesh);
    this._cMoor = new THREE.Color(C.moor);
    this._cBone = new THREE.Color(C.bone);
    this._cTmp = new THREE.Color();

    // nests, hives, burrows — every affordance of a living forest, all empty
    const nests = scatter(
      new THREE.TorusGeometry(0.18, 0.07, 5, 9), matte(C.ash), 40,
      (i) => {
        const r = mulberry(i + 7000);
        const a = r() * 6.28, rad = 16 + r() * 50;
        const x = Math.cos(a) * rad, z = 60 + Math.sin(a) * rad;
        return { x, y: H(x, z) + 2.4 + r() * 2, z, rx: Math.PI / 2 };
      }
    );
    scene.add(nests);

    // ── the egg ──────────────────────────────────────────────────
    this.egg = makeEgg(2.0);
    this.egg.position.set(0, H(0, 60) + 2.4, 60);
    scene.add(this.egg);

    // it is a light, from step 1 onward
    this.eggLight = new THREE.PointLight(C.bone, 0, 30, 2);
    this.eggLight.position.copy(this.egg.position);
    scene.add(this.eggLight);

    // the black disc that is not the sun, and is never explained
    const disc = new THREE.Mesh(new THREE.CircleGeometry(60, 48), unlit(C.moor, { fog: false }));
    disc.position.set(-140, 44, 300);
    disc.lookAt(0, 10, 60);
    scene.add(disc);

    // strike-marks and bone chips: somebody tried to break it
    const chips = scatter(
      new THREE.TetrahedronGeometry(0.09), matte(C.bone), 26,
      (i) => {
        const r = mulberry(i + 8000);
        const a = r() * 6.28, rad = 1.8 + r() * 1.4;
        const x = Math.cos(a) * rad, z = 60 + Math.sin(a) * rad;
        return { x, y: H(x, z) + 0.06, z };
      }
    );
    scene.add(chips);

    // ── the ring of footprints ───────────────────────────────────
    // Old, sharp-edged, unmistakably barefoot and adult. The same prints from
    // the orchard mud and the black sand.
    this.prints = [];
    const printGeo = new THREE.CircleGeometry(0.13, 10);
    for (let i = 0; i < PRINTS; i++) {
      const a = -i / PRINTS * Math.PI * 2;              // widdershins
      const x = Math.cos(a) * RING_R, z = 60 + Math.sin(a) * RING_R;
      const m = new THREE.Mesh(printGeo, unlit(C.moor, { transparent: true, opacity: 0.6 }));
      m.rotation.x = -Math.PI / 2;
      m.scale.set(0.75, 1, 1.5);
      m.position.set(x, H(x, z) + 0.03, z);
      m.userData = { i, x, z };
      scene.add(m);
      this.prints.push(m);
    }

    // ── the shattered lens, for the turret beat ──────────────────
    this.turret = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 0.3, 26), matte(C.moor));
    floor.position.set(0, 39.9, 400);
    this.turret.add(floor);
    for (let i = 0; i < 24; i++) {
      const r = mulberry(i + 90);
      const sh = new THREE.Mesh(
        new THREE.CircleGeometry(0.06 + r() * 0.12, 3),
        unlit(C.cyan, { transparent: true, opacity: 0.7 })
      );
      sh.rotation.x = -Math.PI / 2;
      sh.rotation.z = r() * 6.28;
      sh.position.set((r() - 0.5) * 4, 40.08, 400 + (r() - 0.5) * 4);
      this.turret.add(sh);
    }
    this.turret.visible = false;
    scene.add(this.turret);

    player.groundAt = (x, z) => (this.phase === 'turret' ? 40 : H(x, z));
    player.surfaceAt = (x, z) => {
      if (this.phase === 'turret') return 'stone';
      if (H(x, z) < -0.5) return 'water';
      if (Math.hypot(x, z - 60) < 12) return 'ash';
      return 'grass';
    };
    player.teleport(0, -50, Math.PI);

    ctx.post.set('uMisreg', 6);
    ctx.post.set('uSmear', 1.0);
  },

  async run(ctx) {
    const { vo, audio, player, post, until, wait, cut } = ctx;

    audio.setAmbient(1, 2);
    audio.setWind(0.22, 0.4, 5);
    audio.setRain(0, 1);
    audio.setScore(0.6, 8);
    audio.setOrgan(0.12, 12);
    audio.setSub(0.5, 12);                      // the egg, never identified
    audio.setStone(0.05, 3);
    player.enable();

    vo.say('It was an island. Thick foliage but no wildlife.', { hold: 6 });

    await until(() => player.pos.z > -6);
    await wait(4);
    // the reveal lands five seconds before the line
    await until(() => player.pos.z > 24);
    await wait(5);
    vo.say('In the middle of it, on top of a small hill, stood a giant egg.', { hold: 7 });

    await until(() => Math.hypot(player.pos.x, player.pos.z - 60) < RING_R + 3);
    vo.say('I had to protect it until something hatched.', { voice: 'merged', hold: 6 });
    await wait(7);
    vo.say('Someone had tried to break it.', { voice: 'merged', hold: 5 });
    await wait(6);
    vo.say('The footprints circled its white structure. Were they mine?', { voice: 'merged', hold: 7 });

    // ── PUZZLE: the footprints ───────────────────────────────────
    this.ring = { next: 0, best: 0, resets: 0, elapsed: 0, done: false, assist: false };
    await wait(6);
    vo.hint('step into them', 6);

    let said = { watched: false, waited: false, more: false };
    const watchdog = setInterval(() => {
      if (this.ring.done) return;
      if (this.ring.next >= 1 && !said.watched) { said.watched = true; vo.say('I watched.', { voice: 'merged', hold: 4 }); }
      if (this.ring.resets >= 1 && !said.waited) { said.waited = true; vo.say('I waited.', { voice: 'merged', hold: 4 }); }
      if ((this.ring.resets >= 2 || this.ring.elapsed > 240) && !said.more) {
        said.more = true; vo.say('I waited more.', { voice: 'merged', hold: 4 });
      }
    }, 900);

    await until(() => this.ring.done);
    clearInterval(watchdog);

    // ── the circle closes ────────────────────────────────────────
    // The line the whole game is built to deliver, in absolute silence.
    audio.silence(0.5);
    await wait(1.5);
    vo.say('I watch as you step into my footprints. We wait together to break it.', { voice: 'merged', hold: 11 });
    await wait(12);

    // ── CUT: the lens lay shattered ──────────────────────────────
    audio.unsilence(2);
    await cut();
    this.phase = 'turret';
    this.turret.visible = true;
    player.teleport(0, 400);
    player.pos.y = 40;
    player.eyeHeight = 0.6;
    audio.setStone(0.7, 2);
    audio.setWind(0.55, 0.65, 2);
    audio.setSub(0, 3);

    vo.say('The lens lay shattered.', { voice: 'watcher', hold: 5 });
    await wait(6);
    vo.say('What is left?', { voice: 'watcher', hold: 5 });
    await wait(6);

    // the smear is gone for the rest of the game, and it feels like a loss
    post.set('uSmear', 0);
    player.eyeHeight = 2.40;

    // ── THE NINETY SECONDS ───────────────────────────────────────
    await cut();
    this.phase = 'wait';
    this.turret.visible = false;
    player.teleport(this.prints[0].userData.x, this.prints[0].userData.z);
    audio.silence(0.6);
    post.set('uMisreg', 0);                     // something has stopped
    this.waiting = 0;
    this.walkedAway = false;

    await until(() => this.waiting >= 80 || this.walkedAway);

    if (this.walkedAway) {
      // the circle breaks. They will only make this mistake once.
      audio.unsilence(1.5);
      vo.hint('the circle is broken', 5);
      this.ring.done = false; this.ring.next = 0; this.ring.resets++;
      this.phase = 'ring';
      await until(() => this.ring.done);
      audio.silence(0.5);
      this.waiting = 0; this.walkedAway = false;
      this.phase = 'wait';
      await until(() => this.waiting >= 80);
    }

    // the only sound in ninety seconds
    audio.unsilence(0.2);
    audio.setAmbient(0, 0.1);
    vo.say('The silence was too loud.', { voice: 'merged', hold: 6 });
    await until(() => this.waiting >= 90);

    // white noise as a substance, not a stinger
    audio.setAmbient(1, 0.1);
    audio.whiteNoise(0.5, 0.15);
    vo.say('White noise.', { voice: 'merged', hold: 4 });
    await wait(4);

    vo.say('Cracks.', { voice: 'merged', hold: 3 });
    this.cracking = 1;
    await wait(4);

    vo.say('The egg burst.', { voice: 'merged', hold: 3 });
    await wait(1.5);

    // the burst, frame-exact
    this.eggLight.color = new THREE.Color(C.ember);
    this.eggLight.intensity = 40;
    await wait(0.2);
    vo.flash(0.001);
    audio.burst();
    audio.whiteNoise(0, 0.4);
    await ctx.fade(1, 0.08);
    await wait(0.35);
    this.staticBurst = 0.1;
    await wait(0.6);
    audio.silence(0.4);
    await wait(6);                              // black, six seconds, silent

    vo.say('Rebirth.', { voice: 'merged', hold: 4 });
    audio.unsilence(3);
    audio.setVoiceTexture(0.8, 4);
    await wait(5);

    // ── the dark ─────────────────────────────────────────────────
    this.phase = 'dark';
    audio.setVoiceTexture(0, 4);
    audio.setStone(0.5, 3);                     // the rooms have merged
    audio.setAmbient(0.4, 2);
    vo.say('Waking up was hard. It felt like lifting lead when I tried to open my eyes.', { hold: 8 });
    await wait(9);
    vo.say('I remembered white.', { hold: 4 });
    await wait(5);
    vo.say('All was dark now.', { hold: 5 });
    await wait(5);
  },

  update(dt, ctx) {
    this.t += dt;
    const { player, post, audio, vo } = ctx;

    // The canopy inverts in slow, large patches: black above, bone below, so
    // the forest reads as a moving half-tone screen. Colour only — rotating
    // 2,700 instances every frame is not worth the cost.
    if (this.leafMesh && this.leafMesh.instanceColor) {
      const n = this.leafMesh.count;
      for (let i = 0; i < n; i++) {
        const w = Math.sin(this.t * 0.28 + this.leafPh[i]);
        this._cTmp.lerpColors(this._cMoor, this._cBone, clamp(w * 0.5 + 0.5, 0, 1) * 0.75);
        this.leafMesh.setColorAt(i, this._cTmp);
      }
      this.leafMesh.instanceColor.needsUpdate = true;
    }

    // ── the footprint ring ───────────────────────────────────────
    if (this.ring && !this.ring.done && (this.phase === 'shallows' || this.phase === 'ring' || this.phase === 'wait')) {
      const R = this.ring;
      R.elapsed += dt;

      // stride scales with how hard you are pushing the stick — the prints
      // are not spaced to your default, so you must feather it
      player.strideLength = lerp(0.42, 1.14, player.inputMag);

      if (this._stepFlag) {
        this._stepFlag = false;
        const p = this.prints[R.next];
        const d = Math.hypot(player.pos.x - p.userData.x, player.pos.z - p.userData.z);
        if (d < 0.55) {
          R.next++;
          audio.knock('inside', 0.55);           // from inside the shell
          p.material.color = new THREE.Color(C.bone);
          p.material.opacity = 0.9;
          // 2% of remaining luminance per step: geometric, so the last eight
          // steps are much darker than the first eight
          this.lights.hemi.intensity *= 0.965;
          this.lights.key.intensity *= 0.965;
          this.eggLight.intensity = (1 - this.lights.hemi.intensity / 0.8) * 14;
          audio.setAmbient(Math.max(0.02, 1 - R.next / PRINTS), 0.3);
          if (R.next >= PRINTS) { R.done = true; this.phase = 'wait'; }
        } else if (d > 1.6) {
          // a miss resets the count. No sound of failure, no message —
          // the world simply gets bright again.
          if (R.next > R.best) R.best = R.next;
          if (R.next > 2) R.resets++;
          R.next = 0;
          this.lights.hemi.intensity = 0.8;
          this.lights.key.intensity = 0.75;
          this.eggLight.intensity = 0;
          audio.setAmbient(1, 4);
          this.prints.forEach(pr => { pr.material.color = new THREE.Color(C.moor); pr.material.opacity = 0.6; });
        }
      }

      // assist: after three full resets, your own prints persist for ten
      // seconds so you can see your gait against the target gait
      if (R.resets >= 3 && !R.assist) {
        R.assist = true;
        this.showOwnPrints = true;
      }
    }

    // ── the ninety seconds ───────────────────────────────────────
    if (this.phase === 'wait' && this.ring?.done) {
      if (player.moving) {
        this.walkedAway = true;
      } else {
        this.waiting = (this.waiting || 0) + dt;
      }
    }

    if (this.cracking) {
      this.cracking += dt;
      const s = this.egg.userData.seam;
      s.scale.x = 1 + this.cracking * 4;
      s.material.opacity = Math.min(1, 0.5 + this.cracking * 0.3);
      this.eggLight.intensity = 6 + Math.sin(this.t * 30) * 4;
    }

    if (this.staticBurst > 0) {
      this.staticBurst -= dt;
      post.set('uMisreg', 14);
      if (this.staticBurst <= 0) post.set('uMisreg', 2);
    }
  },

  onStep(e) { this._stepFlag = true; },

  dispose(ctx) {
    ctx.player.strideLength = 0.86;
    ctx.post.set('uSmear', 0);
    ctx.audio.setSub(0, 2);
  },
};
