# Chapter 02 — ASCENT

> **Source:** PATH.pdf pp. 8–12
> **Runtime:** 20–25 min
> **Voices:** Traveler → Watcher → Watcher → Traveler → Traveler → Watcher
> **Cuts:** 5
> **Puzzle:** The Cairns (wayfinding in fog) — ends with the first **pebble transfer**
> **Coda:** *"The traveler strays. / The path remembers. / Movement."*

---

## 1. Thematic Function

Chapter 1 was about being unable to move. Chapter 2 is about **moving costing you pieces of
yourself**, and about the discovery that the two worlds are physically connected.

Three things must land:

1. **Effort is the content.** This chapter should be tiring. Not frustrating — tiring. The climb
   is long, the grade is steep, the character limps and the limp gets worse, and there is no
   summit reward. A player who says "that was a slog" has partly understood it; a player who says
   "I felt it in my legs" has fully understood it.
2. **The pebble is a wormhole.** The Traveler dislodges a white pebble at the top of the world; the
   Watcher finds it beside his teacup. This is the first hard proof the two are one system, and
   it is delivered without a word of explanation. It is the single most important reveal in the
   first half of the game.
3. **Straying is possible now.** *Then I left the path.* Chapter 1 physically forbade leaving the
   path. Chapter 2 permits it — once — and the game's title notices.

---

## 2. Spatial Flow

| # | Space | Verb | Duration |
|---|---|---|---|
| 1 | **The Black Shore** — black sand, black water, no horizon line between them | Stand up. Walk inland. | 4 min |
| 2 | **The Tideline** — the Traveler's own body-print in the sand, filling with water | Look back at it | 1 min |
| 3 | **The Hill** — sparse scrub, loose rock, gaining grade | Climb | 5 min |
| — | **CUT** | | |
| 4 | **The Lower Mansion, at night** — the knocking has been going for hours | Wander; find the second cup on its shelf | 3 min |
| 5 | **The Turret** — wind takes the cup off the parapet | Watch it go. You cannot catch it. | 2 min |
| — | **CUT** | | |
| 6 | **The Mountain** — the hill has become something else; the trees are gone; thinner air | Climb, limping | 6 min |
| 7 | **The Fog Shelf** — a plateau above where clouds should be, and aren't | **PUZZLE** | 8 min |
| 8 | **The Edge** — a decision | Leave the path | 2 min |
| — | **CUT** | | |
| 9 | **Outside the Mansion** — the Watcher, out of doors for the first time. Silence. No one there. | Return to the turret. Find the pebble. | 4 min |

### Level-design rules

- **The transition from hill to mountain must be unnoticeable.** No cut, no vista reveal. The
  player should look up at some point in beat 6 and realise the geology changed underneath them
  twenty minutes ago. Do this with progressive asset swaps keyed to altitude: scrub → lichen →
  bare rock → rock with no lichen at all; soil → scree → slab.
- **Trees vanish by subtraction across a reload-free boundary.** *"The trees that were not here
  anymore."* Where possible, place a tree in the player's peripheral vision and remove it when it
  is off-screen. Never let them see it go.
- **There should be no clouds, and the player should notice.** Climb above the altitude where a
  cloud layer visibly *ought* to be — show a cloud deck from below in beat 3, then be above the
  altitude of that deck in beat 7 with clear, empty, dead-flat grey above and below. Nothing there.
- **The blood trail.** From beat 6 the player leaves bone-white footprints that gradually take on
  **ember** at the heel. By beat 8 the trail behind the player is unmistakably a line of blood.
  Never mention it in VO. Let them turn around.
- **Beat 9 is the only exterior Watcher scene in the game.** Make it feel like a violation. The
  mansion from the outside is smaller than the interior implied.

---

## 3. THE PUZZLE — *The Cairns*

**Type:** wayfinding / environmental legibility, in near-zero visibility
**Location:** the Fog Shelf, beat 7
**Solve time:** 6–9 min

### Setup

The plateau is a featureless field of frost-shattered slab under a fog so dense the draw distance
is ~11 metres. There is no path. There is no up. The player can walk in any direction for as long
as they like and the plateau does not end — it is a **looping tile**, seamlessly wrapped, so
wandering never produces progress and never produces a wall. (The player must never discover the
wrap; keep the tile large, ~180 m, and rotate the fog's subtle directional gradient with the
player so no orientation cue leaks.)

Scattered on the plateau are **collapsed cairns** — heaps of flat stones that were once stacks.

### Mechanic

- Walk into fog until a shape resolves. Most are rocks. **Three are collapsed cairns.**
- Standing at a collapsed cairn, the player restacks it: a slow, held interaction, one stone at a
  time, five stones, each with weight and a grinding stone-on-stone sound. It takes about
  forty seconds and cannot be rushed. **Make the player's arms hurt.**
