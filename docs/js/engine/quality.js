// Quality tiers, read by the engine helpers so chapters need no changes.
//
// A phone is doing the same procedural work as a desktop — the terrain is
// generated per vertex, the rain is thousands of instances, the riso stack is
// a full-screen shader over a bloom pass. The tier scales all of that from one
// place.

export const Q = {
  tier: 'high',
  dpr: 1.75,          // pixel-ratio cap
  particles: 1.0,     // rain instance count
  segments: 1.0,      // terrain resolution
  shadowMap: 2048,
  shadows: true,
  bloom: true,
};

const TIERS = {
  low:    { dpr: 0.75, particles: 0.22, segments: 0.45, shadowMap: 512,  shadows: false, bloom: false },
  medium: { dpr: 1.1,  particles: 0.5,  segments: 0.7,  shadowMap: 1024, shadows: true,  bloom: true },
  high:   { dpr: 1.75, particles: 1.0,  segments: 1.0,  shadowMap: 2048, shadows: true,  bloom: true },
};

/**
 * Pick a tier when the player has left it on "auto".
 *
 * Deliberately conservative: a phone that can handle "high" loses very little
 * at "medium", but a phone that cannot handle "high" is unplayable, and this
 * game asks the player to stand still in the dark for ninety seconds. A
 * stuttering frame rate destroys that more thoroughly than a soft image does.
 */
export function detectTier() {
  const touch = matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const small = Math.min(innerWidth, innerHeight) < 500;

  if (touch && (cores <= 4 || mem <= 3 || small)) return 'low';
  if (touch) return 'medium';
  if (cores <= 4 || mem <= 4) return 'medium';
  return 'high';
}

export function applyTier(tier) {
  const name = tier === 'auto' ? detectTier() : tier;
  const t = TIERS[name] || TIERS.high;
  Q.tier = name;
  Object.assign(Q, t);
  // never exceed what the display actually has
  Q.dpr = Math.min(Q.dpr, window.devicePixelRatio || 1);
  return name;
}
