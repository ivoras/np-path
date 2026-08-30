// Procedural world construction. There are no art assets — every mesh in the
// game is generated at runtime.
//
// The lighting follows the reference rig (00_design_bible.md §1.3): three
// static lights, a vertically graded sky doing the ambient work, and fog doing
// all depth separation. "The key is in the colors."

import * as THREE from 'three';
import { noise, Noise } from '../lib/noise.js';
import { PALETTE } from './post.js';
import { Q } from './quality.js';

export const C = PALETTE;

// ── materials ───────────────────────────────────────────────────
// Beksiński painted on hardboard he prepared himself: no weave, no tooth.
// World materials stay airless and low-variance; the grain lives on the glass.
export function matte(color, opts = {}) {
  return new THREE.MeshLambertMaterial({
    color,
    flatShading: opts.flat !== false,
    side: opts.side || THREE.FrontSide,
    transparent: !!opts.transparent,
    opacity: opts.opacity ?? 1,
    depthWrite: opts.depthWrite !== false,
  });
}

export function unlit(color, opts = {}) {
  return new THREE.MeshBasicMaterial({
    color,
    side: opts.side || THREE.FrontSide,
    transparent: !!opts.transparent,
    opacity: opts.opacity ?? 1,
    fog: opts.fog !== false,
    depthWrite: opts.depthWrite !== false,
  });
}

// ── sky ─────────────────────────────────────────────────────────
/**
 * The vertical grade, per the reference recipe — darkest low, most chroma in
 * the middle band, palest at the top. Ours runs moor -> petrol -> near-bone so
 * the sky looks drained upward rather than lit from above.
 */
export function makeSky(scene, { low = C.moor, mid = C.petrol, high = C.cyan, power = 1.0 } = {}) {
  const geo = new THREE.SphereGeometry(900, 32, 20);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      cLow:  { value: new THREE.Color(low) },
      cMid:  { value: new THREE.Color(mid) },
      cHigh: { value: new THREE.Color(high) },
      uPow:  { value: power },
      uBand: { value: 0.42 },
    },
    vertexShader: `
      varying vec3 vP;
      void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
    `,
    fragmentShader: `
      uniform vec3 cLow, cMid, cHigh;
      uniform float uPow, uBand;
      varying vec3 vP;
      void main(){
        float h = clamp(normalize(vP).y * 0.5 + 0.5, 0.0, 1.0);
        h = pow(h, uPow);
        vec3 c = h < uBand
          ? mix(cLow, cMid, h / uBand)
          : mix(cMid, cHigh, (h - uBand) / (1.0 - uBand));
        gl_FragColor = vec4(c, 1.0);
      }
    `,
  });
  const sky = new THREE.Mesh(geo, mat);
  sky.frustumCulled = false;
  scene.add(sky);
  return sky;
}

// ── the three-light rig ─────────────────────────────────────────
export function makeLights(scene, {
  keyColor = C.ember, keyIntensity = 1.5,
  keyDir = new THREE.Vector3(0, 0.12, -1),
  skyColor = C.cyan, groundColor = C.moor, ambient = 0.55,
  fillColor = C.petrol, fillIntensity = 0.35,
  shadows = false,
} = {}) {
  // 1 — the key: twilight, on the path's vanishing point, always ahead
  const key = new THREE.DirectionalLight(keyColor, keyIntensity);
  key.position.copy(keyDir).normalize().multiplyScalar(-160);
  if (shadows && Q.shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(Q.shadowMap, Q.shadowMap);
    const d = 60;
    key.shadow.camera.left = -d; key.shadow.camera.right = d;
    key.shadow.camera.top = d;   key.shadow.camera.bottom = -d;
    key.shadow.camera.near = 1;  key.shadow.camera.far = 420;
    key.shadow.bias = -0.0012;
  }
  scene.add(key);
  scene.add(key.target);

  // 2 — the skylight, carrying the palette
  const hemi = new THREE.HemisphereLight(skyColor, groundColor, ambient);
  scene.add(hemi);

  // 3 — fill, bounce off the ground
  const fill = new THREE.DirectionalLight(fillColor, fillIntensity);
  fill.position.set(40, -18, 60);
  scene.add(fill);

  return { key, hemi, fill };
}

