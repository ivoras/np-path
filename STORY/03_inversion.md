# Chapter 03 — INVERSION

> **Source:** PATH.pdf pp. 13–16
> **Runtime:** 15–18 min — the shortest and most violent chapter of the first half
> **Voices:** Traveler (at the door) → Traveler (in the white) → Watcher
> **Cuts:** 3, one of them **player-triggered**
> **Puzzle:** The Knock (rhythm reproduction) — pays off audio planted in Ch. 01–02
> **Coda:** *"A tea for two. / Pebble eaters. / Contractions."*

---

## 1. Thematic Function

This is the chapter where **the player finds out they have been playing both sides of a locked
door**, and where the game's polarity flips.

Three loads:

1. **The knocker is you.** For two chapters the Watcher has been tormented by knocking. Now the
   player, as the Traveler, stands at that door with bloody knuckles and knocks. The reveal is
   structural, not stated: the puzzle *is* the reveal, because the pattern the player must
   reproduce is the pattern they have been hearing from the other side.
2. **Inversion of the white/dark ledger.** Ch. 02 ended in a white-out. Ch. 03 makes white the
   *substance* and dark the thing that pours out of it. Every value relationship the game has
   taught gets flipped for eight minutes, and it is physically uncomfortable.
3. **Ingestion.** *Eat a pebble.* The player puts a piece of the other world inside their body.
   This is the game's only grotesque act and it should be underplayed to the point of banality.

---

## 2. Spatial Flow

| # | Space | Verb | Duration |
|---|---|---|---|
| 1 | **The Door** — the mansion's front door, from outside, in a gale | Knock. **PUZZLE** | 7 min |
| 2 | **The Swallow** | Eat a pebble | 1 min |
| — | **PLAYER-TRIGGERED CUT** | | |
| 3 | **The White** — an unbounded white volume with no floor, no scale, no horizon | Walk toward a thing that recedes | 5 min |
| 4 | **The Crack** — a fissure in the white with darkness pouring out | Run | 2 min |
| 5 | **The Impact** | — | 20 s |
| — | **CUT** | | |
| 6 | **The Turret, after** — the Watcher on his knees | Find another cup | 3 min |

### Level-design rules

- **Beat 1 is a single static location.** The player cannot leave. They can walk the porch, look
  at the door, look at their own hands, look back at the moor. That is all. After two chapters of
  relentless forward motion, being **stopped at a threshold** is the chapter's first statement.
- **Beat 3 has no geometry.** Literally: an empty level with a white fog volume of infinite
  density and a single distant object. Player movement produces *no parallax against anything*.
  The only evidence the player is moving is footstep audio and their own breathing.
  - **The receding object** is a doorway-shaped darker patch. Its screen-space size is driven by a
    curve that grows *slower than* the player's approach, so it gets subjectively further as they
    close. Do not make it shrink — that reads as a trick. Make it grow, insufficiently.
  - *"Was I getting bigger?"* — over ~90 s, raise the player's eye height from 1.70 m to 2.40 m and
    lengthen their stride to match. Nobody will consciously detect it. Everybody will feel wrong.
- **Beat 4's crack must open where the player is not looking.** Detect look-direction, spawn it at
  ~70° off-axis. Let them find it.
- **Beat 6 is the mirror of Ch. 01 beat 8.** Same camera position on the parapet. The player should
  recognise the framing and immediately check the pebble count. (It is four. It stays four. The
  eaten pebble does not arrive — the transfer only runs one way, and only that one time. Never
  explain this.)

---

## 3. THE PUZZLE — *The Knock*

**Type:** rhythm reproduction from memory / long-range audio payoff
**Location:** the door, beat 1
**Solve time:** 5–8 min

### Setup

The door is oak, swollen, and **has no handle on this side.** Wind at full. The player's hands
are visible at the bottom of the frame and there is already blood on the knuckles.

Input: a single button. Press = one knock. That is the entire interface.

There is no prompt, no meter, no ghost-rhythm, no visual notation. The player knocks. Nothing
answers.

### The pattern

The pattern the door accepts is the pattern the Watcher has been hearing since Chapter 1 beat 6:

```
knock  ·  knock-knock  ·············  knock
  1         2    3                      4
0.00s     0.75s 1.05s                 3.40s
```