- When a cairn is complete, the fog **thins in exactly one direction** for about eight seconds —
  a corridor of visibility opening toward the next cairn — then closes.
- The player must move immediately, on memory of a bearing, with no compass and no marker. Miss
  the window and the cairn stays built; you simply have to walk back to it and wait. It re-opens
  the corridor after a 30 s cooldown. **There is no punishment except walking.**

### The turn — the third cairn

The third cairn is missing its **capstone**. There are no more flat stones anywhere on the
plateau; the player can and will search for one. There isn't one. This is the only moment in the
game that deliberately wastes the player's time, and it should waste three or four minutes of it.

The solution is on the player's own body. Since the tideline in beat 2, the Traveler has been
carrying **three white pebbles** — visible in the HUD-less way this game does inventory: when you
look down, your hand is closed around something, and if you hold the look, it opens.

Placing a white pebble as the capstone completes the third cairn. And then:

- The fog does not thin.
- The pebble sits wrong on the stack — too white, too small, insulting.
- It **rolls**. Loose underfoot, off the capstone, across the slab, toward the edge.
- The player can chase it. The player cannot catch it. It goes over.

### Solve → the transfer

Follow the pebble to the edge. Look over. Fog, then nothing, then — very briefly, no more than
three frames, and only if the player is actually looking down — **the turret, from above, tiny,
and a cup on its parapet.**

CUT.

Beat 9: the Watcher, outside, in silence. He goes in. He climbs the stairs. He reaches for the cup.
**Beside it lies a white pebble.** One more for the collection — and now the player can see there
are four on the parapet where Chapter 1 showed three.

### Why this puzzle

- It is made entirely of the two verbs the game actually has: **walking** and **looking**. No
  mechanism, no logic gate.
- The fog-corridor loop makes the player *earn a bearing*, which is exactly what the chapter is
  about: the path is one, its variations many, and you have to keep re-finding it.
- The capstone turn converts a resource the player didn't know was a resource into a **loss**, and
  the loss is the reveal. The player is never told the pebble crossed over. They are shown a
  count going from three to four.

### Assist

If the player has spent >4 min hunting for a capstone, the Traveler's hand opens involuntarily at
the bottom of the frame for one second, showing the pebbles. Once. Then never again.

---

## 4. Voice-Over Script

**Verbatim from PATH.pdf.** Same delivery rules as Ch. 01: dry, close, unperformed, always
**3–6 s late** on the image.

New for this chapter: **the Traveler's voice begins to run out of breath.** From beat 6 onward,
record every Traveler line after physical exertion — genuinely, make the actor climb stairs. By
beat 8 the lines should be nearly unusable, and use them anyway.

| # | Trigger | Line (verbatim) | Treatment |
|---|---|---|---|
| 2.1 | Black. Surf. Before image. | *"I woke to waves touching my feet. Water and sand, both black. It was hard to tell where tide ended and the shore began."* | Image fades up on the last four words, and is exactly as described — indistinguishable. |
| 2.2 | Player stands | *"Buried and aching, I tried to stand."* | Sand falls off the camera. |
| 2.3 | Player turns inland and sees the hill | *"The path is one. Its variations many."* | **Both voices, in unison, dead flat.** The only unison line before Ch. 06. Do not process it as a chorus — two dry mono takes, hard-panned, slightly out of sync. |
| 2.4 | First step onto the hill | *"Behind the beach lay a steep hill, strewn with sparse vegetation, climbing to meet the gray sky."* | |
| 2.5 | ~2 min into the climb | *"Barefoot, I climbed, every root and stone a small argument against it."* | Foley does the heavy lifting under this. |
| — | **CUT** | | |
| 2.6 | Mansion interior, night, knocking | *"There was a time without the sound of knocking."* | |
| 2.7 | Player finds the second cup on its shelf | *"The lower part of the mansion is never quiet these days. But these days are the only ones I have."* | |
| 2.8 | Player reaches the turret | *"Yesterday is also the day after tomorrow, which is today."* | **Process this one line as a tape loop** — record it once, then loop the phrase three times with each pass more degraded, the third barely intelligible, and duck it under the wind before it finishes. |
| 2.9 | Knocking spikes to its loudest yet | *"And today, the knocking is unbearable."* | |
| 2.10 | The cup goes over the parapet | *"The wind takes my tea cup off the turret wall."* | We hear it fall for far too long. It never lands. |
| 2.11 | Player descends toward the front door | *"I am forced to venture outside."* | |
| — | **CUT** | | |
| 2.12 | Mountain, beat 6 | *"The climb continued."* | |
| 2.13 | Movement speed drops ~15%, permanently | *"The limp got worse."* | Do not restore the speed for the rest of the game. |
| 2.14 | Player crosses onto bare slab | *"My feet dragged on, leaving pieces of myself on the stone."* | The ember in the footprints reaches full strength on this line. |
| 2.15 | | *"The hill was slowly turning into a mountain. I woke up with the taste of blood in my mouth."* | Note the tense slip — *I woke up* — mid-climb. Do not smooth it. Support it with a half-second of black on "woke". |
| 2.16 | | *"The stones. Pain."* | |
| 2.17 | Player passes the last place a tree was | *"The trees that were not here anymore."* | |
| 2.18 | Entering the fog shelf; audio thins to altitude | *"I had to climb. When I managed to stand, it was hard to breathe."* | Add breath to the mix here and never remove it. |
| 2.19 | Player first looks up on the shelf | *"There should have been clouds here. / There weren't."* | Four-second gap between the two sentences. |
| — | **PUZZLE** | | |
| 2.20 | Player places the pebble as capstone | *"A decision."* | |
| 2.21 | The pebble rolls | *"A pebble, loose underfoot, rolled toward the edge."* | Synced, for once — this is the one line in the game that lands *on* its image, because it is the hinge. |
| 2.22 | Player steps off the marked ground to follow it | *"Then I left the path."* | On this line, the **title card device fires**: bone type, bottom-left, one line — `The path remembers.` — for 1.2 s. First and only mid-chapter card. |
| — | **CUT** | | |
| 2.23 | Watcher, outside the mansion, wind only | *"There is no one outside. The knocking has stopped. The wind is relentless."* | |
| 2.24 | Player reaches the parapet | *"I reach for the tea cup. Beside it lies a white pebble. One more for the collection."* | **Say nothing else.** No music sting. Let the player do the counting. |
| 2.25 | Player turns to the stair | *"Time to climb the stairs again."* | |
| 2.26 | Last image: the lens, clean | *"The lens, still there, unbothered by birds and wind."* | |