// ── terrain ─────────────────────────────────────────────────────
/**
 * A heightfield. `fn(x,z) -> y` is authored per chapter; the mesh and the
 * player's ground query come from the same function, so they never disagree.
 */
export function makeTerrain(fn, {
  size = 400, segments = 190, material = null, receiveShadow = false,
  centerX = 0, centerZ = 0,
} = {}) {
  // resolution scales with the quality tier — a phone cannot chew through
  // 58k vertices of per-vertex noise every time a chapter loads
  const segs = Math.max(24, Math.round(segments * Q.segments));
  const geo = new THREE.PlaneGeometry(size, size, segs, segs);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  // Sample in WORLD space and carry the same offset on the mesh, so the
  // visible ground and the player's ground query can never disagree. Moving
  // the mesh without shifting the sample slides the terrain out from under
  // the collision heightfield.
  for (let i = 0; i < p.count; i++) {
    p.setY(i, fn(p.getX(i) + centerX, p.getZ(i) + centerZ));
  }
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material || matte(C.moor));
  mesh.position.set(centerX, 0, centerZ);
  mesh.receiveShadow = receiveShadow;
  return mesh;
}

// ── the path ────────────────────────────────────────────────────
/**
 * A bone ribbon with ember verges. The rim-light on the verges is what makes
 * the cover image read, and it is the game's signature composition.
 */
