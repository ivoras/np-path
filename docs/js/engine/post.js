// The riso stack. Everything in 00_design_bible.md §3 lives here.
//
//  1. palette-limited render, luminance posterised
//  2. channel misregistration (the signature effect — narratively driven)
//  3. screen-locked paper tooth
//  4. ash-olive printed vignette
//  5. ink-bleed bloom (UnrealBloomPass, applied before this)
//  6. the lens smear, acquired in ch01 and lost in ch04
//
// Explicitly absent: chromatic aberration, lens flare, film scratches, DoF.

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Q } from './quality.js';

const HEX = {
  moor:   '#0B1614',
  petrol: '#16332F',
  cyan:   '#3E6E70',
  bone:   '#EDE2C2',
  ember:  '#E0762A',
  ash:    '#2A2A22',
};

// For materials — three converts these from sRGB into the linear working space.
export const PALETTE = Object.fromEntries(
  Object.entries(HEX).map(([k, v]) => [k, new THREE.Color(v)])
);

// For the riso shader, which runs *after* OutputPass and therefore operates on
// display-referred sRGB. These must be the raw hex components, not the
// colour-managed linear ones, or the whole palette shifts.
const raw = (hex) => new THREE.Vector3(
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255
);
const RAW = Object.fromEntries(Object.entries(HEX).map(([k, v]) => [k, raw(v)]));