### Coda card

```
The traveler strays.
The path remembers.
Movement.
```

Same treatment as Ch. 01 — but on **Movement**, hold the black an extra four seconds and put a
single distant footstep in it.

---

## 5. Visual Design

### Palette shift

Chapter 2 **desaturates toward monochrome as you climb.** Altitude drives the grade:

| Altitude | Grade |
|---|---|
| Shore (0 m) | **Full black-on-black.** Moor black `#0B1614` sand, petrol `#16332F` water. Ember appears *only* in the surf line. The most tonally compressed opening in the game — the player is looking at a near-black screen for two minutes and must be trusted to keep walking. |
| Hill (mid) | Petrol lifts; bruise cyan `#3E6E70` enters as haze; bone appears in exposed rock |
| Mountain (high) | Colour drains. By the fog shelf the frame is **90% bone and ash**, with the only saturated pixels being the ember blood in the player's footprints |
| Fog shelf | Near-white. A **white-out that is not a light source** — flat, shadowless, directionless |

This inversion — starting black, ending white — is the setup for Chapter 03, which will invert it
again. Track the polarity across the whole game (see 00_design_bible.md §"The White/Dark Ledger").

### Light

- **The shore has no key light.** Ambient only, from a sky that is one flat value. Nothing casts.
- **The mountain gains a low sun that is never visible** — hard raking light from the left,
  motivated by nothing on screen. Rim every rock. Long shadows that all point the same way and do
  not change as you climb for forty minutes.
- **The fog shelf has omnidirectional light and no shadows at all.** Kill the sun entirely.
  Shadowlessness is the whole visual argument of the puzzle: without shadow you cannot read form,
  and without form you cannot navigate, and so you need the cairns.

### The fog

Budget for this properly; it is the chapter's principal character.

- Volumetric, with **very low scattering anisotropy** so it does not glow toward a light — it must
  read as *substance*, not as atmosphere.
- Density noise animated at ~0.03 Hz — slow enough that the player perceives it as a still image
  that is somehow wrong.
- **The corridor-opening effect** during the puzzle is a density carve along a vector, eased in
  over 1.5 s and out over 6 s. Do not add a light shaft. Do not add particles. Just less fog.

### Texture & post

Same riso stack as Ch. 01, with two changes:

- **Misregistration increases with altitude.** By the fog shelf the cyan and ember plates are 4 px
  apart and visibly breathing. The world is coming out of alignment as the Traveler does.
- **The paper tooth gets coarser.** Swap the grain plate at the hill/mountain boundary for one
  with a heavier, more fibrous tooth. The image should feel like it is being printed on worse
  stock as the chapter goes on.

### Signature frames

- The black shore: a horizontal frame with **no horizon** — the player cannot tell up from down for
  the first fifteen seconds.
- The climb, seen from ahead and above: one figure, bone-white against black slab, with a thin
  ember line trailing behind.
