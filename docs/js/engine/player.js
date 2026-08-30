// First-person controller. The game has exactly two verbs — walking and
// looking — so this file is doing most of the interaction design.

import * as THREE from 'three';
import { save } from './save.js';

const HALF_PI = Math.PI / 2;

export class Player {
  constructor(camera, dom) {
    this.camera = camera;
    this.dom = dom;
    this.touch = null;               // set by main when a controller exists

    this.pos = new THREE.Vector3(0, 0, 0);
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;

    // ── the body (00_design_bible.md §4.4) ──────────────────────
    this.eyeHeight = 1.70;      // ch03 drifts this to 2.40 and never restores
    this.baseSpeed = 1.55;      // m/s — a walk, never a jog
    this.speedScale = 1.0;      // ch02's limp takes this to 0.85, permanently
    this.strideLength = 0.78;
    this.locked = false;        // ch01: "I was still. / Static."
    this.canMove = true;
    this.lookLocked = false;      // a chapter has taken the look input
    this.lookDX = 0; this.lookDY = 0;
    this.headingNoise = 0;      // ch06: a person cannot walk a straight line

    // ── state the chapters read ─────────────────────────────────
    this.distance = 0;
    this.strideAccum = 0;
    this.lastStepPos = new THREE.Vector3();
    this.moving = false;
    this.inputMag = 0;          // 0..1 — ch04 reads this for gait matching
    this.limpPhase = 0;

    this.groundAt = () => 0;    // chapters install a heightfield here
    this.surfaceAt = () => 'mud';
    this.onStep = null;
    this.onMove = null;

    this.keys = Object.create(null);
    this.bob = 0;
    this.bobAmt = 1;
    this.tiltTarget = 0;
    this.tilt = 0;
    this.fovTarget = save.settings.fov;

    this.paused = false;
    this._bind();
  }

  get s() { return save.settings; }

  /** The player's chosen FOV — chapters restore to this, not to a literal. */
  get settingsFov() { return save.settings.fov; }

  _bind() {
    const kd = (e) => {
      this.keys[e.code] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
    };
    const ku = (e) => { this.keys[e.code] = false; };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    // a tab-out must not leave a key stuck down
    window.addEventListener('blur', () => { this.keys = Object.create(null); });

    this.dom.addEventListener('click', () => {
      if (this.touchMode) return;                 // no pointer lock on a phone
      if (!this.pointerLocked && this.enabled && !this.paused) {
        this.dom.requestPointerLock?.();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === this.dom;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.pointerLocked || this.paused) return;
      this._look(e.movementX, e.movementY, 0.0021 * this.s.sensitivity);
    });
  }

  /** One place where inversion and sensitivity are applied. */
  _look(dx, dy, scale) {
    const sx = this.s.invertX ? -1 : 1;
    const sy = this.s.invertY ? -1 : 1;
    const ax = -dx * scale * sx;
    const ay = -dy * scale * sy;

    // A chapter can take the look input for itself — ch01's collars do. The
    // head has to stop moving while it does. If the whole frame swings with
    // the drag, the small thing the drag is actually changing is invisible,
    // and the player never learns that the drag is doing anything at all.
    if (this.lookLocked) { this.lookDX += ax; this.lookDY += ay; return; }

    this.yaw   += ax;
    this.pitch += ay;
    this.pitch = Math.max(-HALF_PI + 0.05, Math.min(HALF_PI - 0.05, this.pitch));
  }

  /** Radians of look input since the last call, and zero it. Only meaningful
   *  while lookLocked; a chapter that polls this owns the input that frame. */
  takeLook() {
    const d = this.lookDX;
    this.lookDX = 0; this.lookDY = 0;
    return d;
  }

  enable()  { this.enabled = true; }
  disable() { this.enabled = false; if (this.pointerLocked) document.exitPointerLock(); }

  setPaused(p) {
    this.paused = p;
    if (p && this.pointerLocked) document.exitPointerLock();
  }

  /** Look-direction is preserved across the Cut — this is what sells two
   *  bodies as one nervous system. Chapters call this instead of resetting. */
  teleport(x, z, yaw = null) {
    this.pos.set(x, this.groundAt(x, z), z);
    if (yaw !== null) this.yaw = yaw;
    this.lastStepPos.copy(this.pos);
    this.vel.set(0, 0, 0);
  }

  get forward() {
    return new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }

  update(dt) {
    if (this.paused) return;

    // ── look, from touch ────────────────────────────────────────
    if (this.touch?.enabled) {
      const d = this.touch.takeLook();
      if (d.x || d.y) this._look(d.x, d.y, 0.0052 * this.s.touchSensitivity);
    }

    // ── move ────────────────────────────────────────────────────
    const k = this.keys;
    let ix = 0, iz = 0;
    if (!this.locked && this.canMove && this.enabled) {
      if (k.KeyW || k.ArrowUp)    iz += 1;
      if (k.KeyS || k.ArrowDown)  iz -= 1;
      if (k.KeyA || k.ArrowLeft)  ix -= 1;
      if (k.KeyD || k.ArrowRight) ix += 1;

      if (this.touch?.enabled) {
        ix += this.touch.moveX;
        iz += this.touch.moveY;
      }
    }

    const mag = Math.min(1, Math.hypot(ix, iz));
    this.inputMag += (mag - this.inputMag) * Math.min(1, dt * 9);

    // ch06: a very low-frequency heading drift, below the threshold of
    // conscious correction and above the threshold of visible result.
    if (this.headingNoise > 0 && mag > 0.01) {
      this._hn = (this._hn || 0) + dt;
      this.yaw += Math.sin(this._hn * 0.503) * this.headingNoise * dt;
    }

    if (mag > 0.001) {
      const f = this.forward;
      // right = forward x up. Facing +Z with +Y up, that is -X — the obvious
      // (f.z, 0, -f.x) is the LEFT vector and mirrors both D and the stick.
      const r = new THREE.Vector3(-f.z, 0, f.x);
      const dir = new THREE.Vector3()
        .addScaledVector(f, iz / (mag || 1))
        .addScaledVector(r, ix / (mag || 1))
        .normalize();

      const speed = this.baseSpeed * this.speedScale * mag;
      this.vel.lerp(dir.multiplyScalar(speed), Math.min(1, dt * 7));
    } else {
      this.vel.lerp(new THREE.Vector3(), Math.min(1, dt * 9));
    }

    const step = this.vel.clone().multiplyScalar(dt);
    this.pos.x += step.x;
    this.pos.z += step.z;

    const travelled = Math.hypot(step.x, step.z);
    this.distance += travelled;
    this.strideAccum += travelled;
    this.moving = travelled > 0.0006;

    // ── footfall ────────────────────────────────────────────────
    // Stride length is what ch04's puzzle is actually testing, so it is a
    // real property of the body rather than a timer.
    if (this.strideAccum >= this.strideLength) {
      this.strideAccum -= this.strideLength;
      this.limpPhase ^= 1;
      const surf = this.surfaceAt(this.pos.x, this.pos.z);
      if (this.onStep) {
        this.onStep({
          x: this.pos.x, z: this.pos.z,
          surface: surf,
          left: this.limpPhase === 0,
          // the ch02 limp lands harder on one foot
          vel: (this.speedScale < 0.95 && this.limpPhase === 0) ? 1.25 : 1.0,
        });
      }
      this.lastStepPos.set(this.pos.x, 0, this.pos.z);
    }

    // ── camera ──────────────────────────────────────────────────
    const g = this.groundAt(this.pos.x, this.pos.z);
    this.pos.y += (g - this.pos.y) * Math.min(1, dt * 10);

    // head bob, and the limp: an asymmetric bob, not a speed multiplier.
    // headBob at 0 is a real accessibility setting, so it must reach zero.
    const amt = this.bobAmt * this.s.headBob;
    const bobSpeed = travelled / Math.max(this.strideLength, 0.01) * Math.PI * 2;
    this.bob += bobSpeed;
    const limp = this.speedScale < 0.95 ? 1 : 0;
    const bobY = (Math.sin(this.bob) * 0.028
                 - limp * Math.max(0, Math.sin(this.bob)) * 0.026) * amt;
    const bobX = Math.cos(this.bob * 0.5) * 0.019 * amt;

    this.camera.position.set(
      this.pos.x + bobX * Math.cos(this.yaw),
      this.pos.y + this.eyeHeight + bobY,
      this.pos.z - bobX * Math.sin(this.yaw)
    );

    // the limp also tilts the head
    this.tiltTarget = limp * Math.max(0, Math.sin(this.bob)) * 0.026 * this.inputMag * amt;
    this.tilt += (this.tiltTarget - this.tilt) * Math.min(1, dt * 8);

    this.camera.rotation.set(0, 0, 0);
    this.camera.rotateY(this.yaw);
    this.camera.rotateX(this.pitch);
    this.camera.rotateZ(this.tilt);

    if (Math.abs(this.camera.fov - this.fovTarget) > 0.01) {
      this.camera.fov += (this.fovTarget - this.camera.fov) * Math.min(1, dt * 4);
      this.camera.updateProjectionMatrix();
    }

    if (this.onMove && this.moving) this.onMove(this.pos);
  }
}