export function makePath(groundFn, {
  length = 400, width = 2.7, from = -200, curve = null, verge = true,
} = {}) {
  const group = new THREE.Group();
  const steps = 260;
  const centre = (t) => (curve ? curve(t) : 0);

  const build = (w, y, mat) => {
    const geo = new THREE.BufferGeometry();
    const verts = [], idx = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const z = from + t * length;
      const cx = centre(z);
      // A flat cross-section, sitting on the highest ground under its own
      // width. Sampling each edge independently lets a crowned surface poke
      // up through the middle of the ribbon.
      const yTop = Math.max(
        groundFn(cx - w * 0.5, z), groundFn(cx, z), groundFn(cx + w * 0.5, z)
      ) + y;
      for (const s of [-1, 1]) {
        verts.push(cx + s * w * 0.5, yTop, z);
      }
      if (i < steps) {
        // wound so the ribbon faces +Y — the obvious order faces it at the
        // ground, which makes the path invisible from on top of it
        const a = i * 2;
        idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    m.receiveShadow = true;
    return m;
  };

  if (verge) group.add(build(width * 1.5, 0.05, unlit(C.ember)));
  // The path is the brightest object in the world at all times — it is the
  // one thing the player must never lose. Emissive lift rather than an unlit
  // material, so it still receives shadow in ch07.
  const boneMat = new THREE.MeshLambertMaterial({
    color: C.bone,
    emissive: new THREE.Color(C.bone).multiplyScalar(0.55),
    flatShading: false,
  });
  group.add(build(width, 0.09, boneMat));
  group.userData.centre = centre;
  group.userData.width = width;
  return group;
}

// ── dead orchard trees ──────────────────────────────────────────
/** Recursive branching, merged into one geometry. Black verticals, no leaves. */
export function makeDeadTree(seed = 1, { height = 5.2, gnarl = 1 } = {}) {
  const rng = mulberry(seed);
  const parts = [];

  const branch = (x, y, z, dx, dy, dz, len, rad, depth) => {
    const geo = new THREE.CylinderGeometry(rad * 0.62, rad, len, 5, 1);
    const m = new THREE.Object3D();
    const dir = new THREE.Vector3(dx, dy, dz).normalize();
    const mid = new THREE.Vector3(x, y, z).addScaledVector(dir, len / 2);
    m.position.copy(mid);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    m.updateMatrix();
    geo.applyMatrix4(m.matrix);
    parts.push(geo);

    if (depth <= 0 || rad < 0.028) return;
    const end = new THREE.Vector3(x, y, z).addScaledVector(dir, len);
    const n = 2 + (rng() > 0.62 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const spread = (0.5 + rng() * 0.75) * gnarl;
      const a = rng() * Math.PI * 2;
      const nd = dir.clone()
        .add(new THREE.Vector3(Math.cos(a) * spread, rng() * 0.28 - 0.02, Math.sin(a) * spread))
        .normalize();
      branch(end.x, end.y, end.z, nd.x, nd.y, nd.z,
        len * (0.6 + rng() * 0.2), rad * (0.6 + rng() * 0.14), depth - 1);
    }
  };

  branch(0, 0, 0, (rng() - 0.5) * 0.1, 1, (rng() - 0.5) * 0.1,
    height * 0.42, 0.20 + rng() * 0.07, 4);

  const merged = mergeGeometries(parts);
  return new THREE.Mesh(merged, matte(C.moor));
}

// ── the Ones That Lost ──────────────────────────────────────────
/**
 * Standing, facing the path, never moving. Decay is a skin over intact
 * structure, never rubble — cloth calcifies into shell, shell frays into
 * cloth, and there is no material boundary anywhere on them.
 *
 * Every one is generated from its own seed. No instancing at close range:
 * a player who spots a duplicate loses the chapter.
 */
export function makeFigure(seed = 1, { height = 1.82, bone = false } = {}) {
  const rng = mulberry(seed);
  const h = height * (0.93 + rng() * 0.16);

  // a draped profile, revolved — cheap, and reads as a silhouette in fog
  const pts = [];
  const N = 22;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const y = t * h;
    let r;
    if (t < 0.06)      r = 0.30 + t * 1.2;                          // hem, pooled
    else if (t < 0.55) r = 0.36 - t * 0.10 + Math.sin(t * 9 + seed) * 0.028;
    else if (t < 0.74) r = 0.30 - (t - 0.55) * 0.55;                // shoulders
    else if (t < 0.86) r = 0.115 + Math.sin((t - 0.74) * 12) * 0.012; // neck
    else               r = 0.135 * Math.sin((1 - t) * 7.4 + 0.4);   // head
    pts.push(new THREE.Vector2(Math.max(0.012, r * (0.94 + rng() * 0.13)), y));
  }
  const geo = new THREE.LatheGeometry(pts, 13);

  // asymmetry: nobody stands straight, and nobody is posed identically
  const pos = geo.attributes.position;
  const n2 = new Noise(seed * 7919 + 13);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const d = n2.noise3(x * 2.2, y * 1.4, z * 2.2) * 0.045;
    const lean = Math.pow(y / h, 2) * (rng() - 0.5) * 0.001;
    pos.setXYZ(i, x + d + lean * 40, y, z + d * 0.7);
  }
  geo.computeVertexNormals();

  const mesh = new THREE.Mesh(geo, bone ? matte(C.bone) : matte(C.moor));
  mesh.castShadow = true;
  mesh.rotation.y = rng() * Math.PI * 2;
  return mesh;
}