- The cloud deck seen from *below* in beat 3 — then the same deck absent in beat 7. Frame them
  identically so the memory is available for comparison.
- The white pebble on the black capstone. Maximum contrast in a chapter that has almost none. It
  should hurt slightly to look at.
- Beat 9: the mansion exterior, in wind, from thirty metres. First and last time. Small.

---

## 6. Audio Design

### Score

Adds **prepared piano** to Ch. 01's bass and organ. The preparation is screws and felt — no
bright strikes. Single notes, very sparse, one every 15–40 s during the climb, always struck at
the moment the player's foot lands, so it reads as *coming from the climb itself*.

The organ drone from Ch. 01 is still there, still unresolved, now a whole step lower.

**On the fog shelf, remove all score.** Nothing but wind and breath for eight minutes. Bringing
the piano back on the pebble roll (one note, damped) will feel enormous.

### Ambient

- **Shore:** surf, but recorded far too close and low-passed — the sound of being *in* it, not
  beside it. No gulls. No wind. The stillness of the shore should be unsettling given the waves.
- **Hill:** wind enters and never leaves. Layer by exposure — wind through scrub, wind over rock,
  wind past the player's own ears. The ear-wind layer is what sells altitude.
- **Fog shelf:** wind becomes a *pressure*, not a sound — mostly sub-bass with the top rolled off
  at 2 kHz. Everything is muffled. The player's own footsteps sound closer than they should.
- **Beat 9 (Watcher, outside):** absolute stillness for four seconds when the knocking stops, then
  wind at full. *"The wind is relentless."*

### Foley — the chapter's centrepiece

Bare feet on: black wet sand → dry sand → soil → root → loose scree → dry slab → frost-shattered
slab. Seven distinct surface sets, no shared samples. Then:

- **From beat 6, mix in a wet component.** Subtle at first. By beat 8, every footfall on the left
  foot has a tacky, adhesive quality. Never say the word blood.
- **Breath** enters at beat 6 and becomes the loudest element on the fog shelf.
- **Cairn stones:** heavy, granular, low. Each of the fifteen placements (3 cairns × 5 stones) is
  its own recorded asset with its own weight. This is a forty-second interaction the player does
  three times; it cannot be a loop.

### The knocking

Chapter 2 does two things with it:

1. **Beat 4 is the longest continuous exposure to the knock pattern in the game** — three minutes,
   unbroken, while the player wanders the lower mansion looking for the second cup. This is the
   pattern-teaching scene, disguised as an errand.
2. **Beat 9 stops it.** *"The knocking has stopped."* The absence is a bigger event than any
   presence has been.

### Silence

One engineered silence: **four seconds** at beat 9, between the last knock and the first wind.
Absolute. No room tone.

---

## 7. The Pebble Economy

Introduced here; it runs to Chapter 05. The player is never told about it and there is no UI.

| Ch. | Event | Pebbles on Traveler | Pebbles on parapet |
|---|---|---|---|
| 01 | — | 0 | **3** (background dressing, unmentioned) |
| 02 | Found at the tideline, beat 2 (three of them, in the sand where the body lay) | **3** | 3 |
| 02 | Capstone placed → rolls → crosses over | **2** | **4** |
| 03 | *"Eat a pebble."* | **1** | 4 |
| 05 | The last one is spent holding the passage | **0** | — |
| 05 | *"Pebbles gone."* | 0 | **0** |

**Design note:** the parapet count must be readable. Shoot the parapet from a consistent angle in
Ch. 01 beat 8, Ch. 02 beat 9, and Ch. 03's Watcher scene, so the pebbles occupy the same screen
space each time and the change is legible without a cut-in. Players who notice will tell the
players who didn't, which is the correct distribution mechanism for a game like this.

---

## 8. World-Building Plants

| Object | Where | Pays off |
|---|---|---|
| **The body-print in the black sand** | Beat 2, where the player wakes | Ch. 04 — footprints that may be yours |
| **The second cup**, now dusted off and carried down | Beat 4 | Ch. 03 — *"A tea for two."* |
| **The Ones That Lost** — two more of them, standing in the scrub off the path, closer than in Ch. 01 | Beat 3 | Ch. 05 |
| **A dark shape far out in the black water** — smooth, curved, partly submerged, egg-scaled | Beat 1, visible only from one spot | Ch. 04 — the egg |
| **The cup that never lands** | Beat 5 | Ch. 06 — *"A cup. A pebble. Residue."* |
| **The hairline crack in the turret floor**, now a finger's width | Beat 9 | Ch. 05 |

---

## 9. Exit

The coda card. Then, over black, **the knocking returns** — much closer, and for the first time
with a wet quality to it, because there is blood on the knuckles.

Title card: **INVERSION**.
