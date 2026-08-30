// Gold pulsing aura on anything the player can act on.
//
// This overrides the original doctrine ("no glow, no outline, no marker, no
// prompt"), which was a defensible art position implemented as no affordance
// at all: playtesting found the chapter 1 lens unreadable as an object you
// could touch. A game you cannot work out how to play is not austere, it is
// broken. The aura is rationed — only live interactables carry it, and it goes
// out the moment a thing is spent.

import * as THREE from 'three';
import { PALETTE } from './post.js';

const GOLD = PALETTE.ember;

export class Highlight {
  constructor(scene) {
    this.scene = scene;
    this.items = [];
    this.t = 0;
  }

  setScene(scene) { this.scene = scene; this.items = []; }

  /**
   * @param {THREE.Object3D} obj   the thing itself
   * @param {object} opts
   *   scale  aura size relative to the object (default 1.35)
   *   rate   throb speed in Hz (default 0.55)
   *   power  0–1 overall strength
   */
  add(obj, { scale = 1.35, rate = 0.55, power = 1 } = {}) {
    if (!obj || obj.userData._hl) return obj;

    // an additive shell, slightly larger than the object — this is the aura
    let aura = null;
    if (obj.geometry) {
      aura = new THREE.Mesh(
        obj.geometry,
        new THREE.MeshBasicMaterial({
          color: GOLD,
          transparent: true,
          opacity: 0.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.BackSide,
          fog: false,
        })
      );
      aura.scale.setScalar(scale);
      aura.renderOrder = 2;
      obj.add(aura);
    }

    // and a lift on the object's own surface, so it reads as lit rather than
    // merely wrapped in a halo
    const mats = obj.material
      ? (Array.isArray(obj.material) ? obj.material : [obj.material])
      : [];
    const baseEmissive = mats.map(m => (m.emissive ? m.emissive.clone() : null));
    const baseColor = mats.map(m => m.color?.clone() ?? null);

    obj.userData._hl = { aura, mats, baseEmissive, baseColor, rate, power, phase: Math.random() * 6.28 };
    this.items.push(obj);
    return obj;
  }

  /** Put a thing out — it has been used, or the puzzle moved on. */
  remove(obj) {
    const h = obj?.userData?._hl;
    if (!h) return;
    h.aura?.removeFromParent();
    h.aura?.material.dispose();
    h.mats.forEach((m, i) => {
      if (h.baseEmissive[i] && m.emissive) m.emissive.copy(h.baseEmissive[i]);
      if (h.baseColor[i] && m.color) m.color.copy(h.baseColor[i]);
    });
    delete obj.userData._hl;
    const i = this.items.indexOf(obj);
    if (i >= 0) this.items.splice(i, 1);
  }

  clear() { [...this.items].forEach(o => this.remove(o)); }

  update(dt) {
    this.t += dt;
    for (const obj of this.items) {
      const h = obj.userData._hl;
      if (!h) continue;
      const visible = obj.visible;
      // a slow throb, not a blink — this sits in a two-and-a-half-hour game
      const k = (Math.sin(this.t * h.rate * Math.PI * 2 + h.phase) * 0.5 + 0.5);
      const amt = (0.30 + k * 0.70) * h.power * (visible ? 1 : 0);

      // strong enough to survive the palette map in a near-black scene —
      // a subtle lift just becomes another midtone and reads as nothing
      if (h.aura) h.aura.material.opacity = 0.22 + amt * 0.55;

      h.mats.forEach((m, i) => {
        if (m.emissive) {
          m.emissive.copy(GOLD).multiplyScalar(amt * 1.25);
          if (h.baseEmissive[i]) m.emissive.add(h.baseEmissive[i]);
        } else if (m.color && h.baseColor[i]) {
          // unlit materials have no emissive; lift the colour instead
          m.color.copy(h.baseColor[i]).lerp(GOLD, amt * 0.75);
        }
      });
    }
  }
}