// ── rain ────────────────────────────────────────────────────────
/** Instanced streaks, recycled around the player. Rain is the bed. */
export class Rain {
  constructor(scene, count = 2600, { radius = 26, height = 16, speed = 22 } = {}) {
    count = Math.max(200, Math.round(count * Q.particles));
    const geo = new THREE.PlaneGeometry(0.012, 0.62);
    const mat = new THREE.MeshBasicMaterial({
      color: C.cyan, transparent: true, opacity: 0.42,
      side: THREE.DoubleSide, depthWrite: false, fog: true,
    });
    this.mesh = new THREE.InstancedMesh(geo, mat, count);
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.count = count; this.radius = radius; this.height = height; this.speed = speed;
    this.p = new Float32Array(count * 3);
    this.v = new Float32Array(count);
    for (let i = 0; i < count; i++) this._respawn(i, true);
    this.dummy = new THREE.Object3D();
    this.intensity = 1;
    scene.add(this.mesh);
  }
  _respawn(i, init = false) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * this.radius;
    this.p[i * 3]     = Math.cos(a) * r;
    this.p[i * 3 + 1] = init ? Math.random() * this.height : this.height;
    this.p[i * 3 + 2] = Math.sin(a) * r;
    this.v[i] = this.speed * (0.75 + Math.random() * 0.5);
  }
  update(dt, camPos) {
    const d = this.dummy;
    const n = Math.floor(this.count * this.intensity);
    for (let i = 0; i < this.count; i++) {
      if (i >= n) { d.position.set(0, -9999, 0); d.scale.setScalar(0.001); d.updateMatrix();
        this.mesh.setMatrixAt(i, d.matrix); continue; }
      this.p[i * 3 + 1] -= this.v[i] * dt;
      if (this.p[i * 3 + 1] < -1.5) this._respawn(i);
      d.position.set(
        camPos.x + this.p[i * 3],
        camPos.y + this.p[i * 3 + 1] - this.height * 0.42,
        camPos.z + this.p[i * 3 + 2]
      );
      d.scale.set(1, 1 + this.v[i] * 0.02, 1);
      d.rotation.set(0, 0, 0.06);
      d.updateMatrix();
      this.mesh.setMatrixAt(i, d.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
  set(intensity) { this.intensity = Math.max(0, Math.min(1, intensity)); }
  dispose() { this.mesh.geometry.dispose(); this.mesh.material.dispose(); this.mesh.removeFromParent(); }
}

// ── scatter ─────────────────────────────────────────────────────
/** Instanced ground cover — heather, scrub, bone chips. */
export function scatter(geo, mat, count, place) {
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const d = new THREE.Object3D();
  let n = 0;
  for (let i = 0; i < count; i++) {
    const r = place(i);
    if (!r) continue;
    d.position.set(r.x, r.y, r.z);
    d.rotation.set(r.rx || 0, r.ry ?? Math.random() * Math.PI * 2, r.rz || 0);
    d.scale.setScalar(r.s ?? 1);
    d.updateMatrix();
    mesh.setMatrixAt(n++, d.matrix);
  }
  mesh.count = n;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}

// ── props ───────────────────────────────────────────────────────
export function makePebble(seed = 1, r = 0.075) {
  const geo = new THREE.IcosahedronGeometry(r, 1);
  const rng = mulberry(seed);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const s = 0.78 + rng() * 0.42;
    p.setXYZ(i, p.getX(i) * s, p.getY(i) * s * 0.8, p.getZ(i) * s);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, matte(C.bone));
  m.castShadow = true;
  return m;
}

/**
 * The egg. Same shader family as the pebbles and the path, at 400x scale —
 * the player has been shown this substance for two hours already. Chalky, not
 * eggshell: stone that is trying to be an egg. Two plates with a seam that is
 * already, faintly, a fracture.
 */
export function makeEgg(radius = 2.0) {
  const group = new THREE.Group();
  const geo = new THREE.SphereGeometry(radius, 48, 40);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const t = (y / radius + 1) * 0.5;
    const taper = 0.80 + 0.34 * Math.sin(t * Math.PI) - (t > 0.5 ? (t - 0.5) * 0.34 : 0);
    const n = noise.noise3(p.getX(i) * 1.6, y * 1.6, p.getZ(i) * 1.6) * 0.028;
    p.setXYZ(i, p.getX(i) * taper + n, y * 1.42, p.getZ(i) * taper + n);
  }
  geo.computeVertexNormals();
  const shell = new THREE.Mesh(geo, matte(C.bone, { flat: false }));
  shell.castShadow = true;
  group.add(shell);

  // the seam, faint from the first frame
  const seam = new THREE.Mesh(
    new THREE.PlaneGeometry(0.035, radius * 2.7),
    unlit(C.moor, { transparent: true, opacity: 0.5 })
  );
  seam.position.z = radius * 0.99;
  group.add(seam);

  group.userData.shell = shell;
  group.userData.seam = seam;
  return group;
}