const RisoShader = {
  uniforms: {
    tDiffuse:     { value: null },
    uTime:        { value: 0 },
    uResolution:  { value: new THREE.Vector2(1, 1) },

    uMisreg:      { value: 2.0 },   // px — see the ledger in the bible
    uMisregDir:   { value: new THREE.Vector2(1.0, 0.35) },
    uPosterize:   { value: 24.0 },  // luminance steps (ch06 drops this to 2)
    uPaletteMix:  { value: 0.85 },
    uGrain:       { value: 0.062 },
    uGrainScale:  { value: 1.0 },   // coarsens with altitude in ch02
    uVignette:    { value: 0.55 },
    uSmear:       { value: 0.0 },   // the lens smear, 0 until ch01's puzzle
    uFade:        { value: 0.0 },   // to black
    uWhiteFade:   { value: 0.0 },   // to bone — ch06 ends on this
    uDesat:       { value: 0.0 },
    uSqueeze:     { value: 0.0 },   // ch05 "Flattened. / Expanded."
    uBitonal:     { value: 0.0 },   // ch06 — two values, nothing between
    uPrint:       { value: 1.0 },   // player setting: scales grain + misregistration
    uEyepiece:    { value: 0.0 },   // ch01: you are looking THROUGH the lens

    cMoor:   { value: RAW.moor },
    cPetrol: { value: RAW.petrol },
    cCyan:   { value: RAW.cyan },
    cBone:   { value: RAW.bone },
    cEmber:  { value: RAW.ember },
    cAsh:    { value: RAW.ash },
  },

  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,

  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform float uMisreg;
    uniform vec2  uMisregDir;
    uniform float uPosterize;
    uniform float uPaletteMix;
    uniform float uGrain;
    uniform float uGrainScale;
    uniform float uVignette;
    uniform float uSmear;
    uniform float uFade;
    uniform float uWhiteFade;
    uniform float uDesat;
    uniform float uSqueeze;
    uniform float uBitonal;
    uniform float uPrint;
    uniform float uEyepiece;
    uniform vec3  cMoor, cPetrol, cCyan, cBone, cEmber, cAsh;
    varying vec2 vUv;

    float hash(vec2 p){
      p = fract(p * vec2(443.8975, 397.2973));
      p += dot(p, p + 19.19);
      return fract(p.x * p.y);
    }

    float lum(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

    // Map a luminance to the palette ramp: moor -> petrol -> cyan -> bone.
    // The bands are deliberately uneven: the darks get a narrow band so the
    // moor does not swallow the frame, and the bone end gets a wide one so the
    // path stays the brightest object in the world.
    vec3 ramp(float l){
      if (l < 0.16) return mix(cMoor,   cPetrol, l / 0.16);
      if (l < 0.46) return mix(cPetrol, cCyan,   (l - 0.16) / 0.30);
      return               mix(cCyan,   cBone,   clamp((l - 0.46) / 0.44, 0.0, 1.0));
    }

    void main(){
      vec2 uv = vUv;

      // ── ch05: the passage compresses, then expands ────────────
      if (abs(uSqueeze) > 0.0001){
        uv = (uv - 0.5) * vec2(1.0 - uSqueeze, 1.0 + uSqueeze * 0.55) + 0.5;
      }

      // ── channel misregistration ───────────────────────────────
      // Two ink plates drift against each other. A slow 0.2 Hz wander
      // keeps it breathing; perfect registration always means something
      // has stopped.
      vec2 px = 1.0 / uResolution;
      float wander = sin(uTime * 1.2566) * 0.35 + 1.0;      // 0.2 Hz
      vec2 off = normalize(uMisregDir + 1e-6) * uMisreg * uPrint * wander * px;

      float emberPlate = texture2D(tDiffuse, uv + off).r;    // warm plate
      vec2  coldPlate  = texture2D(tDiffuse, uv - off).gb;   // cold plate
      vec3 col = vec3(emberPlate, coldPlate);

      // ── the lens smear ────────────────────────────────────────
      // A greasy diagonal in one corner, acquired by polishing the glass
      // with a dirty sleeve. Present on every camera until it shatters.
      if (uSmear > 0.001){
        vec2 s = uv - vec2(0.80, 0.78);
        float d = abs(s.x * 0.75 + s.y * 0.66);
        float band = exp(-d * d * 260.0) * smoothstep(0.55, 0.0, length(s));
        vec3 blur = vec3(0.0);
        blur += texture2D(tDiffuse, uv + vec2( 3.0, 1.5) * px).rgb;
        blur += texture2D(tDiffuse, uv + vec2(-3.0,-1.5) * px).rgb;
        blur += texture2D(tDiffuse, uv + vec2( 1.5,-3.0) * px).rgb;
        blur += texture2D(tDiffuse, uv + vec2(-1.5, 3.0) * px).rgb;
        col = mix(col, blur * 0.25 + 0.035, band * uSmear);
      }

      // ── desaturate (ch02 drains colour with altitude) ─────────
      col = mix(col, vec3(lum(col)), uDesat);

      // ── posterise + palette map ───────────────────────────────
      float l = lum(col);
      float steps = max(uPosterize, 2.0);
      float lq = floor(l * steps + 0.5) / steps;

      vec3 inked = ramp(lq);

      // Ember survives the ink: warm, bright pixels push toward the one
      // warm colour in the palette. This is the emotional thermometer,
      // and it is rationed per chapter by the material side, not here.
      float warmth = clamp((col.r - max(col.g, col.b)) * 3.2, 0.0, 1.0);
      inked = mix(inked, cEmber, warmth * clamp(lq * 1.5, 0.0, 1.0));

      col = mix(col, inked, uPaletteMix);

      // ── ch06: a 1-bit print ───────────────────────────────────
      // A 2-step posterise still lands midtones on the ramp's cyan band,
      // which is not the same thing as two values. This is.
      if (uBitonal > 0.001){
        vec3 bit = mix(cMoor, cBone, step(0.42, l));
        col = mix(col, bit, uBitonal);
      }

      // ── paper tooth ───────────────────────────────────────────
      // Screen-locked, not world-locked: it sits on the glass in front of
      // the world. (ch06 world-locks it to the floor — done in that scene,
      // not here.)
      //
      // It boils at 12 Hz rather than sitting still. A perfectly static
      // grain over a moving image reads as dirt on the screen, and worse,
      // it hands the eye a fixed reference frame that says nothing is
      // moving — which kills the sense of walking forward. 12 Hz is the
      // rate hand-printed and photochemical grain moves at; fast enough to
      // stop being a smudge, slow enough to stay print rather than TV snow.
      vec2 gcoord = gl_FragCoord.xy / max(uGrainScale, 0.001);
      float boil = floor(uTime * 12.0);
      vec2 jitter = vec2(fract(boil * 0.618) , fract(boil * 0.371)) * 71.3;
      float g  = hash(floor(gcoord) + jitter);
      float g2 = hash(floor(gcoord * 0.37) + jitter.yx + 31.7);
      float tooth = (g * 0.72 + g2 * 0.28 - 0.5);
      float grain = uGrain * uPrint;
      col *= 1.0 + tooth * grain * 2.0;
      col += tooth * grain * 0.22;

      // ── the eyepiece ──────────────────────────────────────────
      // When the player is at the great lens the frame becomes a view down a
      // tube. Without this there is nothing to say the telescope is a thing
      // you look through rather than a prop standing in the room.
      if (uEyepiece > 0.001){
        vec2 e = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
        float r = length(e);
        float bore = smoothstep(0.30, 0.42, r);                 // the tube wall
        float ring = exp(-pow((r - 0.30) * 26.0, 2.0)) * 0.5;   // brass at the rim
        col = mix(col, cMoor * 0.25, bore * uEyepiece);
        col += cEmber * ring * uEyepiece * 0.5;
      }

      // ── printed border ────────────────────────────────────────
      vec2 v = vUv - 0.5;
      float vig = smoothstep(0.78, 0.30, length(v * vec2(1.06, 1.0)));
      col = mix(cAsh * 0.5, col, mix(1.0, vig, uVignette));

      // ── fades ─────────────────────────────────────────────────
      col = mix(col, vec3(0.0), uFade);
      col = mix(col, cBone,     uWhiteFade);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class Post {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    const size = renderer.getSize(new THREE.Vector2());

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    // ink-bleed bloom — from bone and ember only, never from petrol.
    // The high threshold is what enforces that.
    this.bloom = new UnrealBloomPass(size, 0.62, 0.75, 0.72);
    this.composer.addPass(this.bloom);

    // Tone map and convert linear -> sRGB *before* the riso pass, so the
    // palette map operates on display-referred colour. Without this the whole
    // frame renders as near-black.
    this.composer.addPass(new OutputPass());

    this.riso = new ShaderPass(RisoShader);
    this.riso.renderToScreen = true;
    this.composer.addPass(this.riso);

    this.u = this.riso.uniforms;
    this.resize();
  }

  setCamera(camera) { this.composer.passes[0].camera = camera; }
  setScene(scene)   { this.composer.passes[0].scene = scene; }

  /** Ease a uniform toward a target. Most of the ledger is driven this way. */
  ease(name, target, dt, rate = 1.6) {
    const u = this.u[name];
    if (!u) return;
    u.value += (target - u.value) * Math.min(1, dt * rate);
  }

  set(name, value) { if (this.u[name]) this.u[name].value = value; }
  get(name) { return this.u[name] ? this.u[name].value : undefined; }

  /** 0 = normal view, 1 = looking down the lens. */
  setEyepiece(v) { this.u.uEyepiece.value = v; }

  /** Ink-bleed bloom strength. ch06 turns it off — nothing there glows. */
  setBloom(strength) { this.bloom.strength = Q.bloom ? strength : 0; }

  /**
   * Player setting: scale grain and plate misregistration together.
   * At 0 the image is clean — heavy static grain is a real problem for some
   * people, and this game runs for two and a half hours.
   */
  setPrintScale(v) { this.u.uPrint.value = v; }

  update(dt, elapsed) {
    this.u.uTime.value = elapsed;
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, Q.dpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(w, h);
    this.bloom.setSize(w * dpr, h * dpr);
    this.u.uResolution.value.set(w * dpr, h * dpr);
  }

  render() { this.composer.render(); }
}