It has been playing, unremarked, behind:
- Ch. 01 beat 6 (the lower mansion) and beat 8 (audible up the stair)
- Ch. 02 beat 4 — **three unbroken minutes**, while the player hunts for the second cup

A player who was listening half-knows it. That is the design target: **not memorisation, but
recognition** — the "wait, I know this" feeling, arriving about ninety seconds into failing.

### Mechanic & feedback

Every attempt is evaluated against the pattern with a generous window (±180 ms per hit; the long
gap needs only to be *long*, anywhere from 2.4–4.5 s).

Feedback is entirely diegetic and entirely physical:

| Outcome | Response |
|---|---|
| **Wrong** | Nothing answers. The wind continues. **A new split opens on the knuckles** and blood transfers to the door. The door accumulates the record of every failure. |
| **Partially right** (first two hits correct) | The wind drops fractionally, for one second, then returns. The only positive signal in the puzzle. |
| **Right** | Silence. Total. Wind included. Six seconds. |

### The escalation

After ~8 failed attempts, the hands change: knuckles split to the bone, and the knock sound gains
a wet component. After ~15, the player character starts knocking **without input** — one
involuntary knock every few seconds, and the player has to work around their own body. This is
uncomfortable and it should be; it is also the game gently increasing the pattern's exposure,
because the involuntary knocks are always **hit 1** of the pattern.

### Solve — and the refusal

The correct pattern produces six seconds of absolute silence.

**Then nothing happens.** The door does not open. There is no answer. The player is left with a
silence that is worse than the wind, and the VO gives them *"There is no answer. / I'm lost."*

**The actual progression gate is what the player does next.** The hands, still at the bottom of
frame, open. In the left palm: **two white pebbles.**

The only interaction available is to raise one to the mouth. *Eat a pebble.*

Swallowing triggers the Cut — and it is the first Cut in the game the player *causes.* Establish
that they can do this; Chapter 05 will require it.

### Why this puzzle

- It converts three chapters of **passive ambient audio into an active demand**, retroactively
  making the player realise the game has been talking to them the whole time.
- The failure state is not a fail — it is a **body**. The cost of being wrong is written on the
  hands and on the door, permanently, and the door carries it into every later scene set at that
  door.
- It answers the question the first two chapters posed (*who is knocking?*) by making the player
  do it, which is the only way this story can answer anything.
- The refusal after the correct answer is the game's central cruelty and its central honesty:
  **solving it correctly changes nothing.** *Failure. The loop. Static.*

### Assist

At 4 minutes: the Watcher's voice, from inside the door, very faint, EQ'd through wood —
*"Every night they knock on the door."* — recycled from Ch. 01. It is a hint that the pattern is a
memory, not an invention.

At 6 minutes: the wind briefly carries the pattern itself, once, as if from a long way off. Once
only. Never loop a hint.

---

## 4. Voice-Over Script

**Verbatim from PATH.pdf.**

New treatment for this chapter: **the two voices begin to share a processing chain.** Until now
the Traveler was dry-close and the Watcher was stone-reverb. From Ch. 03 the Traveler's lines get
a faint stone tail and the Watcher's get closer, and by the coda they meet in the middle. Nobody
should be able to name the moment it happens.