/** The ruin: roof gone, one wall collapsed, ivy claiming what was left. */
export function makeRuin(seed = 3) {
  const rng = mulberry(seed);
  const g = new THREE.Group();
  const stone = matte(C.moor);
  const W = 9, D = 7, H = 4.4;

  const wall = (w, h, x, z, ry, broken = 0) => {
    const cols = Math.max(3, Math.round(w / 0.7));
    for (let i = 0; i < cols; i++) {
      const t = i / (cols - 1);
      // decay as a skin over intact structure: the wall's grammar survives
      const hh = h * (1 - broken * Math.pow(t, 1.6)) * (0.86 + rng() * 0.2);
      if (hh < 0.25) continue;
      const bw = w / cols * 1.04;
      const m = new THREE.Mesh(new THREE.BoxGeometry(bw, hh, 0.5), stone);
      m.position.set((t - 0.5) * w, hh / 2, 0);
      m.castShadow = true; m.receiveShadow = true;
      const holder = new THREE.Group();
      holder.add(m);
      holder.position.set(x, 0, z);
      holder.rotation.y = ry;
      g.add(holder);
    }
  };

  wall(W, H, 0, -D / 2, 0, 0.15);
  wall(W, H, 0,  D / 2, 0, 0.92);          // the collapsed one
  wall(D, H, -W / 2, 0, Math.PI / 2, 0.3);
  wall(D, H,  W / 2, 0, Math.PI / 2, 0.1);

  // ivy: thin verticals climbing what's left
  for (let i = 0; i < 46; i++) {
    const hh = 0.7 + rng() * 2.6;
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.045, hh, 0.045), matte(C.petrol));
    const side = Math.floor(rng() * 4);
    const a = side * Math.PI / 2;
    const off = (rng() - 0.5) * (side % 2 ? D : W);
    v.position.set(
      Math.cos(a) * (side % 2 ? W / 2 : off) + (side % 2 ? 0 : off) * 0,
      hh / 2,
      Math.sin(a) * (side % 2 ? 0 : D / 2) + (side % 2 ? off : 0)
    );
    if (side === 0) v.position.set(off, hh / 2, -D / 2);
    if (side === 2) v.position.set(off, hh / 2,  D / 2);
    if (side === 1) v.position.set(-W / 2, hh / 2, off);
    if (side === 3) v.position.set( W / 2, hh / 2, off);
    g.add(v);
  }
  return g;
}

// ── utilities ───────────────────────────────────────────────────
export function mulberry(seed) {
  let a = (seed * 1831565813) >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Minimal BufferGeometry merge — avoids pulling in the addon. */
export function mergeGeometries(geos) {
  let vCount = 0, iCount = 0;
  for (const g of geos) {
    vCount += g.attributes.position.count;
    iCount += g.index ? g.index.count : g.attributes.position.count;
  }
  const pos = new Float32Array(vCount * 3);
  const nor = new Float32Array(vCount * 3);
  const idx = new Uint32Array(iCount);
  let vo = 0, io = 0;
  for (const g of geos) {
    if (!g.attributes.normal) g.computeVertexNormals();
    const p = g.attributes.position, n = g.attributes.normal;
    pos.set(p.array, vo * 3);
    nor.set(n.array, vo * 3);
    if (g.index) {
      const gi = g.index.array;
      for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
      io += gi.length;
    } else {
      for (let i = 0; i < p.count; i++) idx[io + i] = i + vo;
      io += p.count;
    }
    vo += p.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

/** Recursively free a subtree. Chapters are torn down between scenes. */
export function disposeTree(obj) {
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(m => { Object.values(m).forEach(v => v && v.isTexture && v.dispose()); m.dispose(); });
    }
  });
  obj.removeFromParent?.();
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const smooth = (t) => t * t * (3 - 2 * t);