| # | Trigger | Line (verbatim) | Treatment |
|---|---|---|---|
| 3.1 | First frame at the door, wind already at full | *"There's blood on my knuckles. Blood on the door."* | Present tense — the game's first. Note it and keep it. |
| 3.2 | ~6 s after the correct pattern, into the silence | *"There is no answer."* | Into absolute silence. The line is the loudest thing in the chapter because nothing else exists. |
| 3.3 | +3 s | *"I'm lost."* | |
| 3.4 | Wind returns, harder than before | *"The wind howls, bending the trees. The others drift. Where should I go? What is left?"* | **On "the others drift":** in the moor behind the porch, at the edge of visibility, the Ones That Lost are *moving* for the first time — a slow lateral drift, not walking, more like something being carried on a current. Two seconds. Then stop forever. |
| 3.5 | Hands open, showing the pebbles | *"Eat a pebble."* | **Flat. Domestic. Absolutely no menace.** The delivery of a man remembering to take a pill. This is the most important line-read in the game. |
| — | **PLAYER-TRIGGERED CUT** — the shutter sound is joined by a swallow | | |
| 3.6 | White. No image yet, just white. | *"I opened my eyes. I closed them again. All is white—the absence of dark, hard to focus on."* | **The autoexposure is wrong on purpose.** Let the frame bloom past legibility for two seconds before it settles, so the player's own eyes do the adjusting. |
| 3.7 | Player takes first step | *"I walked towards it."* | |
| 3.8 | ~90 s in, as eye-height reaches full drift | *"The closer I got, the further away it seemed."* | |
| 3.9 | +6 s | *"Was I getting bigger?"* | The player's hands, held out in front, are now visibly too large for the frame. |
| 3.10 | Crack opens off-axis | *"A crack appeared. Only darkness poured from it. I walked. Faster."* | Movement speed unlocks above walk for the only time in the game. |
| 3.11 | Full sprint | *"It turned into a run."* | |
| 3.12 | Impact | *"I hit the white."* | |
| 3.13 | +1 s | *"The white hit me back."* | **Reverse the entire audio bed** for 400 ms on this line — take the preceding second of mix, reverse it, and play it. |
| 3.14 | | *"It burst."* | See §5 — the burst frame. |
| — | **CUT** | | |
| 3.15 | Turret. The Watcher on hands and knees. | *"I vomited."* | Do not show it. Camera is down at the flagstones; we see the crack in the floor, wider now, and the shadow of a head. |
| 3.16 | The knocking resumes — the same pattern the player just performed | *"Someone was knocking."* | The player has to sit with the fact that they are hearing themselves. |
| 3.17 | Player looks at the parapet: one cup gone (Ch. 02), four pebbles | *"Have to find another cup."* | Chapter ends on the descent toward the shelf where the second cup has been since Ch. 01. Do not let the player reach it. Cut on the stair. |

### Coda card

```
A tea for two.
Pebble eaters.
Contractions.
```

**Print this card in inverse** — moor-black type on a bone-white field — the only inverted coda in
the game. Then it flips to normal over 12 frames, with the channel misregistration snapping to
zero at the moment of flip. One frame of perfect registration. The only one in the game outside
the Ch. 01 lens solve.

---

## 5. Visual Design

### The inversion, in three stages

**Stage 1 — The Door (beat 1).** Darkest scene in the game so far. The porch is a black interior
frame; the moor beyond is petrol; the only bone is the player's own knuckles, and the only ember
is the blood, which reads as ember-on-bone. **Value range compressed to the bottom third of the
histogram.** Then hold there for seven minutes so the eye fully adapts.

**Stage 2 — The White (beats 3–4).** Cut to the top third. No midtones. This should genuinely
hurt after seven minutes of adaptation, and that is the design.

- **Bone `#EDE2C2` becomes the ground, the air, and the light simultaneously.** There is no key,
  no ambient, no sky — the fog *is* the illumination.
- **No shadows. No horizon. No scale reference.** The player's hands are the only object in the
  world with an edge.
- **The receding doorway** is the single non-white thing: moor black, hard-edged, no gradient,
  like a hole punched in paper. It has no perspective — it is a **flat shape** that never turns to
  face you, because it is not a 3D object. It is a hole in the image.
- **Grain doubles.** On a white field the paper tooth becomes the dominant visual texture; the
  screen should look like blank stock under a loupe.

**Stage 3 — The Crack (beat 4).** Dark re-enters, but as a *fluid*. The darkness pouring from the
crack must behave like ink in water, not like shadow: use a simulated flow, not a light falloff.
It pools on a floor that does not exist.

### The burst frame

*"It burst."* Exactly this, exactly in this order:

1. One frame: the cover image of the book — the bone path, ember verges, the cracked egg in the
   black disc — held for **1 frame only**, at full saturation. Most players will not consciously
   see it. Some will. Both outcomes are correct.
2. Six frames of moor black.
3. Two frames of analogue static (reuse the exact asset from Ch. 01's *"Static."*).
4. Black, held, with only the sound of a stone stairwell.

### Texture & post

- **Misregistration inverts.** Through beats 1–2 it is at Ch. 02's elevated 4 px. In the white
  (beat 3) it goes to **zero** — a perfectly registered, perfectly flat white image — which reads
  as death, not as clarity. Then it explodes to 12 px on the burst.
- **The lens smear from Ch. 01 is still there**, and on a pure white field it is finally,
  horribly, fully visible. Players will realise they have been looking through it for an hour.

### Signature frames

- The door, filling the frame, in the dark, with blood accumulating on it over seven minutes as a
  visible record of the player's failures. **Screenshot-comparable between players.**
- The two white pebbles in a bloody palm.
- The white void with two enormous hands held out in it.
- The black doorway-shape, unchanged in size, with a running player's audio underneath.
- The Watcher's shadow on the turret flagstones, on all fours, beside a crack.

---

## 6. Audio Design

### Score

**Chapter 03 has almost no score, and then has all of it.**

- Beats 1–2: nothing. Wind and knocking only. Seven minutes with no music at all — the longest
  scoreless stretch since the fog shelf, and deliberately back-to-back with it.
- Beat 3 (the white): the **female voice texture**, alone, for the first time. A single sustained
  tone, no vibrato, no words, slowly detuning against itself in two layers about 7 cents apart, so
  it beats at ~1.5 Hz. Nothing else. It should read as tinnitus that happens to be beautiful.
- Beat 4: pump organ re-enters, playing the Ch. 01 chord — but **inverted** (literally: invert the
  intervals about the root). Same notes, wrong shape.
- The burst: everything at once, one hit, 100 ms, then gone.

### The knock — sound design spec

This is the most-heard sound in the game and needs its own asset budget.

- Recorded on real swollen oak with a bare human fist. **Never a foley substitute.**
- **Two libraries:** *outside* (what the Traveler makes, close, dry, with hand-flesh in it) and
  *inside* (what the Watcher hears — the same performances, re-amped through a real door and
  recorded from the far side of a stone room). They must be the same takes, so that a player who
  hears both recognises them as one event.
- The wet component after 8 failures is a separate layer, mixed in at increasing gain, never
  replacing the dry.

### Ambient

- **Beat 1:** wind at the highest sustained level in the game. Trees bending. It must be genuinely
  tiring to listen to, so that the six-second silence lands like a physical event.
- **Beat 3 (the white):** **no ambient at all.** Footsteps and breath only, and both are wrong —
  the footsteps have no surface (use a dry, tiny, almost-clean impact with zero tail) and the
  breath has no room. This is the emptiest mix in the game.
- **Beat 6:** stone stairwell tone, close. Comfortingly real after the white.

### The silence

The **six-second absolute silence** after the correct knock is the pivot of the entire first half
of the game. Specification:

- All buses to `-inf`. Not a duck, not a filter. Nothing.
- Six seconds. Not five.
- Break it with **VO only** — *"There is no answer."* — with no bed underneath it.
- The wind returns 3 s later, at +4 dB over its previous level, with no fade.

### Foley

- **Bare feet in the white:** as above, surfaceless. Design brief for the recordist: "the sound of
  a foot landing on nothing, recorded in an anechoic chamber, and then made smaller."
- **The swallow.** One asset, recorded properly, with the stone's actual weight in it — a dry
  click at the back of the throat and then a slow descent. It plays over the Cut's shutter sound
  and continues *after* the white has arrived, for four full seconds. The player should still be
  swallowing the pebble when they get to the other world.

---

## 7. Continuity Ledger

| Item | State entering Ch. 03 | State leaving |
|---|---|---|
| Traveler pebbles | 2 | **1** |
| Parapet pebbles | 4 | 4 (unchanged — the transfer does not run this way) |
| Teacups | 1 lost over the parapet (Ch. 02); 1 dusty on the mansion shelf | Watcher descending to fetch the second |
| The Traveler's hands | scraped | **split to the bone, permanent for the rest of the game** |
| The door | clean | **bloodied, permanently** |
| Turret floor crack | a finger's width | **a hand's width** |
| Movement speed | –15% (Ch. 02 limp) | –15%, plus sprint unlocked once and revoked |
| Misregistration | 4 px | 12 px, settling to 6 px |
| Ones That Lost | static | **moved once, for two seconds.** Never again. |

---

## 8. Exit

Cut on the stair, mid-step, with the Watcher's hand reaching for a cup he does not reach.

Coda card (inverted, per §4). Then black, and in the black: **surf, and thick foliage, and no
wildlife at all.**

Title card: **EXPANSION**.
